
import { Formateur } from "@/types/Formation";

// Données de test pour les formateurs
const formateursData: Formateur[] = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.formateur@example.com",
    telephone: "+237 691234567",
    specialites: ["Sécurité en hauteur", "Premiers secours", "Incendie"],
    certifications: ["Formateur HSE Niveau 3", "SST", "Sécurité Incendie"],
    tauxHoraire: 15000,
    disponibilites: [
      { debut: "2024-03-20T08:00:00", fin: "2024-03-20T17:00:00" },
      { debut: "2024-03-21T08:00:00", fin: "2024-03-21T17:00:00" },
      { debut: "2024-03-22T08:00:00", fin: "2024-03-22T17:00:00" }
    ],
    evaluations: [
      { score: 4.8, commentaire: "Excellent formateur, explications claires", formation: 1 },
      { score: 4.9, commentaire: "Très compétent, exemples concrets", formation: 7 }
    ]
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@example.com",
    telephone: "+237 697654321",
    specialites: ["Risques chimiques", "Protection environnementale", "Manutention"],
    certifications: ["IOSH", "NEBOSH"],
    tauxHoraire: 18000,
    disponibilites: [
      { debut: "2024-03-27T08:00:00", fin: "2024-03-27T17:00:00" },
      { debut: "2024-03-28T08:00:00", fin: "2024-03-28T17:00:00" },
      { debut: "2024-03-29T08:00:00", fin: "2024-03-29T17:00:00" }
    ],
    evaluations: [
      { score: 4.7, commentaire: "Bonnes explications et supports de qualité", formation: 2 },
      { score: 4.8, commentaire: "Formatrice très pédagogue", formation: 4 }
    ]
  },
  {
    id: 3,
    nom: "Dubois",
    prenom: "Pierre",
    email: "pierre.dubois@example.com",
    telephone: "+237 694567890",
    specialites: ["Maintenance industrielle", "Sécurité machines", "Habilitation électrique"],
    certifications: ["Formateur Technique Niveau 2", "Habilitation électrique"],
    tauxHoraire: 16000,
    disponibilites: [
      { debut: "2024-04-03T08:00:00", fin: "2024-04-03T17:00:00" },
      { debut: "2024-04-04T08:00:00", fin: "2024-04-04T17:00:00" },
      { debut: "2024-04-05T08:00:00", fin: "2024-04-05T17:00:00" }
    ]
  },
  {
    id: 4,
    nom: "Leroux",
    prenom: "Sophie",
    email: "sophie.leroux@example.com",
    telephone: "+237 698765432",
    specialites: ["Sécurité incendie", "Évacuation d'urgence", "Secourisme"],
    certifications: ["Formatrice HSE", "Sécurité incendie Niveau 3", "SST"],
    tauxHoraire: 17000,
    disponibilites: [
      { debut: "2024-04-10T08:00:00", fin: "2024-04-10T17:00:00" },
      { debut: "2024-04-11T08:00:00", fin: "2024-04-11T17:00:00" },
      { debut: "2024-04-12T08:00:00", fin: "2024-04-12T17:00:00" }
    ]
  },
  {
    id: 5,
    nom: "Bernard",
    prenom: "Michel",
    email: "michel.bernard@example.com",
    telephone: "+237 699876543",
    specialites: ["Procédés de fabrication", "Contrôle qualité", "Gestion des risques"],
    certifications: ["Génie industriel", "Six Sigma"],
    tauxHoraire: 19000,
    disponibilites: [
      { debut: "2024-04-17T08:00:00", fin: "2024-04-17T17:00:00" },
      { debut: "2024-04-18T08:00:00", fin: "2024-04-18T17:00:00" },
      { debut: "2024-04-19T08:00:00", fin: "2024-04-19T17:00:00" }
    ]
  }
];

// Service pour les formateurs
export const formateurService = {
  // Récupérer tous les formateurs
  getAllFormateurs: async (): Promise<Formateur[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(formateursData);
      }, 500);
    });
  },
  
  // Récupérer un formateur par son ID
  getFormateurById: async (id: number): Promise<Formateur | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formateur = formateursData.find(f => f.id === id);
        resolve(formateur);
      }, 300);
    });
  },
  
  // Rechercher des formateurs par spécialité
  getFormateursBySpecialite: async (specialite: string): Promise<Formateur[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formateurs = formateursData.filter(f => 
          f.specialites.some(s => s.toLowerCase().includes(specialite.toLowerCase()))
        );
        resolve(formateurs);
      }, 300);
    });
  },
  
  // Vérifier la disponibilité d'un formateur pour une date donnée
  checkFormateurDisponibilite: async (formateurId: number, date: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formateur = formateursData.find(f => f.id === formateurId);
        if (!formateur || !formateur.disponibilites) {
          resolve(false);
          return;
        }
        
        const targetDate = new Date(date).toDateString();
        const isDisponible = formateur.disponibilites.some(dispo => {
          const dispoDate = new Date(dispo.debut).toDateString();
          return dispoDate === targetDate;
        });
        
        resolve(isDisponible);
      }, 300);
    });
  },
  
  // Calculer le coût d'un formateur pour une durée spécifique
  calculerCoutFormateur: async (formateurId: number, heures: number): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formateur = formateursData.find(f => f.id === formateurId);
        if (!formateur) {
          resolve(0);
          return;
        }
        
        const cout = formateur.tauxHoraire * heures;
        resolve(cout);
      }, 200);
    });
  },
  
  // Ajouter un nouveau formateur
  ajouterFormateur: async (formateur: Omit<Formateur, 'id'>): Promise<Formateur> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFormateur: Formateur = {
          ...formateur,
          id: Math.max(...formateursData.map(f => f.id)) + 1
        };
        formateursData.push(newFormateur);
        resolve(newFormateur);
      }, 300);
    });
  },
  
  // Mettre à jour un formateur existant
  updateFormateur: async (id: number, updates: Partial<Formateur>): Promise<Formateur | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = formateursData.findIndex(f => f.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        formateursData[index] = { ...formateursData[index], ...updates };
        resolve(formateursData[index]);
      }, 300);
    });
  }
};
