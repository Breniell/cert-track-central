
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { budgetService } from "@/services/budgetService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, PieChart as PieChartIcon, BarChart as BarChartIcon, LineChart as LineChartIcon, DollarSign } from "lucide-react";

export default function BudgetReporting() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-03-31");

  const { data: budgetReport, isLoading, error, refetch } = useQuery({
    queryKey: ["budgetReport", startDate, endDate],
    queryFn: () => budgetService.generateBudgetReport(startDate, endDate)
  });

  const handleGenerateReport = () => {
    refetch();
    toast({
      title: "Rapport généré",
      description: `Rapport budgétaire du ${startDate} au ${endDate} généré avec succès.`
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport est en cours d'exportation au format Excel."
    });
    // Dans un cas réel, déclencherait le téléchargement d'un fichier
  };

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reporting Budgétaire</h2>
        <Button onClick={handleExportReport} className="gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Période du rapport</CardTitle>
          <CardDescription>Sélectionnez la période pour générer le rapport budgétaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateReport} className="w-full">Générer le rapport</Button>
        </CardFooter>
      </Card>

      {isLoading ? (
        <div className="text-center p-8">Chargement du rapport budgétaire...</div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">Erreur lors du chargement du rapport.</div>
      ) : budgetReport ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Coût Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <DollarSign className="h-10 w-10 text-primary" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{budgetReport.coutTotal.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Formations Réalisées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <BarChartIcon className="h-10 w-10 text-blue-500" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{budgetReport.formationsRealisees}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Coût Moyen / Formation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <LineChartIcon className="h-10 w-10 text-green-500" />
                  <div className="text-right">
                    <p className="text-3xl font-bold">{budgetReport.coutMoyenParFormation.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="repartition">
            <TabsList>
              <TabsTrigger value="repartition">Répartition</TabsTrigger>
              <TabsTrigger value="evolution">Évolution</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>
            
            <TabsContent value="repartition">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des coûts par type de formation</CardTitle>
                  <CardDescription>Visualisation de la distribution des budgets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetReport.coutParType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="montant"
                          nameKey="type"
                        >
                          {budgetReport.coutParType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="evolution">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des coûts</CardTitle>
                  <CardDescription>Évolution mensuelle des dépenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={budgetReport.coutParMois}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mois" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                        <Legend />
                        <Line type="monotone" dataKey="montant" name="Coût" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Détails des coûts</CardTitle>
                  <CardDescription>Breakdown détaillé des dépenses par type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetReport.coutParType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                        <Legend />
                        <Bar dataKey="montant" name="Montant" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3 text-left text-sm font-medium text-gray-500">Type</th>
                          <th className="p-3 text-right text-sm font-medium text-gray-500">Montant (FCFA)</th>
                          <th className="p-3 text-right text-sm font-medium text-gray-500">Pourcentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetReport.coutParType.map((type, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 text-sm">{type.type}</td>
                            <td className="p-3 text-sm text-right">{type.montant.toLocaleString()}</td>
                            <td className="p-3 text-sm text-right">{type.pourcentage}%</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td className="p-3 text-sm">Total</td>
                          <td className="p-3 text-sm text-right">{budgetReport.coutTotal.toLocaleString()}</td>
                          <td className="p-3 text-sm text-right">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de performance</CardTitle>
              <CardDescription>Mesures clés de performance financière</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Coût moyen par participant</p>
                    <p className="text-2xl font-bold">{budgetReport.coutMoyenParParticipant.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ROI estimé</p>
                    <p className="text-2xl font-bold text-green-600">+15%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Économies réalisées vs. formations externes</p>
                    <p className="text-2xl font-bold text-green-600">2,450,000 FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Optimisation budgétaire</p>
                    <p className="text-2xl font-bold text-green-600">+8.5%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
