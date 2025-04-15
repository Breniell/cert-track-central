
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronRight, Download, FileText, PieChart, TrendingUp, DollarSign, BarChart3, Search } from "lucide-react";
import { budgetService } from "@/services/budgetService";
import { useQuery } from "@tanstack/react-query";

export default function BudgetManager() {
  const [activeTab, setActiveTab] = useState("budget");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2024, 0, 1), // Jan 1, 2024
    to: new Date(2024, 11, 31), // Dec 31, 2024
  });

  const { data: budgetReport, isLoading } = useQuery({
    queryKey: ['budgetReport', dateRange],
    queryFn: () => budgetService.generateBudgetReport(
      dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '2024-01-01',
      dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '2024-12-31'
    ),
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Gestion Budgétaire
            </h1>
            <p className="text-muted-foreground">
              Suivi des coûts, analyse et ROI des formations
            </p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "P", { locale: fr })} - {format(dateRange.to, "P", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "P", { locale: fr })
                    )
                  ) : (
                    "Sélectionner une période"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="budget">Tableau de bord budget</TabsTrigger>
            <TabsTrigger value="detail">Détail des coûts</TabsTrigger>
            <TabsTrigger value="roi">Analyse ROI</TabsTrigger>
            <TabsTrigger value="prevision">Prévisions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="budget">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Coût Total</CardTitle>
                  <CardDescription>Période sélectionnée</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      "Chargement..."
                    ) : (
                      `${budgetReport?.coutTotal.toLocaleString()} FCFA`
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {budgetReport?.formationsRealisees || 0} formations
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Coût par Formation</CardTitle>
                  <CardDescription>Moyenne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      "Chargement..."
                    ) : (
                      `${budgetReport?.coutMoyenParFormation.toLocaleString()} FCFA`
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Min: {isLoading ? "..." : "435,000"} FCFA | Max: {isLoading ? "..." : "950,000"} FCFA
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Coût par Participant</CardTitle>
                  <CardDescription>Moyenne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      "Chargement..."
                    ) : (
                      `${budgetReport?.coutMoyenParParticipant.toLocaleString()} FCFA`
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basé sur 45 participants
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des coûts par type</CardTitle>
                  <CardDescription>
                    Distribution du budget par catégorie de formation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-24 w-24 mx-auto mb-4 text-muted-foreground opacity-30" />
                      <p className="text-muted-foreground">Graphique de répartition des coûts</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    {isLoading ? (
                      <p>Chargement des données...</p>
                    ) : (
                      budgetReport?.coutParType.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : "bg-amber-500"
                            }`}></div>
                            <span>{item.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{item.montant.toLocaleString()} FCFA</span>
                            <Badge variant="outline">{item.pourcentage}%</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des coûts</CardTitle>
                  <CardDescription>
                    Tendance mensuelle des dépenses de formation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-24 w-24 mx-auto mb-4 text-muted-foreground opacity-30" />
                      <p className="text-muted-foreground">Graphique d'évolution des coûts</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    {isLoading ? (
                      <p>Chargement des données...</p>
                    ) : (
                      budgetReport?.coutParMois.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{item.mois}</span>
                          <span>{item.montant.toLocaleString()} FCFA</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="detail">
            <Card>
              <CardHeader>
                <CardTitle>Détail des coûts par formation</CardTitle>
                <CardDescription>
                  Analyse détaillée des dépenses par formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher une formation..."
                      className="pl-8"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type de formation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="hse">HSE</SelectItem>
                        <SelectItem value="metier">Métier</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Sécurité en hauteur</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge>HSE</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">15/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Jean Dupont</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">8</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">475,000 FCFA</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Manipulation des produits chimiques</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge>HSE</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">18/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Marie Martin</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">6</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">435,000 FCFA</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Maintenance préventive</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">Métier</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">20/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Pierre Dubois</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">12</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">950,000 FCFA</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Répartition des coûts par poste</CardTitle>
                <CardDescription>
                  Analyse des différentes composantes du budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                        <p className="text-muted-foreground">Graphique de répartition par poste</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Formateurs</span>
                        <span>950,000 FCFA (51%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "51%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Matériel</span>
                        <span>275,000 FCFA (15%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Salles</span>
                        <span>320,000 FCFA (17%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "17%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Restauration</span>
                        <span>315,000 FCFA (17%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "17%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roi">
            <Card>
              <CardHeader>
                <CardTitle>Analyse du Retour sur Investissement</CardTitle>
                <CardDescription>
                  Évaluation de l'impact financier des formations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Investissement Total</CardTitle>
                      <CardDescription>Période sélectionnée</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">1,860,000 FCFA</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Bénéfices Estimés</CardTitle>
                      <CardDescription>Impact sur la productivité</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">2,790,000 FCFA</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">ROI Global</CardTitle>
                      <CardDescription>Retour sur investissement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">+50%</div>
                      <p className="text-sm text-muted-foreground">
                        Période d'amortissement: 8 mois
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>ROI par Type de Formation</CardTitle>
                      <CardDescription>
                        Comparaison des retours par catégorie
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Formations HSE</p>
                            <p className="text-sm text-muted-foreground">Sécurité et prévention</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">+65%</p>
                            <p className="text-sm text-muted-foreground">Amortissement: 6 mois</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Formations Métiers</p>
                            <p className="text-sm text-muted-foreground">Compétences techniques</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">+45%</p>
                            <p className="text-sm text-muted-foreground">Amortissement: 10 mois</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Formations Urgentes</p>
                            <p className="text-sm text-muted-foreground">Réponse aux urgences</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">+35%</p>
                            <p className="text-sm text-muted-foreground">Amortissement: 12 mois</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution du ROI</CardTitle>
                      <CardDescription>
                        Tendance du retour sur investissement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                          <p className="text-muted-foreground">Graphique d'évolution du ROI</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Facteurs d'impact sur le ROI</CardTitle>
                    <CardDescription>
                      Éléments contribuant au retour sur investissement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md">
                        <div className="bg-green-100 p-2 rounded-full">
                          <TrendingUp className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                          <h3 className="font-medium">Réduction des accidents de travail</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Les formations HSE ont permis de réduire le nombre d'accidents de travail de 30%,
                            générant une économie estimée à 950,000 FCFA en frais médicaux et arrêts de travail.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <TrendingUp className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-medium">Amélioration de la productivité</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Les formations techniques ont augmenté la productivité des équipes de 15%,
                            représentant un gain estimé à 1,200,000 FCFA sur la période.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <TrendingUp className="h-6 w-6 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="font-medium">Réduction des défauts de qualité</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            La formation en contrôle qualité a permis de réduire les défauts de production de 25%,
                            générant une économie de 640,000 FCFA en matériaux et reprises.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prevision">
            <Card>
              <CardHeader>
                <CardTitle>Prévisions Budgétaires</CardTitle>
                <CardDescription>
                  Planification et prévisions pour les périodes futures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Budget Prévisionnel</CardTitle>
                      <CardDescription>Année 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">4,750,000 FCFA</div>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>+12% vs 2024</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Formations Planifiées</CardTitle>
                      <CardDescription>Année 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">24</div>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>+6 vs 2024</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">ROI Prévisionnel</CardTitle>
                      <CardDescription>Année 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">+55%</div>
                      <p className="text-sm text-muted-foreground">
                        Basé sur les tendances actuelles
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition prévisionnelle par trimestre</CardTitle>
                      <CardDescription>
                        Planification budgétaire 2025
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trimestre</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formations HSE</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formations Métiers</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% du total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium">T1 2025</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">3</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">2</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">1,200,000 FCFA</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">25%</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium">T2 2025</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">4</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">1</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">950,000 FCFA</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">20%</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium">T3 2025</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">2</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">3</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">1,300,000 FCFA</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">27%</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium">T4 2025</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">5</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">4</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">1,300,000 FCFA</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">28%</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ajustement budgétaire</CardTitle>
                        <CardDescription>
                          Outil de simulation et planification
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="budget">Budget total (FCFA)</Label>
                            <Input id="budget" type="number" defaultValue="4750000" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="formationsHSE">Formations HSE</Label>
                              <Input id="formationsHSE" type="number" defaultValue="14" />
                            </div>
                            <div>
                              <Label htmlFor="formationsMetier">Formations Métier</Label>
                              <Input id="formationsMetier" type="number" defaultValue="10" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="coutFormateur">Coût formateurs (%)</Label>
                              <Input id="coutFormateur" type="number" defaultValue="50" />
                            </div>
                            <div>
                              <Label htmlFor="coutMateriel">Coût matériel (%)</Label>
                              <Input id="coutMateriel" type="number" defaultValue="15" />
                            </div>
                          </div>
                          
                          <Button className="w-full">
                            Simuler
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Optimisation du budget</CardTitle>
                        <CardDescription>
                          Recommandations basées sur l'historique
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <BarChart3 className="h-6 w-6 text-blue-700" />
                            </div>
                            <div>
                              <h3 className="font-medium">Optimisation des groupes</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Augmenter la taille moyenne des groupes de 8 à 10 participants générerait
                                une économie estimée à 450,000 FCFA sans impact sur la qualité.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md">
                            <div className="bg-green-100 p-2 rounded-full">
                              <BarChart3 className="h-6 w-6 text-green-700" />
                            </div>
                            <div>
                              <h3 className="font-medium">Mutualisation des formations</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Combiner certaines formations HSE similaires permettrait
                                d'économiser environ 320,000 FCFA en frais de formateurs et logistique.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <BarChart3 className="h-6 w-6 text-amber-700" />
                            </div>
                            <div>
                              <h3 className="font-medium">Investissement formateurs internes</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Former 2 formateurs internes supplémentaires générerait un coût initial
                                de 750,000 FCFA mais un ROI de 35% dès la première année.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
