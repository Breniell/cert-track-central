
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpFromLine, ArrowDownFromLine, Download, Calendar, TrendingDown, TrendingUp, DollarSign } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface BudgetAnalysisProps {
  formationId?: number;
  departement?: string;
}

export default function BudgetAnalysis({ formationId, departement }: BudgetAnalysisProps) {
  const [period, setPeriod] = useState<"mensuel" | "trimestriel" | "annuel">("mensuel");
  
  // Données simulées pour la démonstration
  const budgetData = [
    { name: 'Jan', budget: 4000, depense: 2400, economie: 1600 },
    { name: 'Fév', budget: 3000, depense: 2800, economie: 200 },
    { name: 'Mar', budget: 2000, depense: 1800, economie: 200 },
    { name: 'Avr', budget: 2780, depense: 2500, economie: 280 },
    { name: 'Mai', budget: 1890, depense: 1700, economie: 190 },
    { name: 'Juin', budget: 2390, depense: 2100, economie: 290 },
  ];
  
  const repartitionData = [
    { name: "Formateurs", value: 55 },
    { name: "Salles", value: 15 },
    { name: "Matériel", value: 10 },
    { name: "Restauration", value: 12 },
    { name: "Administration", value: 8 },
  ];
  
  const roiData = [
    { name: 'Jan', roi: 1.2 },
    { name: 'Fév', roi: 1.1 },
    { name: 'Mar', roi: 1.3 },
    { name: 'Avr', roi: 1.4 },
    { name: 'Mai', roi: 1.6 },
    { name: 'Juin', roi: 1.8 },
  ];
  
  const formatCout = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(value) + " FCFA";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold">Analyse budgétaire et ROI</h2>
          <p className="text-sm text-gray-500">
            Suivi financier {formationId ? "de la formation" : departement ? `du département ${departement}` : "global"}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select
            value={period}
            onValueChange={(value: "mensuel" | "trimestriel" | "annuel") => setPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensuel">Vue mensuelle</SelectItem>
              <SelectItem value="trimestriel">Vue trimestrielle</SelectItem>
              <SelectItem value="annuel">Vue annuelle</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Budget total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">16.800.000 FCFA</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+2.5%</span>
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Coût moyen / formation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">1.250.000 FCFA</span>
              <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>-1.2%</span>
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">ROI moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">1.4x</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0.2</span>
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="budget">
        <TabsList>
          <TabsTrigger value="budget">Budget & Dépenses</TabsTrigger>
          <TabsTrigger value="repartition">Répartition des coûts</TabsTrigger>
          <TabsTrigger value="roi">Analyse ROI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Évolution budget vs dépenses</CardTitle>
              <CardDescription>
                Suivi mensuel des budgets alloués et des dépenses réelles
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={budgetData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCout} />
                  <Tooltip formatter={(value) => formatCout(value as number)} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget alloué" fill="#8884d8" />
                  <Bar dataKey="depense" name="Dépenses réelles" fill="#82ca9d" />
                  <Bar dataKey="economie" name="Économies" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="repartition">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des coûts</CardTitle>
              <CardDescription>
                Distribution des dépenses par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center">
              <div className="h-64 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={repartitionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {repartitionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 space-y-2 mt-4 md:mt-0 md:pl-8">
                {repartitionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Coût total</span>
                    <span className="font-bold">12.500.000 FCFA</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">sur la période sélectionnée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roi">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du ROI</CardTitle>
              <CardDescription>
                Retour sur investissement des formations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}x`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="roi" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="ROI" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Analyse comparative des économies réalisées</CardTitle>
          <CardDescription>
            Comparaison entre coûts de la formation manuelle vs. automatisée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowUpFromLine className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Coûts processus manuel</span>
                </div>
                <span className="font-bold">25.800.000 FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowDownFromLine className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Coûts processus actuel</span>
                </div>
                <span className="font-bold">16.800.000 FCFA</span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Économies réalisées</span>
                </div>
                <span className="font-bold text-green-600">9.000.000 FCFA</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Détail des économies par activité</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Réduction temps administratif</span>
                  <span className="font-medium">4.500.000 FCFA</span>
                </li>
                <li className="flex justify-between">
                  <span>Optimisation heures formateurs</span>
                  <span className="font-medium">2.800.000 FCFA</span>
                </li>
                <li className="flex justify-between">
                  <span>Réduction erreurs et défauts</span>
                  <span className="font-medium">1.200.000 FCFA</span>
                </li>
                <li className="flex justify-between">
                  <span>Économies matérielles</span>
                  <span className="font-medium">500.000 FCFA</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 mt-2 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Période d'amortissement estimée: 2,5 ans</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
