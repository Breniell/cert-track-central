
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";

import PlanningHeader from "@/components/planning/PlanningHeader";
import PlanningFilters from "@/components/planning/PlanningFilters";
import FormationCard, { Formation } from "@/components/planning/FormationCard";
import NewFormationDialog from "@/components/planning/NewFormationDialog";
import FormationDetailsDialog from "@/components/planning/FormationDetailsDialog";

// Données de test étendues avec des champs supplémentaires
const planningData: Formation[] = [
  {
    id: 1,
    titre: "Sécurité en hauteur",
    type: "HSE",
    date: "2024-03-15",
    duree: "8h",
    lieu: "Site A - Salle 102",
    participants: 8,
    maxParticipants: 12,
    formateur: "Jean Dupont",
    statut: "À venir",
    dateValidite: "15/03/2025",
    documentationRequise: true,
    documentsValides: true
  },
  {
    id: 2,
    titre: "Manipulation des produits chimiques",
    type: "HSE",
    date: "2024-03-18",
    duree: "4h",
    lieu: "Laboratoire principal",
    participants: 6,
    maxParticipants: 8,
    formateur: "Marie Martin",
    statut: "En cours",
    dateValidite: "18/03/2025"
  },
  {
    id: 3,
    titre: "Maintenance préventive",
    type: "Métier",
    date: "2024-03-20",
    duree: "16h",
    lieu: "Atelier technique",
    participants: 12,
    maxParticipants: 15,
    formateur: "Pierre Dubois",
    statut: "À venir"
  },
  {
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
  {
    id: 5,
    titre: "Accueil sous-traitants",
    type: "HSE",
    date: "2024-03-22",
    duree: "2h",
    lieu: "Salle de réunion principale",
    participants: 3,
    maxParticipants: 20,
    formateur: "Michel Bernard",
    statut: "À venir",
    documentationRequise: true,
    documentsValides: false,
    estUrgente: true
  }
];

export default function Planning() {
  const [formations, setFormations] = useState<Formation[]>(planningData);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  
  // Dialogs state
  const [isNewFormationDialogOpen, setIsNewFormationDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const nextId = () => {
    return Math.max(...formations.map(f => f.id)) + 1;
  };

  const handleNewFormation = () => {
    setIsNewFormationDialogOpen(true);
  };

  const handleSaveFormation = (formationData: any) => {
    const newFormation = {
      id: nextId(),
      ...formationData,
    };
    
    setFormations([...formations, newFormation]);
    toast({
      title: "Formation ajoutée",
      description: "La formation a été ajoutée avec succès au planning."
    });
  };

  const handleExportPlanning = () => {
    toast({
      title: "Export en cours",
      description: "Le planning est en cours d'exportation..."
    });
    // Logique d'export serait implémentée ici
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
      title: "Modification",
      description: `Ouverture de l'éditeur pour la formation #${id}`
    });
    // La logique de modification serait implémentée ici
  };

  const filteredFormations = formations.filter(formation => {
    // Filtrage par recherche
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrage par type
    const matchesType = selectedType === 'Tous' || 
                        formation.type === selectedType || 
                        (selectedType === 'Urgente' && formation.estUrgente);
    
    // Filtrage par mois (simplifié, nous utilisons seulement le mois)
    const formationDate = new Date(formation.date);
    const matchesMonth = formationDate.getMonth() === selectedMonth.getMonth() && 
                         formationDate.getFullYear() === selectedMonth.getFullYear();
    
    return matchesSearch && matchesType && matchesMonth;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <PlanningHeader 
          formationsCount={formations.length}
          onNewFormation={handleNewFormation}
          onExport={handleExportPlanning}
        />

        {/* Filtres et recherche */}
        <PlanningFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* Planning */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 space-y-6">
            {filteredFormations.length > 0 ? (
              filteredFormations.map((formation) => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditFormation}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune formation ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <NewFormationDialog
        isOpen={isNewFormationDialogOpen}
        onClose={() => setIsNewFormationDialogOpen(false)}
        onSave={handleSaveFormation}
      />

      <FormationDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        formation={selectedFormation}
      />
    </Layout>
  );
}
