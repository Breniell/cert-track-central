
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
    selectedMonth,
    setSelectedMonth,
  } = useFormations();
  
  const [isNewFormationDialogOpen, setIsNewFormationDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  
  // État pour le filtre de date
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addMonths(new Date(), 1)
  });

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
  
  const handleViewCalendar = () => {
    navigate('/planning/general');
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
                  {formations.length} formations planifiées
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
                date={dateRange} 
                onDateChange={setDateRange}
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
