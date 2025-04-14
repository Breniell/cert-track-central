
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { BarChart3, Download, Euro, LineChart, PieChart, TrendingUp } from "lucide-react";

export default function Budget() {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  
  const handleExportReport = () => {
    toast({
      title: "Rapport exporté",
      description: "Le rapport budgétaire a été exporté avec succès."
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestion budgétaire et ROI</h1>
            <p className="text-gray-500">
              Analyse financière des formations et retour sur investissement
            </p>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Trimestre actuel</SelectItem>
                <SelectItem value="previous">Trimestre précédent</SelectItem>
                <SelectItem value="year">Année en cours</SelectItem>
                <SelectItem value="lastyear">Année précédente</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Budget total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">32 480 000 FCFA</div>
                <div className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Comparé à la période précédente</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Dépenses réalisées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">18 720 000 FCFA</div>
                <div className="text-sm text-gray-600">58% du budget</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: "58%" }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">ROI estimé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-green-600">127%</div>
                <div className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Retour sur investissement annuel projeté</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails des coûts</TabsTrigger>
            <TabsTrigger value="roi">Analyse ROI</TabsTrigger>
            <TabsTrigger value="forecast">Prévisions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Répartition des dépenses
                </CardTitle>
                <CardDescription>
                  Ventilation du budget par type de formation et catégorie de dépense
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-32 w-32 mx-auto text-gray-300" />
                  <p className="mt-4 text-sm text-gray-500">
                    Le graphique de répartition des dépenses serait affiché ici
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    toast({
                      title: "Détails des dépenses",
                      description: "Les dépenses sont réparties en: Formations HSE (40%), Formations Métier (35%), Formation des formateurs (15%), Autres (10%)"
                    });
                  }}>
                    Afficher les détails
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <LineChart className="mr-2 h-5 w-5" />
                    Évolution des dépenses
                  </CardTitle>
                  <CardDescription>
                    Suivi mensuel des dépenses de formation
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-60 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-32 w-32 mx-auto text-gray-300" />
                    <p className="mt-4 text-sm text-gray-500">
                      Le graphique d'évolution des dépenses serait affiché ici
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Euro className="mr-2 h-5 w-5" />
                    Coût moyen par formation
                  </CardTitle>
                  <CardDescription>
                    Comparaison des coûts moyens par type de formation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Formation HSE</span>
                        <span className="text-sm font-medium">1 312 000 FCFA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Formation Métier</span>
                        <span className="text-sm font-medium">1 640 000 FCFA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Formation Urgente</span>
                        <span className="text-sm font-medium">984 000 FCFA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Formation d'Accueil</span>
                        <span className="text-sm font-medium">328 000 FCFA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Coût moyen global</span>
                      <span className="font-medium">1 066 000 FCFA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Détails des coûts par formation</CardTitle>
                <CardDescription>
                  Ventilation détaillée des coûts pour chaque session de formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formateur</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût/participant</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Sécurité en hauteur</div>
                          <div className="text-sm text-gray-500">HSE - 15/03/2024</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Jean Dupont</td>
                        <td className="px-6 py-4 whitespace-nowrap">8</td>
                        <td className="px-6 py-4 whitespace-nowrap">1 476 000 FCFA</td>
                        <td className="px-6 py-4 whitespace-nowrap">184 500 FCFA</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Manipulation produits chimiques</div>
                          <div className="text-sm text-gray-500">HSE - 18/03/2024</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Marie Martin</td>
                        <td className="px-6 py-4 whitespace-nowrap">6</td>
                        <td className="px-6 py-4 whitespace-nowrap">984 000 FCFA</td>
                        <td className="px-6 py-4 whitespace-nowrap">164 000 FCFA</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Maintenance préventive</div>
                          <div className="text-sm text-gray-500">Métier - 20/03/2024</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Pierre Dubois</td>
                        <td className="px-6 py-4 whitespace-nowrap">12</td>
                        <td className="px-6 py-4 whitespace-nowrap">1 968 000 FCFA</td>
                        <td className="px-6 py-4 whitespace-nowrap">164 000 FCFA</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Intervention d'urgence</div>
                          <div className="text-sm text-gray-500">HSE - 12/03/2024</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Sophie Leroux</td>
                        <td className="px-6 py-4 whitespace-nowrap">5</td>
                        <td className="px-6 py-4 whitespace-nowrap">820 000 FCFA</td>
                        <td className="px-6 py-4 whitespace-nowrap">164 000 FCFA</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Accueil sous-traitants</div>
                          <div className="text-sm text-gray-500">HSE - 22/03/2024</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Michel Bernard</td>
                        <td className="px-6 py-4 whitespace-nowrap">3</td>
                        <td className="px-6 py-4 whitespace-nowrap">328 000 FCFA</td>
                        <td className="px-6 py-4 whitespace-nowrap">109 333 FCFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={handleExportReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter le tableau
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roi">
            <Card>
              <CardHeader>
                <CardTitle>Analyse du retour sur investissement</CardTitle>
                <CardDescription>
                  Évaluation détaillée du ROI pour chaque catégorie de formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">ROI des formations HSE</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Investissement</div>
                        <div className="text-xl font-bold">11 480 000 FCFA</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Bénéfices estimés</div>
                        <div className="text-xl font-bold text-green-600">26 240 000 FCFA</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">ROI calculé</div>
                        <div className="text-xl font-bold text-green-600">129%</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Le ROI élevé des formations HSE s'explique par la réduction significative des accidents de travail, 
                      des arrêts maladie et des sanctions légales pour non-conformité.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">ROI des formations Métiers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Investissement</div>
                        <div className="text-xl font-bold">14 760 000 FCFA</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Bénéfices estimés</div>
                        <div className="text-xl font-bold text-green-600">29 520 000 FCFA</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">ROI calculé</div>
                        <div className="text-xl font-bold text-green-600">100%</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Le ROI des formations Métiers est lié à l'augmentation de la productivité, l'amélioration 
                      de la qualité et la réduction des erreurs opérationnelles.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">ROI des formations d'Accueil</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Investissement</div>
                        <div className="text-xl font-bold">3 280 000 FCFA</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Bénéfices estimés</div>
                        <div className="text-xl font-bold text-green-600">8 200 000 FCFA</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">ROI calculé</div>
                        <div className="text-xl font-bold text-green-600">150%</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Le ROI élevé des formations d'Accueil s'explique par la rapidité d'intégration des 
                      nouveaux collaborateurs et sous-traitants, réduisant le temps d'adaptation.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>Prévisions et optimisation budgétaire</CardTitle>
                <CardDescription>
                  Projections et recommandations pour les périodes à venir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Prévisions budgétaires</h3>
                  <div className="h-40 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <LineChart className="h-32 w-32 mx-auto text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">
                        Le graphique de prévisions budgétaires serait affiché ici
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-1">T2 2024</div>
                      <div className="text-xl font-bold">36 080 000 FCFA</div>
                      <div className="text-xs text-green-600">+11%</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-1">T3 2024</div>
                      <div className="text-xl font-bold">29 520 000 FCFA</div>
                      <div className="text-xs text-amber-600">-18%</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-1">T4 2024</div>
                      <div className="text-xl font-bold">41 000 000 FCFA</div>
                      <div className="text-xs text-green-600">+39%</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-1">Total 2024</div>
                      <div className="text-xl font-bold">139 080 000 FCFA</div>
                      <div className="text-xs text-green-600">+8% vs. 2023</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommandations d'optimisation</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Regrouper les formations HSE</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Combiner certaines formations HSE similaires pour optimiser les coûts et réduire 
                          le temps d'absence des collaborateurs. Économie potentielle: 6 560 000 FCFA.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Former des formateurs internes</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Investir dans la formation de formateurs internes pour réduire le recours aux 
                          formateurs externes. Économie potentielle: 9 840 000 FCFA par an.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-lg mr-4">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Digitaliser certaines formations théoriques</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Convertir certains modules théoriques en format digital pour réduire les coûts 
                          logistiques. Économie potentielle: 4 920 000 FCFA.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Économies totales potentielles</h4>
                      <p className="text-sm text-gray-500">Par mise en œuvre des recommandations</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">21 320 000 FCFA</div>
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
