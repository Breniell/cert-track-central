
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import FormationDetails from "@/components/formations/FormationDetails";
import { toast } from "@/hooks/use-toast";

export default function FormateurPlanning() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  // Simuler un ID de formateur
  const formateurId = "Jean Dupont";

  const { data: formations, isLoading, error } = useQuery({
    queryKey: ["formations", "formateur", formateurId],
    queryFn: () => formationService.getFormationsByFormateur(formateurId)
  });

  const handleViewDetails = (id: number) => {
    const formation = formations?.find(f => f.id === id) || null;
    setSelectedFormation(formation);
    setIsDetailsOpen(true);
  };

  const nextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const filteredFormations = formations?.filter(formation => {
    const formationDate = new Date(formation.date);
    return formationDate.getMonth() === selectedMonth.getMonth() && 
           formationDate.getFullYear() === selectedMonth.getFullYear() &&
           (formation.statut === 'À venir' || formation.statut === 'En cours');
  });

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mon Planning</h1>
          <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-300">
            <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium mx-4">
              {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sessions à venir</h2>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Chargement du planning...</p>
            ) : error ? (
              <p className="text-red-500">Erreur lors du chargement du planning.</p>
            ) : filteredFormations && filteredFormations.length > 0 ? (
              filteredFormations.map(formation => (
                <div key={formation.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          formation.type === 'HSE' 
                            ? 'bg-ctc-hse-light text-ctc-hse' 
                            : 'bg-ctc-metier-light text-ctc-metier'
                        }`}>
                          {formation.type}
                        </span>
                        <h3 className="font-medium">{formation.titre}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(formation.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {formation.duree}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {formation.lieu}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(formation.id)}
                    >
                      Voir détails
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucune session programmée pour ce mois.</p>
            )}
          </div>
        </div>
      </div>

      <FormationDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
        showManageButton={true}
        onManageParticipants={(id) => {
          toast({
            title: "Gestion des participants",
            description: "Cette fonctionnalité sera disponible prochainement."
          });
        }}
      />
    </Layout>
  );
}
