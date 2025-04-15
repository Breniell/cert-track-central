
interface Prestataire {
  id: number;
  nom: string;
  contact: string;
  specialite: string[];
  evaluation?: number;
  historique?: {
    id: number;
    date: string;
    prestation: string;
    montant: number;
    evaluation: number;
  }[];
}

export interface AppelOffre {
  id: number;
  reference: string;
  titre: string;
  description: string;
  typeFormation: string;
  datePublication: string;
  dateCloture: string;
  statut: 'En préparation' | 'Publié' | 'Clôturé' | 'Attribué' | 'Annulé';
  budgetMaximum?: number;
  criteres: {
    experience: number;
    qualification: string[];
    delai: string;
    autres?: string[];
  };
  documents: {
    nom: string;
    obligatoire: boolean;
    url?: string;
  }[];
  prestataires?: {
    id: number;
    nom: string;
    dateReponse?: string;
    offreTechnique?: number;
    offreFinanciere?: number;
    montantPropose?: number;
    statut: 'Invité' | 'A répondu' | 'Sélectionné' | 'Rejeté';
  }[];
  prestataireSeletionne?: number;
  departementDemandeur: string;
  responsableDemande: string;
}

// Données de test pour les prestataires
const prestatairesData: Prestataire[] = [
  {
    id: 1,
    nom: "FormaPro SARL",
    contact: "contact@formapro.com",
    specialite: ["HSE", "Qualité", "Management"],
    evaluation: 4.7,
    historique: [
      {
        id: 1,
        date: "2023-06-15",
        prestation: "Formation Sécurité Incendie",
        montant: 1200000,
        evaluation: 4.8
      },
      {
        id: 2,
        date: "2023-09-22",
        prestation: "Formation Travail en Hauteur",
        montant: 850000,
        evaluation: 4.7
      }
    ]
  },
  {
    id: 2,
    nom: "SafetyFirst Consulting",
    contact: "info@safetyfirst.com",
    specialite: ["HSE", "Premiers Secours", "Risques Industriels"],
    evaluation: 4.9,
    historique: [
      {
        id: 3,
        date: "2023-05-10",
        prestation: "Formation Premiers Secours",
        montant: 750000,
        evaluation: 4.9
      }
    ]
  },
  {
    id: 3,
    nom: "TechnoForm",
    contact: "contact@technoform.com",
    specialite: ["Maintenance", "Électricité", "Automation"],
    evaluation: 4.5
  },
  {
    id: 4,
    nom: "QualitéPlus Formation",
    contact: "info@qualiteplus.com",
    specialite: ["Qualité", "Normes ISO", "Audit"],
    evaluation: 4.6,
    historique: [
      {
        id: 4,
        date: "2023-08-05",
        prestation: "Formation ISO 9001",
        montant: 1500000,
        evaluation: 4.6
      }
    ]
  }
];

// Données de test pour les appels d'offre
const appelsOffreData: AppelOffre[] = [
  {
    id: 1,
    reference: "AO-2024-001",
    titre: "Formation aux techniques de soudure avancées",
    description: "Formation destinée aux techniciens de maintenance pour maîtriser les techniques de soudure TIG, MIG et à l'arc.",
    typeFormation: "Métier",
    datePublication: "2024-03-01",
    dateCloture: "2024-03-15",
    statut: "Clôturé",
    budgetMaximum: 2500000,
    criteres: {
      experience: 5,
      qualification: ["Certification en soudure", "Expérience industrielle"],
      delai: "2 semaines",
      autres: ["Matériel fourni", "Support de cours inclus"]
    },
    documents: [
      { nom: "Cahier des charges", obligatoire: true, url: "#" },
      { nom: "Plan d'accès site", obligatoire: false, url: "#" }
    ],
    prestataires: [
      { id: 3, nom: "TechnoForm", dateReponse: "2024-03-10", offreTechnique: 85, offreFinanciere: 90, montantPropose: 2200000, statut: "Sélectionné" },
      { id: 1, nom: "FormaPro SARL", dateReponse: "2024-03-12", offreTechnique: 80, offreFinanciere: 75, montantPropose: 2400000, statut: "Rejeté" }
    ],
    prestataireSeletionne: 3,
    departementDemandeur: "Maintenance",
    responsableDemande: "Thomas Lefort"
  },
  {
    id: 2,
    reference: "AO-2024-002",
    titre: "Formation Gestion des Risques Industriels",
    description: "Formation HSE complète sur l'identification, l'évaluation et la maîtrise des risques industriels.",
    typeFormation: "HSE",
    datePublication: "2024-03-10",
    dateCloture: "2024-03-30",
    statut: "Publié",
    budgetMaximum: 3000000,
    criteres: {
      experience: 7,
      qualification: ["Certification HSE", "Expérience en industrie lourde"],
      delai: "3 semaines"
    },
    documents: [
      { nom: "Cahier des charges", obligatoire: true, url: "#" },
      { nom: "Formulaire de réponse", obligatoire: true, url: "#" }
    ],
    prestataires: [
      { id: 1, nom: "FormaPro SARL", statut: "Invité" },
      { id: 2, nom: "SafetyFirst Consulting", dateReponse: "2024-03-20", offreTechnique: 92, offreFinanciere: 85, montantPropose: 2800000, statut: "A répondu" }
    ],
    departementDemandeur: "HSE",
    responsableDemande: "Claire Moreau"
  },
  {
    id: 3,
    reference: "AO-2024-003",
    titre: "Formation ISO 45001 - Système de management de la santé et sécurité au travail",
    description: "Formation complète sur la mise en place et l'audit du système de management ISO 45001.",
    typeFormation: "HSE",
    datePublication: "2024-03-20",
    dateCloture: "2024-04-10",
    statut: "En préparation",
    criteres: {
      experience: 5,
      qualification: ["Certification ISO 45001", "Expérience d'auditeur"],
      delai: "4 semaines"
    },
    documents: [
      { nom: "Cahier des charges", obligatoire: true, url: "#" }
    ],
    departementDemandeur: "Qualité",
    responsableDemande: "Sophie Martin"
  }
];

// Service pour les appels d'offre
export const appelOffreService = {
  // Récupérer tous les appels d'offre
  getAllAppelsOffre: async (): Promise<AppelOffre[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(appelsOffreData);
      }, 500);
    });
  },
  
  // Récupérer un appel d'offre par son ID
  getAppelOffreById: async (id: number): Promise<AppelOffre | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appelOffre = appelsOffreData.find(ao => ao.id === id);
        resolve(appelOffre);
      }, 300);
    });
  },
  
  // Récupérer les appels d'offre par statut
  getAppelsOffreByStatut: async (statut: AppelOffre['statut']): Promise<AppelOffre[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appelsOffre = appelsOffreData.filter(ao => ao.statut === statut);
        resolve(appelsOffre);
      }, 300);
    });
  },
  
  // Créer un nouvel appel d'offre
  createAppelOffre: async (appelOffre: Omit<AppelOffre, 'id'>): Promise<AppelOffre> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppelOffre: AppelOffre = {
          ...appelOffre,
          id: Math.max(...appelsOffreData.map(ao => ao.id)) + 1
        };
        appelsOffreData.push(newAppelOffre);
        resolve(newAppelOffre);
      }, 300);
    });
  },
  
  // Mettre à jour un appel d'offre
  updateAppelOffre: async (id: number, updates: Partial<AppelOffre>): Promise<AppelOffre | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = appelsOffreData.findIndex(ao => ao.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        appelsOffreData[index] = { ...appelsOffreData[index], ...updates };
        resolve(appelsOffreData[index]);
      }, 300);
    });
  },
  
  // Publier un appel d'offre
  publierAppelOffre: async (id: number): Promise<AppelOffre | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = appelsOffreData.findIndex(ao => ao.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        appelsOffreData[index].statut = 'Publié';
        appelsOffreData[index].datePublication = new Date().toISOString().split('T')[0];
        resolve(appelsOffreData[index]);
      }, 300);
    });
  },
  
  // Clôturer un appel d'offre
  cloturerAppelOffre: async (id: number): Promise<AppelOffre | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = appelsOffreData.findIndex(ao => ao.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        appelsOffreData[index].statut = 'Clôturé';
        resolve(appelsOffreData[index]);
      }, 300);
    });
  },
  
  // Attribuer un appel d'offre à un prestataire
  attribuerAppelOffre: async (id: number, prestataireId: number): Promise<AppelOffre | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = appelsOffreData.findIndex(ao => ao.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        // Mettre à jour le statut de l'appel d'offre
        appelsOffreData[index].statut = 'Attribué';
        appelsOffreData[index].prestataireSeletionne = prestataireId;
        
        // Mettre à jour le statut du prestataire
        if (appelsOffreData[index].prestataires) {
          const prestataires = appelsOffreData[index].prestataires.map(p => {
            if (p.id === prestataireId) {
              return { ...p, statut: 'Sélectionné' as const };
            } else if (p.statut === 'A répondu') {
              return { ...p, statut: 'Rejeté' as const };
            }
            return p;
          });
          appelsOffreData[index].prestataires = prestataires;
        }
        
        resolve(appelsOffreData[index]);
      }, 300);
    });
  },
  
  // Récupérer tous les prestataires
  getAllPrestataires: async (): Promise<Prestataire[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(prestatairesData);
      }, 300);
    });
  },
  
  // Récupérer un prestataire par son ID
  getPrestataireById: async (id: number): Promise<Prestataire | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prestataire = prestatairesData.find(p => p.id === id);
        resolve(prestataire);
      }, 200);
    });
  }
};
