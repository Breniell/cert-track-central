
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, Award, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import FormationDetails from "@/components/formations/FormationDetails";

interface HistoriqueItem {
  formation: Formation;
  dateObtention: string;
  score?: number;
  certificat?: string;
}

// Données fictives pour l'historique
const historiqueData: HistoriqueItem[] = [
  {
    formation: {
      id: 4,
      titre: "Intervention d'urgence - Déversement",
      type: "HSE",
      date: "2024-03-12",
      duree: "6h",
      lieu: "Site B - Zone extérieure",
      participants: 5,
      maxParticipants: 10,
      formateur: "Sophie Leroux",
      statut: "Terminée",
      dateValidite: "12/03/2026",
      estUrgente: true
    },
    dateObtention: "12/03/2024",
    score: 85,
    certificat: "cert-123456.pdf"
  },
  {
    formation: {
      id: 10,
      titre: "Sécurité incendie",
      type: "HSE",
      date: "2024-02-05",
      duree: "4h",
      lieu: "Centre de formation",
      participants: 15,
      maxParticipants: 20,
      formateur: "Michel Bernard",
      statut: "Terminée",
      dateValidite: "05/02/2026"
    },
    dateObtention: "05/02/2024",
    score: 92,
    certificat: "cert-789012.pdf"
  },
  {
    formation: {
      id: 11,
      titre: "Gestion du stress",
      type: "Métier",
      date: "2024-01-15",
      duree: "8h",
      lieu: "Salle de conférence",
      participants: 12,
      maxParticipants: 15,
      formateur: "Marie Martin",
      statut: "Terminée"
    },
    dateObtention: "15/01/2024",
    score: 78
  }
];

export default function PersonnelHistorique() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  
  // Simuler un ID de participant
  const participantId = 1;

  const { data: historique, isLoading } = useQuery({
    queryKey: ["historique", participantId],
    queryFn: () => Promise.resolve(historiqueData)
  });

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Votre historique sera téléchargé dans quelques instants."
    });
  };

  const handleCertificateDownload = (certificat: string) => {
    toast({
      title: "Téléchargement",
      description: `Le certificat ${certificat} sera téléchargé dans quelques instants.`
    });
  };

  const handleViewDetails = (formation: Formation) => {
    setSelectedFormation(formation);
    setIsDetailsOpen(true);
  };

  const filteredHistorique = historique?.filter(item => 
    item.formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.formation.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Historique de formations</h1>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher dans l'historique..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Chargement de l'historique...</p>
            ) : filteredHistorique && filteredHistorique.length > 0 ? (
              filteredHistorique.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          item.formation.type === 'HSE' 
                            ? 'bg-ctc-hse-light text-ctc-hse' 
                            : 'bg-ctc-metier-light text-ctc-metier'
                        }`}>
                          {item.formation.type}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{item.formation.titre}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Obtenu le {item.dateObtention}
                        </div>
                        {item.score && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="w-4 h-4 mr-2 text-gray-400" />
                            Score: {item.score}/100
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          Durée: {item.formation.duree}
                        </div>
                      </div>
                      
                      {item.formation.dateValidite && (
                        <div className="flex items-center text-sm text-green-600">
                          <Award className="w-4 h-4 mr-2" />
                          Valide jusqu'au {item.formation.dateValidite}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 md:mt-0">
                      {item.certificat && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1"
                          onClick={() => handleCertificateDownload(item.certificat!)}
                        >
                          <Download className="w-3 h-3" />
                          Certificat
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(item.formation)}
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucune formation dans votre historique ne correspond à votre recherche.</p>
            )}
          </div>
        </div>
      </div>

      <FormationDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
      />
    </Layout>
  );
}
