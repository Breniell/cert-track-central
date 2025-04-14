
import Layout from "@/components/layout/Layout";
import FormationPlanning from "@/components/formations/FormationPlanning";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const PlanningGeneral = () => {
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
          <Button>Nouvelle formation</Button>
        </div>
        <FormationPlanning />
      </div>
    </Layout>
  );
};

export default PlanningGeneral;
