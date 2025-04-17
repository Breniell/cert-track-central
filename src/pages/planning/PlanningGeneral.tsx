
import Layout from "@/components/layout/Layout";
import { CentralizedCalendar } from "@/components/planning/CentralizedCalendar";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewFormationDialog } from "@/components/planning/NewFormationDialog";
import { useAuth } from "@/contexts/AuthContext";

const PlanningGeneral = () => {
  const [isNewFormationDialogOpen, setIsNewFormationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const canCreateFormation = user?.role === 'administrateur' || 
                            user?.role === 'rh' || 
                            user?.role === 'formateur' || 
                            user?.role === 'hse';

  const handleFormationSelect = (formation) => {
    console.log("Formation sélectionnée:", formation);
    // Naviguer vers la page de détails de la formation si nécessaire
    // navigate(`/formations/${formation.id}`);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Planning Général
            </h1>
            <p className="text-muted-foreground">
              Vue d'ensemble des formations planifiées
            </p>
          </div>
          {canCreateFormation && (
            <Button onClick={() => setIsNewFormationDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle formation
            </Button>
          )}
        </div>
        
        <CentralizedCalendar 
          onEventSelect={handleFormationSelect}
          onNewEvent={canCreateFormation ? () => setIsNewFormationDialogOpen(true) : undefined}
        />
        
        {isNewFormationDialogOpen && (
          <NewFormationDialog 
            open={isNewFormationDialogOpen}
            onOpenChange={setIsNewFormationDialogOpen}
          />
        )}
      </div>
    </Layout>
  );
};

export default PlanningGeneral;
