
import FormationCard from "./FormationCard";
import { Formation } from "@/types/Formation";
import { Card, CardContent } from "@/components/ui/card";

interface FormationsListProps {
  formations: Formation[];
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function FormationsList({ formations, onViewDetails, onEdit }: FormationsListProps) {
  if (formations.length === 0) {
    return (
      <Card className="mt-4 bg-gray-50">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Aucune formation ne correspond à vos critères de recherche.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {formations.map((formation) => (
        <FormationCard
          key={formation.id}
          formation={formation}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
