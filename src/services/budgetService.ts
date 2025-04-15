
import { Cout } from "@/types/Formation";

interface BudgetFormation {
  formationId: number;
  titre: string;
  type: string;
  date: string;
  couts: Cout;
}

interface RapportBudget {
  periode: string;
  coutTotal: number;
  coutParType: {
    type: string;
    montant: number;
    pourcentage: number;
  }[];
  coutParMois: {
    mois: string;
    montant: number;
  }[];
  formationsRealisees: number;
  coutMoyenParFormation: number;
  coutMoyenParParticipant: number;
}

// Simule une base de données pour les budgets
let budgetsData: BudgetFormation[] = [
  {
    formationId: 1,
    titre: "Sécurité en hauteur",
    type: "HSE",
    date: "2024-03-15",
    couts: {
      formateurCout: 250000,
      materiel: 50000,
      salle: 100000,
      restauration: 75000,
      total: 475000,
      devise: "FCFA"
    }
  },
  {
    formationId: 2,
    titre: "Manipulation des produits chimiques",
    type: "HSE",
    date: "2024-03-18",
    couts: {
      formateurCout: 200000,
      materiel: 75000,
      salle: 100000,
      restauration: 60000,
      total: 435000,
      devise: "FCFA"
    }
  },
  {
    formationId: 3,
    titre: "Maintenance préventive",
    type: "Métier",
    date: "2024-03-20",
    couts: {
      formateurCout: 500000,
      materiel: 150000,
      salle: 120000,
      restauration: 180000,
      total: 950000,
      devise: "FCFA"
    }
  }
];

// Define a new interface for the budget overview data
interface BudgetOverviewItem {
  id: number;
  titre: string;
  type: string;
  date: string;
  montant: number;
  departement: string;
  participants: number;
  status: string;
}

export const budgetService = {
  // Récupérer le budget d'une formation
  getFormationBudget: async (formationId: number): Promise<BudgetFormation | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const budget = budgetsData.find(b => b.formationId === formationId);
        resolve(budget);
      }, 300);
    });
  },
  
  // Add the missing getBudgetOverview method
  getBudgetOverview: (): BudgetOverviewItem[] => {
    return [
      {
        id: 1,
        titre: "Sécurité en hauteur",
        type: "HSE",
        date: "2024-03-15",
        montant: 475000,
        departement: "Production",
        participants: 12,
        status: "Terminée"
      },
      {
        id: 2,
        titre: "Manipulation des produits chimiques",
        type: "HSE",
        date: "2024-03-18",
        montant: 435000,
        departement: "HSE",
        participants: 15,
        status: "En cours"
      },
      {
        id: 3,
        titre: "Maintenance préventive",
        type: "Métier",
        date: "2024-03-20",
        montant: 950000,
        departement: "Maintenance",
        participants: 8,
        status: "À venir"
      },
      {
        id: 4,
        titre: "Leadership et Management",
        type: "Métier",
        date: "2024-03-22",
        montant: 850000,
        departement: "RH",
        participants: 10,
        status: "À venir"
      }
    ];
  },
  
  // Créer ou mettre à jour le budget d'une formation
  updateFormationBudget: async (budget: BudgetFormation): Promise<BudgetFormation> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = budgetsData.findIndex(b => b.formationId === budget.formationId);
        if (index >= 0) {
          budgetsData[index] = budget;
        } else {
          budgetsData.push(budget);
        }
        resolve(budget);
      }, 300);
    });
  },
  
  // Générer un rapport budgétaire pour une période
  generateBudgetReport: async (debut: string, fin: string): Promise<RapportBudget> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans un cas réel, filtrerait par date et effectuerait des calculs détaillés
        // Ceci est une simulation
        const coutTotal = budgetsData.reduce((sum, b) => sum + b.couts.total, 0);
        
        // Calcul des coûts par type
        const typesSet = new Set(budgetsData.map(b => b.type));
        const coutParType = Array.from(typesSet).map(type => {
          const formationsDeType = budgetsData.filter(b => b.type === type);
          const montant = formationsDeType.reduce((sum, b) => sum + b.couts.total, 0);
          return {
            type,
            montant,
            pourcentage: Math.round((montant / coutTotal) * 100)
          };
        });
        
        // Coûts par mois (simplifié)
        const coutParMois = [
          { mois: "Janvier", montant: 0 },
          { mois: "Février", montant: 0 },
          { mois: "Mars", montant: coutTotal }
        ];
        
        resolve({
          periode: `${debut} au ${fin}`,
          coutTotal,
          coutParType,
          coutParMois,
          formationsRealisees: budgetsData.length,
          coutMoyenParFormation: Math.round(coutTotal / budgetsData.length),
          coutMoyenParParticipant: 112500 // Valeur simulée
        });
      }, 500);
    });
  },
  
  // Calculer le retour sur investissement (ROI)
  calculateROI: async (formationId: number): Promise<{
    investissement: number;
    beneficesEstimes: number;
    roi: number;
    periodeAmortissement: number;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const budget = budgetsData.find(b => b.formationId === formationId);
        
        if (!budget) {
          resolve({
            investissement: 0,
            beneficesEstimes: 0,
            roi: 0,
            periodeAmortissement: 0
          });
          return;
        }
        
        // Dans un cas réel, utiliserait des calculs basés sur des modèles financiers
        // Ceci est une simulation
        const investissement = budget.couts.total;
        const beneficesEstimes = investissement * 1.5; // 150% de l'investissement
        const roi = Math.round(((beneficesEstimes - investissement) / investissement) * 100);
        
        resolve({
          investissement,
          beneficesEstimes,
          roi,
          periodeAmortissement: 8 // En mois
        });
      }, 300);
    });
  }
};
