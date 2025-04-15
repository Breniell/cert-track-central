
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ClipboardCheck, 
  Plus, 
  FileCheck, 
  ChevronRight, 
  Clock, 
  Users, 
  Eye, 
  Star, 
  BarChart3,
  Search 
} from "lucide-react";
import { evaluationService } from "@/services/evaluationService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function EvaluationManager() {
  const [activeTab, setActiveTab] = useState("evaluations");
  const [selectedFormationId, setSelectedFormationId] = useState<number | null>(null);

  const { data: evaluations, isLoading } = useQuery({
    queryKey: ['evaluations'],
    queryFn: async () => {
      // For demo purposes, we'll get evaluations for formation ID 1
      const evals = await evaluationService.getEvaluationsByFormation(1);
      return evals;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['evaluationStats', 1],
    queryFn: () => evaluationService.getEvaluationStats(1),
    enabled: !!evaluations && evaluations.length > 0,
  });

  const handleCreateEvaluation = () => {
    toast({
      title: "Création d'évaluation",
      description: "L'évaluation a été créée avec succès.",
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6" />
              Gestion des Évaluations
            </h1>
            <p className="text-muted-foreground">
              Créez et gérez les évaluations pour les formations
            </p>
          </div>
          <Button onClick={handleCreateEvaluation}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
            <TabsTrigger value="resultats">Résultats</TabsTrigger>
            <TabsTrigger value="questions">Banque de questions</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="evaluations">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations disponibles</CardTitle>
                <CardDescription>
                  Liste des évaluations pour les formations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher une évaluation..."
                      className="pl-8"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px] ml-2">
                      <SelectValue placeholder="Type de formation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hse">HSE</SelectItem>
                      <SelectItem value="metier">Métier</SelectItem>
                      <SelectItem value="tous">Tous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  {isLoading ? (
                    <p>Chargement des évaluations...</p>
                  ) : (
                    evaluations && evaluations.map((evaluation) => (
                      <div 
                        key={evaluation.id} 
                        className="p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedFormationId(evaluation.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{evaluation.titre}</h3>
                            <p className="text-sm text-muted-foreground">Formation: {evaluation.formationId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {evaluation.questions.length} questions
                            </Badge>
                            <Badge>
                              {evaluation.seuilReussite}% min
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{evaluation.duree} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{stats?.participants || 0} participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>{stats?.scoreMoyen || 0}% score moyen</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {evaluations && evaluations.length === 0 && (
                    <div className="text-center py-8">
                      <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <p>Aucune évaluation disponible</p>
                      <Button variant="outline" className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Créer une évaluation
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {selectedFormationId && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Détails de l'évaluation</CardTitle>
                  <CardDescription>
                    Configurez les paramètres et questions de l'évaluation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="titre">Titre de l'évaluation</Label>
                        <Input id="titre" defaultValue="Évaluation de sécurité en hauteur" />
                      </div>
                      <div>
                        <Label htmlFor="formation">Formation associée</Label>
                        <Select>
                          <SelectTrigger id="formation">
                            <SelectValue placeholder="Sélectionner une formation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Sécurité en hauteur</SelectItem>
                            <SelectItem value="2">Manipulation des produits chimiques</SelectItem>
                            <SelectItem value="3">Maintenance préventive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duree">Durée (minutes)</Label>
                        <Input id="duree" type="number" defaultValue="15" />
                      </div>
                      <div>
                        <Label htmlFor="seuil">Seuil de réussite (%)</Label>
                        <Input id="seuil" type="number" defaultValue="70" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        defaultValue="Ce test évalue vos connaissances sur les procédures de sécurité pour le travail en hauteur" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Questions</Label>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une question
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">QCM</Badge>
                                <span className="text-sm font-medium">Question 1</span>
                              </div>
                              <p className="mt-2">Quelle est la hauteur minimale à partir de laquelle un harnais est obligatoire?</p>
                              
                              <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2">
                                  <Checkbox id="q1-a" />
                                  <Label htmlFor="q1-a" className="text-sm">1 mètre</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="q1-b" checked />
                                  <Label htmlFor="q1-b" className="text-sm">2 mètres</Label>
                                  <Badge className="ml-2">Correcte</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="q1-c" />
                                  <Label htmlFor="q1-c" className="text-sm">3 mètres</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="q1-d" />
                                  <Label htmlFor="q1-d" className="text-sm">5 mètres</Label>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                              <Badge>2 points</Badge>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Vrai/Faux</Badge>
                                <span className="text-sm font-medium">Question 3</span>
                              </div>
                              <p className="mt-2">Il est permis de travailler seul en hauteur si on est correctement équipé.</p>
                              
                              <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2">
                                  <Checkbox id="q3-a" />
                                  <Label htmlFor="q3-a" className="text-sm">Vrai</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="q3-b" checked />
                                  <Label htmlFor="q3-b" className="text-sm">Faux</Label>
                                  <Badge className="ml-2">Correcte</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                              <Badge>1 point</Badge>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Paramètres anti-triche</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="random" checked />
                          <Label htmlFor="random" className="text-sm">
                            Ordre aléatoire des questions
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="timelimit" checked />
                          <Label htmlFor="timelimit" className="text-sm">
                            Limite de temps par question
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="supervised" checked />
                          <Label htmlFor="supervised" className="text-sm">
                            Mode supervisé requis
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedFormationId(null)}>
                        Annuler
                      </Button>
                      <Button>
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="resultats">
            <Card>
              <CardHeader>
                <CardTitle>Résultats des évaluations</CardTitle>
                <CardDescription>
                  Performances des participants aux évaluations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher un participant..."
                      className="pl-8"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Formation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les formations</SelectItem>
                        <SelectItem value="1">Sécurité en hauteur</SelectItem>
                        <SelectItem value="2">Manipulation des produits chimiques</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="reussi">Réussi</SelectItem>
                        <SelectItem value="echoue">Échoué</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">Jacques Martin</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Sécurité en hauteur</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">15/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">80%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="success">Réussi</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">Détails</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">Sophie Durand</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Manipulation produits chimiques</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">18/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">65%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="destructive">Échoué</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">Détails</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">Pierre Dupont</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Sécurité en hauteur</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">15/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">85%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="success">Réussi</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">Détails</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage de 3 résultats sur 3
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                    <Button variant="outline" size="sm" disabled>Suivant</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Banque de questions</CardTitle>
                <CardDescription>
                  Gérez et organisez vos questions par catégories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher une question..."
                      className="pl-8"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="hse">HSE</SelectItem>
                        <SelectItem value="technique">Technique</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="qcm">QCM</SelectItem>
                        <SelectItem value="vf">Vrai/Faux</SelectItem>
                        <SelectItem value="text">Texte</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">QCM</Badge>
                          <Badge variant="secondary">HSE</Badge>
                          <span className="text-sm font-medium">ID: Q001</span>
                        </div>
                        <p className="mt-2">Quelle est la hauteur minimale à partir de laquelle un harnais est obligatoire?</p>
                      </div>
                      <div>
                        <Badge>2 points</Badge>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost" size="sm">Prévisualiser</Button>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">QCM</Badge>
                          <Badge variant="secondary">HSE</Badge>
                          <span className="text-sm font-medium">ID: Q002</span>
                        </div>
                        <p className="mt-2">Un point d'ancrage doit pouvoir supporter au minimum :</p>
                      </div>
                      <div>
                        <Badge>2 points</Badge>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost" size="sm">Prévisualiser</Button>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Vrai/Faux</Badge>
                          <Badge variant="secondary">HSE</Badge>
                          <span className="text-sm font-medium">ID: Q003</span>
                        </div>
                        <p className="mt-2">Il est permis de travailler seul en hauteur si on est correctement équipé.</p>
                      </div>
                      <div>
                        <Badge>1 point</Badge>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost" size="sm">Prévisualiser</Button>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="statistiques">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques des évaluations</CardTitle>
                <CardDescription>
                  Analyse des performances et résultats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">Taux de réussite global</p>
                      <p className="text-3xl font-bold text-green-600">
                        {stats?.tauxReussite || 0}%
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">Score moyen</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {stats?.scoreMoyen || 0}%
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">Total des participants</p>
                      <p className="text-3xl font-bold">
                        {stats?.participants || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Répartition des résultats</h3>
                    <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>Graphique de répartition des résultats</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Performance par question</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de réussite</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Q001</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">Quelle est la hauteur minimale à partir de laquelle un harnais est obligatoire?</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">QCM</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">80%</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Q002</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">Un point d'ancrage doit pouvoir supporter au minimum :</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">QCM</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">65%</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Q003</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">Il est permis de travailler seul en hauteur si on est correctement équipé.</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">Vrai/Faux</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">90%</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
