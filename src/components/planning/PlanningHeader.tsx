
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";

interface PlanningHeaderProps {
  formationsCount: number;
  onNewFormation: () => void;
  onExport: () => void;
}

export default function PlanningHeader({ 
  formationsCount, 
  onNewFormation, 
  onExport 
}: PlanningHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Planning des Formations</h1>
        <p className="text-gray-500 mt-1">
          {formationsCount} formations planifiées
        </p>
      </div>
      <div className="flex space-x-3">
        <Button variant="outline" className="gap-2" onClick={onExport}>
          <Download className="w-4 h-4" />
          Exporter
        </Button>
        <Button className="gap-2" onClick={onNewFormation}>
          <Plus className="w-4 h-4" />
          Nouvelle Formation
        </Button>
      </div>
    </div>
  );
}
