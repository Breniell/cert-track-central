
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, CalendarIcon } from "lucide-react";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import FormationCard from "@/components/formations/FormationCard";
import FormationDetails from "@/components/formations/FormationDetails";
import { toast } from "@/hooks/use-toast";

export default function PersonnelFormations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const { data: formations, isLoading, error } = useQuery({
    queryKey: ["formations"],
    queryFn: formationService.getAllFormations
  });

  const handleViewDetails = (id: number) => {
    const formation = formations?.find(f => f.id === id) || null;
    setSelectedFormation(formation);
    setIsDetailsOpen(true);
  };

  const handleRegister = (id: number) => {
    toast({
      title: "Inscription en cours",
      description: "Votre demande d'inscription a été prise en compte."
    });
  };

  const filteredFormations = formations?.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "Tous" || formation.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Catalogue des formations</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
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
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les types</SelectItem>
                <SelectItem value="HSE">HSE</SelectItem>
                <SelectItem value="Métier">Métier</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Chargement du catalogue...</p>
            ) : error ? (
              <p className="text-red-500">Erreur lors du chargement des formations.</p>
            ) : filteredFormations && filteredFormations.length > 0 ? (
              filteredFormations.map(formation => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  onViewDetails={handleViewDetails}
                  onRegister={handleRegister}
                  showRegisterButton={true}
                />
              ))
            ) : (
              <p className="text-gray-500">Aucune formation ne correspond à vos critères.</p>
            )}
          </div>
        </div>
      </div>

      <FormationDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
        onRegister={handleRegister}
        showRegisterButton={true}
      />
    </Layout>
  );
}
