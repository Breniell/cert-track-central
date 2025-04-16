
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { useFormations } from "@/hooks/useFormations";
import PlanningFilters from "@/components/planning/PlanningFilters";
import FormationsList from "@/components/planning/FormationsList";
import NewFormationDialog from "@/components/planning/NewFormationDialog";
import FormationDetailsDialog from "@/components/planning/FormationDetailsDialog";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function Planning() {
  const {
    formations,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredFormations,
    handleNewFormation,
  } = useFormations();
  
  const [isNewFormationDialogOpen, setIsNewFormationDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);

  const handleExportPlanning = () => {
    toast({
      title: "Export en cours",
      description: "Le planning est en cours d'exportation..."
    });
  };

  const handleViewDetails = (id: number) => {
    const formation = formations.find(f => f.id === id);
    if (formation) {
      setSelectedFormation(formation);
      setIsDetailsDialogOpen(true);
    }
  };
  
  const handleEditFormation = (id: number) => {
    toast({
      title: "Modification de formation",
      description: "Fonctionnalité de modification en cours de développement."
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Planning des Formations</h1>
            <p className="text-gray-500 mt-1">
              {formations.length} formations planifiées
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportPlanning}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={() => setIsNewFormationDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Formation
            </Button>
          </div>
        </div>

        <PlanningFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        <FormationsList 
          formations={filteredFormations} 
          onViewDetails={handleViewDetails}
          onEdit={handleEditFormation}
        />
      </div>

      <NewFormationDialog
        isOpen={isNewFormationDialogOpen}
        onClose={() => setIsNewFormationDialogOpen(false)}
        onSave={handleNewFormation}
      />

      <FormationDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        formation={selectedFormation}
      />
    </Layout>
  );
}
