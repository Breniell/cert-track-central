
import { Formation } from "@/types/Formation";

// Données de test pour les formations (simulant une API)
const formationsData: Formation[] = [
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
    documentsValides: true,
    description: "Formation obligatoire pour tous les travailleurs en hauteur. Cette formation couvre les techniques de sécurité essentielles et les équipements de protection individuelle."
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
    dateValidite: "18/03/2025",
    description: "Formation sur les bonnes pratiques de manipulation des produits chimiques dangereux et les procédures d'urgence en cas d'accident."
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
    statut: "À venir",
    description: "Formation aux techniques de maintenance préventive pour réduire les pannes et optimiser la durée de vie des équipements."
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
    estUrgente: true,
    description: "Formation pour apprendre à réagir efficacement en cas de déversement de produits dangereux et à mettre en œuvre les procédures d'urgence."
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
    estUrgente: true,
    description: "Formation obligatoire pour tous les sous-traitants avant d'accéder aux installations. Présentation des règles de sécurité et des procédures internes."
  },
  {
    id: 6,
    titre: "Techniques de soudure avancées",
    type: "Métier",
    date: "2024-04-05",
    duree: "24h",
    lieu: "Atelier de soudure",
    participants: 4,
    maxParticipants: 6,
    formateur: "Jean Dupont",
    statut: "À venir",
    description: "Formation pratique aux techniques de soudure avancées pour les professionnels. Certification à la clé."
  },
  {
    id: 7,
    titre: "Premiers secours",
    type: "HSE",
    date: "2024-04-10",
    duree: "8h",
    lieu: "Salle de formation médicale",
    participants: 15,
    maxParticipants: 20,
    formateur: "Sophie Leroux",
    statut: "À venir",
    dateValidite: "10/04/2026",
    description: "Formation aux gestes de premiers secours et à l'utilisation des défibrillateurs. Certification SST."
  },
  {
    id: 8,
    titre: "Gestion de projet industriel",
    type: "Métier",
    date: "2024-04-15",
    duree: "16h",
    lieu: "Salle de conférence",
    participants: 10,
    maxParticipants: 15,
    formateur: "Michel Bernard",
    statut: "À venir",
    description: "Formation aux méthodologies de gestion de projet adaptées au contexte industriel."
  }
];

// Service pour les formations
export const formationService = {
  // Récupère toutes les formations
  getAllFormations: async (): Promise<Formation[]> => {
    // Simulation d'un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(formationsData);
      }, 500);
    });
  },
  
  // Récupère une formation par son ID
  getFormationById: async (id: number): Promise<Formation | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formation = formationsData.find(f => f.id === id);
        resolve(formation);
      }, 300);
    });
  },
  
  // Récupère les formations d'un formateur spécifique
  getFormationsByFormateur: async (formateur: string): Promise<Formation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = formationsData.filter(f => f.formateur === formateur);
        resolve(formations);
      }, 300);
    });
  },
  
  // Récupère l'historique des formations pour un participant
  getFormationsHistoryForParticipant: async (participantId: number): Promise<Formation[]> => {
    // Pour l'exemple, on retourne simplement les formations terminées
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = formationsData.filter(f => f.statut === 'Terminée');
        resolve(formations);
      }, 300);
    });
  }
};
