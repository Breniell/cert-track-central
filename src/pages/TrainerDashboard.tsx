
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, Users, Download, Search } from "lucide-react";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import FormationCard from "@/components/formations/FormationCard";
import { NewFormationDialog } from "@/components/planning/NewFormationDialog";
import FormationDetails from "@/components/formations/FormationDetails";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrainerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewFormationOpen, setIsNewFormationOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  // Simuler un ID de formateur - en production viendra de Moodle
  const formateurId = "formateur_moodle_id";

  const { data: formations, isLoading } = useQuery({
    queryKey: ["formations", "formateur", formateurId],
    queryFn: () => formationService.getFormationsByFormateur("Jean Dupont")
  });

  const filteredFormations = formations?.filter(formation =>
    formation.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingFormations = filteredFormations?.filter(f => 
    f.statut === 'À venir' || f.statut === 'En cours'
  );

  const pastFormations = filteredFormations?.filter(f => 
    f.statut === 'Terminée'
  );

  const handleViewDetails = (id: number) => {
    const formation = formations?.find(f => f.id === id);
    if (formation) {
      setSelectedFormation(formation);
      setIsDetailsOpen(true);
    }
  };

  const handleEditFormation = (id: number) => {
    toast({
      title: "Modification",
      description: "Fonctionnalité d'édition en cours de développement"
    });
  };

  const handleDownloadParticipants = (formationId: number) => {
    const formation = formations?.find(f => f.id === formationId);
    if (formation) {
      // Simuler l'export CSV
      const csvContent = `Formation,Participant,Email,Statut\n"${formation.titre}","John Doe","john@example.com","Inscrit"\n"${formation.titre}","Jane Smith","jane@example.com","Inscrit"`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants_${formation.titre.replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export réussi",
        description: "La liste des participants a été téléchargée"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cimencam-gray">Tableau de bord Formateur</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos formations et suivez vos participants
            </p>
          </div>
          <Button 
            onClick={() => setIsNewFormationOpen(true)}
            className="bg-cimencam-green hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Formation
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray">Formations actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">
                {upcomingFormations?.length || 0}
              </div>
              <p className="text-sm text-gray-600">En cours et à venir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray">Total participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">
                {formations?.reduce((acc, f) => acc + f.participants, 0) || 0}
              </div>
              <p className="text-sm text-gray-600">Toutes formations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray">Formations terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">
                {pastFormations?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Ce mois-ci</p>
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

        {/* Liste des formations */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Formations à venir</TabsTrigger>
            <TabsTrigger value="past">Formations passées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500">Chargement...</p>
              ) : upcomingFormations && upcomingFormations.length > 0 ? (
                upcomingFormations.map(formation => (
                  <div key={formation.id} className="relative">
                    <FormationCard
                      formation={formation}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEditFormation}
                      showEditButton={true}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadParticipants(formation.id)}
                        className="text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(formation.id)}
                        className="text-cimencam-gray border-cimencam-gray hover:bg-cimencam-gray hover:text-white"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        {formation.participants} participants
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune formation à venir</p>
                    <Button 
                      onClick={() => setIsNewFormationOpen(true)}
                      className="mt-4 bg-cimencam-green hover:bg-green-600 text-white"
                    >
                      Créer ma première formation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            <div className="space-y-4">
              {pastFormations && pastFormations.length > 0 ? (
                pastFormations.map(formation => (
                  <FormationCard
                    key={formation.id}
                    formation={formation}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Aucune formation terminée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <NewFormationDialog
        open={isNewFormationOpen}
        onOpenChange={setIsNewFormationOpen}
      />

      <FormationDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
        showManageButton={true}
        onManageParticipants={(id) => {
          toast({
            title: "Gestion des participants",
            description: "Redirection vers la page de gestion..."
          });
        }}
      />
    </Layout>
  );
}
