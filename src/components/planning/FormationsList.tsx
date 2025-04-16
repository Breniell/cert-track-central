
import FormationCard from "./FormationCard";
import { Formation } from "@/types/Formation";

interface FormationsListProps {
  formations: Formation[];
  onViewDetails: (id: number) => void;
}

export default function FormationsList({ formations, onViewDetails }: FormationsListProps) {
  if (formations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune formation ne correspond à vos critères de recherche.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {formations.map((formation) => (
        <FormationCard
          key={formation.id}
          formation={formation}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
