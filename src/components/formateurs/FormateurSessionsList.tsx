
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formationService } from "@/services/formationService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Calendar, Clock, Users } from "lucide-react";

interface FormateurSessionsListProps {
  formateurId: number;
}

export function FormateurSessionsList({
  formateurId,
}: FormateurSessionsListProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const { data: formations, isLoading } = useQuery({
    queryKey: ["formateur-formations", formateurId, filter],
    queryFn: () => formationService.getFormationsByFormateur(`Jean Dupont`), // Using a hardcoded value for demo
  });

  // In a real application, filter based on the selected filter and date
  const filteredFormations = formations
    ? formations.filter((formation) => {
        const formationDate = new Date(formation.date);
        const now = new Date();
        const isPast = formationDate < now;

        if (filter === "upcoming") return !isPast;
        if (filter === "past") return isPast;
        return true;
      })
    : [];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "À venir":
        return "bg-blue-100 text-blue-800";
      case "En cours":
        return "bg-green-100 text-green-800";
      case "Terminée":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          defaultValue={filter}
          onValueChange={(value) =>
            setFilter(value as "all" | "upcoming" | "past")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer les sessions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sessions</SelectItem>
            <SelectItem value="upcoming">Sessions à venir</SelectItem>
            <SelectItem value="past">Sessions passées</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Voir les statistiques
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement des sessions...</div>
      ) : filteredFormations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune session de formation trouvée
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFormations.map((formation) => (
            <Card key={formation.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mb-2",
                        formation.type === "HSE"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      )}
                    >
                      {formation.type}
                    </Badge>
                    <CardTitle className="text-base">{formation.titre}</CardTitle>
                    <CardDescription>ID: #{formation.id}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(formation.statut)}>
                    {formation.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(formation.date).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {formation.duree}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {formation.participants} / {formation.maxParticipants} participants
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  Détails de la session
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function for className joining
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
