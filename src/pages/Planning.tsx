
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { useFormations } from "@/hooks/useFormations";
import PlanningFilters from "@/components/planning/PlanningFilters";
import FormationsList from "@/components/planning/FormationsList";
import NewFormationDialog from "@/components/planning/NewFormationDialog";
import FormationDetailsDialog from "@/components/planning/FormationDetailsDialog";
import { Button } from "@/components/ui/button";
import { Plus, Download, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { Formation } from "@/types/Formation";

export default function Planning() {
  const navigate = useNavigate();
  const {
    formations,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredFormations,
    handleNewFormation,
    dateRange,
    setDateRange,
  } = useFormations();
  
  const [isNewFormationDialogOpen, setIsNewFormationDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const handleExportPlanning = () => {
    // Exemple de logique d'exportation
    const formationsData = filteredFormations.map(f => ({
      titre: f.titre,
      date: f.date,
      formateur: f.formateur,
      lieu: f.lieu,
      type: f.type,
      participants: `${f.participants}/${f.maxParticipants}`
    }));

    // Créer un objet Blob avec les données
    const blob = new Blob([JSON.stringify(formationsData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning_formations_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export réussi",
      description: "Le planning a été exporté avec succès"
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
    const formation = formations.find(f => f.id === id);
    if (formation) {
      toast({
        title: "Modification de formation",
        description: `Modification de la formation "${formation.titre}" en cours...`
      });
    }
  };
  
  const handleViewCalendar = () => {
    navigate('/planning/general');
  };

  // Gérer le changement de date avec le bon typage
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">Planning des Formations</CardTitle>
                <p className="text-gray-500 mt-1">
                  {filteredFormations.length} formations planifiées
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleExportPlanning}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" onClick={handleViewCalendar}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Vue Calendrier
                </Button>
                <Button onClick={() => setIsNewFormationDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Formation
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Période</h3>
              <DatePickerWithRange 
                date={dateRange || { from: new Date(), to: addMonths(new Date(), 1) }}
                onDateChange={handleDateRangeChange}
              />
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
          </CardContent>
        </Card>
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
