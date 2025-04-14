
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { formationService } from "@/services/formationService";
import { documentService } from "@/services/documentService";
import { evaluationService } from "@/services/evaluationService";
import { toast } from "@/hooks/use-toast";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileCheck,
  FileWarning,
  Layers,
  LayoutDashboard,
  Users,
  Wallet,
  AlertTriangle,
  Bell,
  Building,
  Clipboard,
  MessageSquare,
  Settings,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("overview");

  // Récupérer les formations
  const { data: formations, isLoading: formationsLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: formationService.getAllFormations,
  });

  // Récupérer les documents
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: documentService.getAllDocuments,
  });

  // Fonctions interactives pour les actions
  const handleNotifyFormateurs = () => {
    toast({
      title: "Notifications envoyées",
      description: "Les formateurs ont été notifiés des prochaines sessions",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport est en cours d'exportation. Vous recevrez une notification lorsqu'il sera prêt.",
    });
  };

  const handleBudgetAnalysis = () => {
    toast({
      title: "Analyse budgétaire",
      description: "Lancement de l'analyse budgétaire des formations...",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Console d'Administration</h1>
            <p className="text-gray-500">
              Contrôle total et supervision de tous les modules
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
              <Badge className="ml-1 bg-red-500">3</Badge>
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Sidebar de navigation */}
          <div className="md:col-span-1 space-y-3">
            <Card>
              <CardContent className="p-0">
                <div className="space-y-1 pt-3">
                  <Button 
                    variant={activeModule === "overview" ? "default" : "ghost"} 
                    className="w-full justify-start gap-2" 
                    onClick={() => setActiveModule("overview")}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Vue d'ensemble
                  </Button>
                  <Button 
                    variant={activeModule === "formations" ? "default" : "ghost"} 
                    className="w-full justify-start gap-2" 
                    onClick={() => setActiveModule("formations")}
                  >
                    <Layers className="w-4 h-4" />
                    Formations
                  </Button>
                  <Button 
                    variant={activeModule === "formateurs" ? "default" : "ghost"} 
                    className="w-full justify-start gap-2" 
                    onClick={() => setActiveModule("formateurs")}
                  >
                    <Users className="w-4 h-4" />
                    Formateurs
                  </Button>
                  <Button 
                    variant={activeModule === "documents" ? "default" : "ghost"} 
                    className="w-full justify-start gap-2" 
                    onClick={() => setActiveModule("documents")}
                  >
                    <FileCheck className="w-4 h-4" />
                    Documents
                  </Button>
                  <Button 
                    variant={activeModule === "budget" ? "default" : "ghost"} 
                    className="w-full justify-start gap-2" 
                    onClick={() => setActiveModule("budget")}
                  >
                    <Wallet className="w-4 h-4" />
                    Budget
                  </Button>
                  <Button 
                    variant={activeModule === "planning" ? "default" : "ghost"} 
                    className="w-full justify-start gap-2" 
                    onClick={() => setActiveModule("planning")}
                  >
                    <Calendar className="w-4 h-4" />
                    Planning
                  </Button>
                  <Button 
                    variant={activeModule === "collaboration" ? "default" : "ghost"} 
                    className="w-full justify-start gap-2" 
                    onClick={() => setActiveModule("collaboration")}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Collaboration
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={handleNotifyFormateurs}
                >
                  <Bell className="w-4 h-4" />
                  Notifier formateurs
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={handleExportReport}
                >
                  <Clipboard className="w-4 h-4" />
                  Exporter rapport
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={handleBudgetAnalysis}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analyse budgétaire
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="md:col-span-3 lg:col-span-5 space-y-6">
            
            {/* Vue d'ensemble */}
            {activeModule === "overview" && (
              <>
                <StatsCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Activité récente</CardTitle>
                      <CardDescription>
                        Dernières actions et événements sur la plateforme
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentActivity />
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Voir toutes les activités</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques globales</CardTitle>
                      <CardDescription>
                        Indicateurs clés de performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Taux de présence</span>
                          <span className="text-sm font-bold text-green-600">92%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Taux de réussite aux évaluations</span>
                          <span className="text-sm font-bold text-blue-600">87%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Documents validés</span>
                          <span className="text-sm font-bold text-amber-600">78%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Budget consommé</span>
                          <span className="text-sm font-bold text-purple-600">67%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Rapport détaillé</Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>À surveiller</CardTitle>
                      <CardDescription>
                        Éléments nécessitant votre attention
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertTriangle className="text-amber-500 w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-sm">Documents en attente de validation</p>
                          <p className="text-xs text-gray-500">12 documents nécessitent une vérification HSE</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Vérifier
                        </Button>
                      </div>

                      <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <Clock className="text-red-500 w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-sm">Certifications expirant</p>
                          <p className="text-xs text-gray-500">8 certifications expirent dans les 30 prochains jours</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Planifier
                        </Button>
                      </div>

                      <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileWarning className="text-blue-500 w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium text-sm">Appels d'offres en cours</p>
                          <p className="text-xs text-gray-500">3 appels d'offres attendent votre validation</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Examiner
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Voir tous les éléments</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Prochaines formations</CardTitle>
                      <CardDescription>
                        Sessions programmées pour les 7 prochains jours
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formationsLoading ? (
                        <p className="text-center py-4 text-gray-500">Chargement des formations...</p>
                      ) : (
                        (formations?.slice(0, 3) || []).map((formation) => (
                          <div key={formation.id} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className={`p-2 rounded-md ${
                              formation.type === 'HSE' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {formation.type === 'HSE' ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <Building className="w-5 h-5" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-sm">{formation.titre}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(formation.date).toLocaleDateString('fr-FR')}
                                <Clock className="w-3 h-3 ml-2 mr-1" />
                                {formation.duree}
                                <Users className="w-3 h-3 ml-2 mr-1" />
                                {formation.participants}/{formation.maxParticipants}
                              </div>
                            </div>
                            <div className="ml-auto flex items-center">
                              <Link to={`/planning`}>
                                <Button variant="ghost" size="sm">
                                  Détails
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link to="/planning" className="w-full">
                        <Button variant="outline" className="w-full">Voir le planning complet</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </>
            )}

            {/* Module Formations */}
            {activeModule === "formations" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Gestion des Formations</CardTitle>
                    <Link to="/formations">
                      <Button>Voir toutes les formations</Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Gérez les formations HSE et métiers, configurez les évaluations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="hse">
                    <TabsList className="mb-4">
                      <TabsTrigger value="hse">Formations HSE</TabsTrigger>
                      <TabsTrigger value="metier">Formations Métiers</TabsTrigger>
                      <TabsTrigger value="evaluation">Évaluations</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="hse" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h3 className="font-medium text-green-800 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Formations HSE en cours
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            2 sessions en cours, 8 participants
                          </p>
                          <div className="mt-4 flex justify-end">
                            <Link to="/formations">
                              <Button variant="outline" size="sm">Détails</Button>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-medium text-blue-800 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Formations HSE à venir
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            5 sessions planifiées, 32 participants
                          </p>
                          <div className="mt-4 flex justify-end">
                            <Link to="/planning">
                              <Button variant="outline" size="sm">Voir planning</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Link to="/formations">
                          <Button variant="outline">Voir toutes les formations HSE</Button>
                        </Link>
                        <Button>Créer nouvelle formation HSE</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="metier" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h3 className="font-medium text-purple-800 flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            Formations Métiers en cours
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            3 sessions en cours, 15 participants
                          </p>
                          <div className="mt-4 flex justify-end">
                            <Link to="/formations">
                              <Button variant="outline" size="sm">Détails</Button>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                          <h3 className="font-medium text-indigo-800 flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Spécialités couvertes
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            12 domaines de compétences, 8 certifications
                          </p>
                          <div className="mt-4 flex justify-end">
                            <Link to="/formations">
                              <Button variant="outline" size="sm">Explorer</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Link to="/formations">
                          <Button variant="outline">Voir toutes les formations métiers</Button>
                        </Link>
                        <Link to="/appels-offre">
                          <Button>Gérer appels d'offres</Button>
                        </Link>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="evaluation" className="space-y-4">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h3 className="font-medium text-amber-800">Configuration des évaluations</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Gérez les modèles, questionnaires et méthodes d'évaluation
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <Button variant="outline" size="sm">Modèles QCM</Button>
                          <Button variant="outline" size="sm">Évaluations pratiques</Button>
                          <Button variant="outline" size="sm">Seuils de réussite</Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button>Créer nouvelle évaluation</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Module Formateurs */}
            {activeModule === "formateurs" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Gestion des Formateurs</CardTitle>
                    <Link to="/formateurs">
                      <Button>Voir tous les formateurs</Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Gérez les profils des formateurs, leurs disponibilités et leurs performances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex flex-col">
                        <div className="flex items-center">
                          <Users className="w-8 h-8 text-blue-600 mr-3" />
                          <div>
                            <h3 className="font-medium">Formateurs actifs</h3>
                            <p className="text-2xl font-bold text-blue-700">8</p>
                          </div>
                        </div>
                        <Link to="/formateurs" className="mt-auto">
                          <Button variant="ghost" size="sm" className="w-full mt-4">
                            Voir détails
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex flex-col">
                        <div className="flex items-center">
                          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                          <div>
                            <h3 className="font-medium">Certifications à jour</h3>
                            <p className="text-2xl font-bold text-green-700">92%</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-4">
                          Vérifier
                        </Button>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex flex-col">
                        <div className="flex items-center">
                          <Star className="w-8 h-8 text-purple-600 mr-3" />
                          <div>
                            <h3 className="font-medium">Évaluation moyenne</h3>
                            <p className="text-2xl font-bold text-purple-700">4.7/5</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-4">
                          Voir toutes
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border">
                      <div className="p-4 border-b">
                        <h3 className="font-medium">Dernières interventions</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              JD
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Jean Dupont</p>
                              <p className="text-sm text-gray-500">Sécurité en hauteur</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">15/03/2024</p>
                            <p className="text-xs text-gray-500">8h</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              MM
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Marie Martin</p>
                              <p className="text-sm text-gray-500">Produits chimiques</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">18/03/2024</p>
                            <p className="text-xs text-gray-500">4h</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              PD
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Pierre Dubois</p>
                              <p className="text-sm text-gray-500">Maintenance préventive</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">20/03/2024</p>
                            <p className="text-xs text-gray-500">16h</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t">
                        <Link to="/formateurs">
                          <Button variant="outline" size="sm" className="w-full">
                            Voir toutes les interventions
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Link to="/formateurs">
                        <Button variant="outline">Gérer les formateurs</Button>
                      </Link>
                      <Button>Ajouter un formateur</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Module Documents */}
            {activeModule === "documents" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Vérification des Documents</CardTitle>
                    <Link to="/hse/verification-documents">
                      <Button>Module de vérification</Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Vérifiez et validez les documents requis pour les participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-medium">Validés</h3>
                        <p className="text-2xl font-bold text-green-700">
                          {documentsLoading ? "..." : 
                            documents?.filter(d => d.statut === "Validé").length || 0}
                        </p>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                        <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <h3 className="font-medium">À vérifier</h3>
                        <p className="text-2xl font-bold text-amber-700">
                          {documentsLoading ? "..." : 
                            documents?.filter(d => d.statut === "À vérifier").length || 0}
                        </p>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <h3 className="font-medium">Rejetés</h3>
                        <p className="text-2xl font-bold text-red-700">
                          {documentsLoading ? "..." : 
                            documents?.filter(d => d.statut === "Rejeté").length || 0}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                        <FileWarning className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <h3 className="font-medium">Expirant bientôt</h3>
                        <p className="text-2xl font-bold text-gray-700">5</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border">
                      <div className="p-4 border-b">
                        <h3 className="font-medium">Documents en attente de vérification</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {documentsLoading ? (
                          <p className="text-center py-4 text-gray-500">Chargement des documents...</p>
                        ) : (
                          (documents?.filter(d => d.statut === "À vérifier").slice(0, 3) || []).map((doc) => (
                            <div key={doc.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                              <div className="flex items-center">
                                <FileWarning className="w-5 h-5 text-amber-600 mr-3" />
                                <div>
                                  <p className="font-medium">{doc.nom}</p>
                                  <p className="text-xs text-gray-500">Type: {doc.type}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  Voir
                                </Button>
                                <Button size="sm">
                                  Vérifier
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                        
                        {!documentsLoading && (!documents || documents.filter(d => d.statut === "À vérifier").length === 0) && (
                          <p className="text-center py-4 text-gray-500">Aucun document en attente</p>
                        )}
                      </div>
                      <div className="p-4 border-t">
                        <Link to="/hse/verification-documents">
                          <Button variant="outline" size="sm" className="w-full">
                            Voir tous les documents
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Link to="/hse/verification-documents">
                        <Button variant="outline">Module HSE</Button>
                      </Link>
                      <Button>Configurer types de documents</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Module Budget */}
            {activeModule === "budget" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Gestion Budgétaire</CardTitle>
                    <Button onClick={handleExportReport}>Exporter rapport</Button>
                  </div>
                  <CardDescription>
                    Suivez et analysez les coûts, dépenses et le ROI des formations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-800">Budget annuel</h3>
                        <p className="text-2xl font-bold text-blue-700 mt-2">78 720 000 FCFA</p>
                        <p className="text-xs text-gray-500 mt-1">Budget initial: 101 680 000 FCFA</p>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-medium text-green-800">Économies réalisées</h3>
                        <p className="text-2xl font-bold text-green-700 mt-2">15 760 000 FCFA</p>
                        <p className="text-xs text-gray-500 mt-1">+12% par rapport à l'année précédente</p>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-medium text-purple-800">ROI estimé</h3>
                        <p className="text-2xl font-bold text-purple-700 mt-2">32%</p>
                        <p className="text-xs text-gray-500 mt-1">Retour sur investissement annuel</p>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '32%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium mb-4">Répartition des coûts par type</h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Formateurs</span>
                              <span className="text-sm font-bold text-gray-600">42 800 000 FCFA</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '56%' }}></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Matériel</span>
                              <span className="text-sm font-bold text-gray-600">15 640 000 FCFA</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: '22%' }}></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Salles & Logistique</span>
                              <span className="text-sm font-bold text-gray-600">10 480 000 FCFA</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Administration</span>
                              <span className="text-sm font-bold text-gray-600">5 600 000 FCFA</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: '7%' }}></div>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleBudgetAnalysis}>
                          Analyse détaillée
                        </Button>
                      </div>
                      
                      <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium mb-4">Coût moyen par formation</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div>
                              <p className="font-medium">Formations HSE</p>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Users className="w-3 h-3 mr-1" />
                                12 participants en moyenne
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-700">850 000 FCFA</p>
                              <p className="text-xs text-gray-500">70 833 FCFA / participant</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <div>
                              <p className="font-medium">Formations Métiers</p>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Users className="w-3 h-3 mr-1" />
                                8 participants en moyenne
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-700">1 200 000 FCFA</p>
                              <p className="text-xs text-gray-500">150 000 FCFA / participant</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                            <div>
                              <p className="font-medium">Formations Urgentes</p>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Users className="w-3 h-3 mr-1" />
                                5 participants en moyenne
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-700">600 000 FCFA</p>
                              <p className="text-xs text-gray-500">120 000 FCFA / participant</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          Historique complet
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleExportReport}>Générer rapport FCFA</Button>
                      <Button onClick={handleBudgetAnalysis}>Analyse ROI</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Module Planning */}
            {activeModule === "planning" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Gestion du Planning</CardTitle>
                    <Link to="/planning">
                      <Button>Voir planning complet</Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Visualisez et gérez le planning des formations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-medium text-green-800 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Sessions ce mois
                        </h3>
                        <p className="text-2xl font-bold text-green-700 mt-2">12</p>
                        <p className="text-xs text-gray-500 mt-1">75 participants inscrits</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-800 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Prochaine session
                        </h3>
                        <p className="font-medium text-blue-700 mt-2">Demain, 09:00</p>
                        <p className="text-xs text-gray-500 mt-1">Sécurité en hauteur</p>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h3 className="font-medium text-amber-800 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Sessions urgentes
                        </h3>
                        <p className="text-2xl font-bold text-amber-700 mt-2">3</p>
                        <p className="text-xs text-gray-500 mt-1">À planifier rapidement</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Sessions prévues cette semaine</h3>
                      
                      {formationsLoading ? (
                        <p className="text-center py-4 text-gray-500">Chargement des formations...</p>
                      ) : (
                        (formations?.slice(0, 3) || []).map((formation) => (
                          <div key={formation.id} className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                  formation.type === 'HSE' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {formation.type}
                                </span>
                                <h4 className="ml-2 font-medium">{formation.titre}</h4>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  {new Date(formation.date).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                  {formation.duree}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                                  {formation.participants}/{formation.maxParticipants}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                                  {formation.lieu}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link to="/planning">
                                <Button variant="outline" size="sm">Détails</Button>
                              </Link>
                              <Button size="sm">Modifier</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <Link to="/planning">
                        <Button variant="outline">Voir planning complet</Button>
                      </Link>
                      <Button>Nouvelle formation</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Module Collaboration */}
            {activeModule === "collaboration" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Espace Collaboratif</CardTitle>
                    <Link to="/collaboration">
                      <Button>Ouvrir module collaboratif</Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Communiquez et partagez des informations avec les équipes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-800 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Discussions actives
                        </h3>
                        <p className="text-2xl font-bold text-blue-700 mt-2">8</p>
                        <p className="text-xs text-gray-500 mt-1">3 nouveaux messages</p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-medium text-green-800 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Utilisateurs actifs
                        </h3>
                        <p className="text-2xl font-bold text-green-700 mt-2">15</p>
                        <p className="text-xs text-gray-500 mt-1">5 formateurs, 10 autres</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-medium text-purple-800 flex items-center">
                          <FileCheck className="w-4 h-4 mr-2" />
                          Documents partagés
                        </h3>
                        <p className="text-2xl font-bold text-purple-700 mt-2">24</p>
                        <p className="text-xs text-gray-500 mt-1">6 nouveaux cette semaine</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Dernières activités</h3>
                      <div className="bg-white rounded-lg border">
                        <div className="p-4 space-y-4">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <Users className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Jean Dupont</p>
                                  <p className="text-sm text-gray-500">a partagé un nouveau document</p>
                                </div>
                                <span className="text-xs text-gray-500">Il y a 30 min</span>
                              </div>
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                <p className="font-medium">Mise à jour procédure HSE</p>
                                <p className="text-xs text-gray-500 mt-1">Document PDF - 2.4 MB</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Marie Martin</p>
                                  <p className="text-sm text-gray-500">a commenté dans la discussion</p>
                                </div>
                                <span className="text-xs text-gray-500">Il y a 2 heures</span>
                              </div>
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                <p className="text-gray-700">
                                  "Pouvons-nous avancer la formation sur les produits chimiques à la semaine prochaine ?"
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Système</p>
                                  <p className="text-sm text-gray-500">Notification automatique</p>
                                </div>
                                <span className="text-xs text-gray-500">Hier</span>
                              </div>
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                <p className="text-gray-700">
                                  "Rappel: 3 documents sont en attente de validation pour les formations à venir"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Link to="/collaboration">
                        <Button variant="outline">Espace collaboratif</Button>
                      </Link>
                      <Button>Nouvelle discussion</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
