
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Upload, Download, Plus } from "lucide-react";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import FormationCard from "@/components/formations/FormationCard";
import FormationDetails from "@/components/formations/FormationDetails";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FormateurFormations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  // Simuler un ID de formateur
  const formateurId = "Jean Dupont";

  const { data: formations, isLoading, error } = useQuery({
    queryKey: ["formations", "formateur", formateurId],
    queryFn: () => formationService.getFormationsByFormateur(formateurId)
  });

  const handleViewDetails = (id: number) => {
    const formation = formations?.find(f => f.id === id) || null;
    setSelectedFormation(formation);
    setIsDetailsOpen(true);
  };

  const handleEditFormation = (id: number) => {
    toast({
      title: "Modification de formation",
      description: "L'édition sera disponible prochainement."
    });
  };

  const handleAddSupport = () => {
    toast({
      title: "Ajout de support",
      description: "La fonctionnalité d'ajout de support sera disponible prochainement."
    });
  };

  const handleAddFormation = () => {
    toast({
      title: "Nouvelle formation",
      description: "La création de nouvelle formation sera disponible prochainement."
    });
  };

  const filteredFormations = formations?.filter(formation => {
    return formation.titre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const upcomingFormations = filteredFormations?.filter(f => f.statut === 'À venir' || f.statut === 'En cours');
  const pastFormations = filteredFormations?.filter(f => f.statut === 'Terminée' || f.statut === 'Annulée');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mes Formations</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleAddSupport}>
              <FileText className="w-4 h-4" />
              Ajouter un support
            </Button>
            <Button className="gap-2" onClick={handleAddFormation}>
              <Plus className="w-4 h-4" />
              Nouvelle formation
            </Button>
          </div>
        </div>

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

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Passées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-gray-500">Chargement des formations...</p>
                ) : error ? (
                  <p className="text-red-500">Erreur lors du chargement des formations.</p>
                ) : upcomingFormations && upcomingFormations.length > 0 ? (
                  upcomingFormations.map(formation => (
                    <FormationCard
                      key={formation.id}
                      formation={formation}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEditFormation}
                      showEditButton={true}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">Aucune formation à venir.</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-gray-500">Chargement des formations...</p>
                ) : error ? (
                  <p className="text-red-500">Erreur lors du chargement des formations.</p>
                ) : pastFormations && pastFormations.length > 0 ? (
                  pastFormations.map(formation => (
                    <FormationCard
                      key={formation.id}
                      formation={formation}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">Aucune formation passée.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FormationDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
        showManageButton={true}
        onManageParticipants={(id) => {
          toast({
            title: "Gestion des participants",
            description: "Cette fonctionnalité sera disponible prochainement."
          });
        }}
      />
    </Layout>
  );
}
