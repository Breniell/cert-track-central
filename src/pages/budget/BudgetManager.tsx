
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer 
} from "recharts";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Calendar } from "lucide-react";
import { budgetService } from "@/services/budgetService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function BudgetManager() {
  // Définir la période par défaut sur les 3 derniers mois
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Simuler des données budgétaires (à remplacer par des données réelles provenant de l'API)
  const budgetData = budgetService.getBudgetOverview();
  
  // Filtrer les données en fonction de la période sélectionnée
  const filteredData = budgetData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= dateRange.from && itemDate <= dateRange.to;
  });
  
  // Données pour le graphique en camembert (répartition des dépenses par type)
  const pieData = [
    { name: 'Formations HSE', value: 45000000 },
    { name: 'Formations Métiers', value: 32000000 },
    { name: 'Formateurs Externes', value: 18000000 },
    { name: 'Location Salles', value: 5000000 },
    { name: 'Matériel Pédagogique', value: 2000000 },
  ];
  
  // Données pour le graphique en barres (évolution mensuelle)
  const barData = [
    { month: 'Jan', depenses: 8500000, budget: 10000000 },
    { month: 'Fév', depenses: 9200000, budget: 10000000 },
    { month: 'Mars', depenses: 11000000, budget: 10000000 },
    { month: 'Avr', depenses: 9800000, budget: 10000000 },
    { month: 'Mai', depenses: 10200000, budget: 12000000 },
    { month: 'Juin', depenses: 12500000, budget: 12000000 },
  ];

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({ 
        from: range.from, 
        to: range.to || range.from 
      });
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion du Budget</h1>
            <p className="text-muted-foreground">Suivi des dépenses et analyse budgétaire des formations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DatePickerWithRange 
                date={dateRange} 
                onDateChange={handleDateRangeChange} 
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="hse">HSE</SelectItem>
                <SelectItem value="rh">Ressources Humaines</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Budget Total Formations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">102.000.000 FCFA</div>
              <p className="text-xs text-muted-foreground">Exercice 2024-2025</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Dépenses Actuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">61.200.000 FCFA</div>
              <p className="text-xs text-muted-foreground">60% du budget utilisé</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Coût Moyen par Formation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.750.000 FCFA</div>
              <p className="text-xs text-muted-foreground">35 formations réalisées</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails des dépenses</TabsTrigger>
            <TabsTrigger value="roi">Analyse ROI</TabsTrigger>
            <TabsTrigger value="forecast">Prévisions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition du Budget</CardTitle>
                  <CardDescription>
                    Répartition des dépenses par catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()} FCFA`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Évolution Mensuelle</CardTitle>
                  <CardDescription>
                    Dépenses mensuelles vs budget alloué
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()} FCFA`} />
                      <Legend />
                      <Bar dataKey="depenses" name="Dépenses" fill="#8884d8" />
                      <Bar dataKey="budget" name="Budget" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Détail des Dépenses</CardTitle>
                    <CardDescription>Liste des dépenses par formation</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Exporter en Excel
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Filtrer par date
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Sécurité en hauteur</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">15/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Production</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">1.850.000 FCFA</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">12</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Manipulation produits chimiques</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">18/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">HSE</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">2.150.000 FCFA</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">15</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Leadership et Management</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">22/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">RH</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">3.250.000 FCFA</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">8</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roi">
            <Card>
              <CardHeader>
                <CardTitle>Analyse de Retour sur Investissement</CardTitle>
                <CardDescription>Évaluation de l'impact financier des formations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">ROI Global</h3>
                      <p className="text-2xl font-bold text-green-600">142%</p>
                      <p className="text-xs text-muted-foreground">Estimation sur 12 mois</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Économies Générées</h3>
                      <p className="text-2xl font-bold">87.500.000 FCFA</p>
                      <p className="text-xs text-muted-foreground">Réduction des incidents et arrêts</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Productivité Améliorée</h3>
                      <p className="text-2xl font-bold">+18%</p>
                      <p className="text-xs text-muted-foreground">Augmentation moyenne</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">ROI par Département</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-1/4 font-medium">Production</div>
                        <div className="w-3/4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>ROI: 185%</span>
                            <span>Coût: 28.500.000 FCFA</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/4 font-medium">Maintenance</div>
                        <div className="w-3/4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>ROI: 145%</span>
                            <span>Coût: 15.800.000 FCFA</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/4 font-medium">HSE</div>
                        <div className="w-3/4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>ROI: 210%</span>
                            <span>Coût: 12.400.000 FCFA</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/4 font-medium">RH</div>
                        <div className="w-3/4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>ROI: 108%</span>
                            <span>Coût: 4.500.000 FCFA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>Prévisions Budgétaires</CardTitle>
                <CardDescription>Estimations et projections pour les prochains mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Budget Restant</h3>
                      <p className="text-2xl font-bold">40.800.000 FCFA</p>
                      <p className="text-xs text-muted-foreground">40% du budget total</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Dépenses Prévues</h3>
                      <p className="text-2xl font-bold">35.500.000 FCFA</p>
                      <p className="text-xs text-muted-foreground">Pour les 6 prochains mois</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Solde Prévisionnel</h3>
                      <p className="text-2xl font-bold text-green-600">5.300.000 FCFA</p>
                      <p className="text-xs text-muted-foreground">Excédent prévu</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-4">Planning Prévisionnel des Dépenses</h3>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Alloué</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dépenses Prévues</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formations Planifiées</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Avril 2025</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">8.500.000 FCFA</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">7.800.000 FCFA</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">3</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Mai 2025</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">9.200.000 FCFA</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">9.500.000 FCFA</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">4</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Juin 2025</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">7.800.000 FCFA</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">6.200.000 FCFA</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">2</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter Prévisions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
