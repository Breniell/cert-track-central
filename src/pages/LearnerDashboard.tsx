
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, MapPin, User, Bell, BellOff } from "lucide-react";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import FormationCard from "@/components/formations/FormationCard";
import FormationDetails from "@/components/formations/FormationDetails";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LearnerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // En production, l'ID utilisateur viendra de Moodle
  const userId = "apprenant_moodle_id";

  const { data: allFormations, isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: () => formationService.getAllFormations()
  });

  // Simuler les inscriptions de l'utilisateur
  const myFormations = allFormations?.filter(f => 
    // En production, vérifier via API Moodle si l'utilisateur est inscrit
    Math.random() > 0.7 // Simulation
  );

  const availableFormations = allFormations?.filter(f => 
    f.statut === 'À venir' && 
    f.participants < f.maxParticipants &&
    !myFormations?.some(mf => mf.id === f.id)
  );

  const filteredAvailable = availableFormations?.filter(formation =>
    formation.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingSessions = myFormations?.filter(f => 
    f.statut === 'À venir' || f.statut === 'En cours'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleViewDetails = (id: number) => {
    const formation = allFormations?.find(f => f.id === id);
    if (formation) {
      setSelectedFormation(formation);
      setIsDetailsOpen(true);
    }
  };

  const handleRegister = (formationId: number) => {
    // En production, appeler l'API Moodle pour l'inscription
    toast({
      title: "Inscription réussie",
      description: "Vous êtes maintenant inscrit à cette formation"
    });
  };

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    toast({
      title: alertsEnabled ? "Alertes désactivées" : "Alertes activées",
      description: alertsEnabled 
        ? "Vous ne recevrez plus d'alertes pour les sessions à venir"
        : "Vous recevrez des alertes avant vos sessions"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cimencam-gray">Mon Espace Formation</h1>
            <p className="text-gray-600 mt-1">
              Suivez vos formations et découvrez de nouvelles opportunités
            </p>
          </div>
          <Button
            variant="outline"
            onClick={toggleAlerts}
            className={`${alertsEnabled ? 'text-cimencam-green border-cimencam-green' : 'text-gray-400'}`}
          >
            {alertsEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
            {alertsEnabled ? 'Alertes activées' : 'Alertes désactivées'}
          </Button>
        </div>

        {/* Prochaines sessions */}
        {upcomingSessions && upcomingSessions.length > 0 && (
          <Card className="border-cimencam-green">
            <CardHeader>
              <CardTitle className="text-cimencam-green flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Mes prochaines sessions
              </CardTitle>
              <CardDescription>
                Sessions auxquelles vous êtes inscrit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map(formation => (
                  <div key={formation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-cimencam-gray">{formation.titre}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(formation.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formation.duree}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {formation.lieu}
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {formation.formateur}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-cimencam-green border-cimencam-green">
                      {formation.statut}
                    </Badge>
                  </div>
                ))}
                {upcomingSessions.length > 3 && (
                  <p className="text-center text-sm text-gray-500">
                    Et {upcomingSessions.length - 3} autres sessions...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray">Mes inscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">
                {myFormations?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Formations actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray">Formations terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">
                {myFormations?.filter(f => f.statut === 'Terminée').length || 0}
              </div>
              <p className="text-sm text-gray-600">Avec certificat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray">Formations disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">
                {availableFormations?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Places libres</p>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher une formation..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Formations */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Formations disponibles</TabsTrigger>
            <TabsTrigger value="my">Mes formations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500">Chargement...</p>
              ) : filteredAvailable && filteredAvailable.length > 0 ? (
                filteredAvailable.map(formation => (
                  <FormationCard
                    key={formation.id}
                    formation={formation}
                    onViewDetails={handleViewDetails}
                    onRegister={handleRegister}
                    showRegisterButton={true}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune formation disponible pour le moment</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="my" className="mt-6">
            <div className="space-y-4">
              {myFormations && myFormations.length > 0 ? (
                myFormations.map(formation => (
                  <FormationCard
                    key={formation.id}
                    formation={formation}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Vous n'êtes inscrit à aucune formation</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Parcourez les formations disponibles pour vous inscrire
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FormationDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
        showRegisterButton={!myFormations?.some(mf => mf.id === selectedFormation?.id)}
        onRegister={handleRegister}
      />
    </Layout>
  );
}
