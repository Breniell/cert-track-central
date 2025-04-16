
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Award, Clock, CheckCircle, AlertCircle, BarChart4, Briefcase, Download } from "lucide-react";
import { formateurService } from "@/services/formateurService";
import { formationService } from "@/services/formationService";
import { FormateurPerformanceChart } from "@/components/formateurs/FormateurPerformanceChart";
import { FormateurAvailabilityCalendar } from "@/components/formateurs/FormateurAvailabilityCalendar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Widget pour afficher les heures de formation
const FormationHoursWidget = ({ hours }: { hours: number }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Heures effectuées</h3>
          <p className="text-2xl font-semibold text-gray-900">{hours}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Widget pour afficher le taux de réussite des évaluations
const SuccessRateWidget = ({ rate }: { rate: number }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center">
        <div className="p-3 bg-green-100 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Taux de réussite</h3>
          <p className="text-2xl font-semibold text-gray-900">{rate}%</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Widget pour afficher les formations à venir
const UpcomingFormationsWidget = ({ count }: { count: number }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Formations à venir</h3>
          <p className="text-2xl font-semibold text-gray-900">{count}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Widget pour afficher le nombre de participants
const ParticipantsWidget = ({ count }: { count: number }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center">
        <div className="p-3 bg-amber-100 rounded-lg">
          <Users className="w-6 h-6 text-amber-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Participants</h3>
          <p className="text-2xl font-semibold text-gray-900">{count}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Widget pour afficher les alertes
const AlertsWidget = ({ alerts }: { alerts: { id: number; title: string; type: string; date: string }[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
        Alertes
      </CardTitle>
      <CardDescription>Notifications importantes</CardDescription>
    </CardHeader>
    <CardContent>
      {alerts.length > 0 ? (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li key={alert.id} className="flex items-start gap-2">
              <div className={`p-1 rounded-full ${alert.type === 'warning' ? 'bg-amber-100' : 'bg-red-100'}`}>
                <AlertCircle className={`h-4 w-4 ${alert.type === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-gray-500">{alert.date}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Aucune alerte pour le moment</p>
      )}
    </CardContent>
  </Card>
);

// Widget pour les sessions récentes
const RecentSessionsWidget = ({ sessions }: { sessions: { id: number; title: string; date: string; participants: number; status: string }[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center">
        <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
        Sessions récentes
      </CardTitle>
      <CardDescription>Vos dernières formations</CardDescription>
    </CardHeader>
    <CardContent>
      {sessions.length > 0 ? (
        <ul className="space-y-3">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm font-medium">{session.title}</p>
                <p className="text-xs text-gray-500">{session.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Users className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs">{session.participants}</span>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    session.status === 'Terminée' ? 'bg-green-100 text-green-800' : 
                    session.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Aucune session récente</p>
      )}
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="sm" className="w-full">
        Voir toutes les sessions
      </Button>
    </CardFooter>
  </Card>
);

export default function FormateurDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("apercu");

  // Récupérer les informations du formateur connecté
  const { data: formateur, isLoading: isLoadingFormateur } = useQuery({
    queryKey: ["formateur", user?.id || 1],
    queryFn: () => formateurService.getFormateurById(user?.id || 1),
    enabled: !!user
  });

  // Récupérer les formations du formateur
  const { data: formations, isLoading: isLoadingFormations } = useQuery({
    queryKey: ["formations", "formateur", formateur?.nom || ""],
    queryFn: () => formationService.getFormationsByFormateur(formateur?.nom + " " + formateur?.prenom || "Jean Dupont"),
    enabled: !!formateur
  });

  // Données simulées pour les statistiques
  const stats = {
    hoursCompleted: 42,
    successRate: 92,
    upcomingFormations: formations?.filter(f => f.statut === 'À venir').length || 0,
    totalParticipants: 45
  };

  const alerts = [
    { id: 1, title: "Renouvellement certification SST avant le 15/05", type: "warning", date: "15/04/2024" },
    { id: 2, title: "Évaluation en attente pour Formation #3", type: "alert", date: "12/04/2024" }
  ];

  const recentSessions = formations?.slice(0, 3).map(f => ({
    id: f.id,
    title: f.titre,
    date: new Date(f.date).toLocaleDateString('fr-FR'),
    participants: f.participants,
    status: f.statut
  })) || [];

  const handleExportReport = () => {
    toast({
      title: "Export du rapport",
      description: "Le rapport de performance a été téléchargé avec succès."
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord Formateur</h1>
            <p className="text-muted-foreground">
              Bienvenue, {formateur ? `${formateur.prenom} ${formateur.nom}` : "chargement..."}
            </p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleExportReport}>
            <Download className="w-4 h-4" />
            Exporter rapport
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="apercu">Aperçu</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="disponibilite">Disponibilité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="apercu" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <UpcomingFormationsWidget count={stats.upcomingFormations} />
              <ParticipantsWidget count={stats.totalParticipants} />
              <FormationHoursWidget hours={stats.hoursCompleted} />
              <SuccessRateWidget rate={stats.successRate} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart4 className="h-5 w-5 mr-2 text-blue-500" />
                      Performance générale
                    </CardTitle>
                    <CardDescription>Évaluations et retours des participants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {formateur ? (
                      <FormateurPerformanceChart formateur={formateur} />
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Chargement des données...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <AlertsWidget alerts={alerts} />
                <RecentSessionsWidget sessions={recentSessions} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Détail des performances</CardTitle>
                  <CardDescription>Statistiques détaillées et analyses des formations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {formateur ? (
                      <>
                        <FormateurPerformanceChart formateur={formateur} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Score moyen</h3>
                            <div className="flex items-center">
                              <Award className="h-5 w-5 text-amber-500 mr-2" />
                              <span className="text-2xl font-bold">
                                {formateur.evaluations ? 
                                  (formateur.evaluations.reduce((acc, curr) => acc + curr.score, 0) / formateur.evaluations.length).toFixed(1) : 
                                  "N/A"}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">/ 5</span>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Formations réalisées</h3>
                            <div className="flex items-center">
                              <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                              <span className="text-2xl font-bold">{formations?.length || 0}</span>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Taux de satisfaction</h3>
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-2xl font-bold">95%</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Chargement des données...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="disponibilite">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des disponibilités</CardTitle>
                  <CardDescription>Visualisez et mettez à jour vos disponibilités</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      {formateur ? (
                        <FormateurAvailabilityCalendar formateur={formateur} />
                      ) : (
                        <div className="h-64 flex items-center justify-center">
                          <p className="text-gray-500">Chargement du calendrier...</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Vos disponibilités</h3>
                      {formateur?.disponibilites && formateur.disponibilites.length > 0 ? (
                        <ul className="space-y-2">
                          {formateur.disponibilites.map((dispo, index) => {
                            const debut = new Date(dispo.debut);
                            const fin = new Date(dispo.fin);
                            return (
                              <li key={index} className="flex justify-between items-center p-3 border rounded-md">
                                <div>
                                  <p className="font-medium">{debut.toLocaleDateString('fr-FR')}</p>
                                  <p className="text-sm text-gray-500">
                                    {debut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                                    {fin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">Modifier</Button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Aucune disponibilité définie</p>
                      )}
                      <Button className="w-full mt-4">
                        Ajouter une disponibilité
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
