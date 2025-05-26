
import { Formation } from '@/types';

// Mock data for formations
const mockFormations: Formation[] = [
  {
    id: "1",
    title: "Formation HSE - Sécurité au travail",
    description: "Formation obligatoire sur la sécurité au travail",
    startDate: "2024-01-15",
    endDate: "2024-01-15",
    location: "Salle 101",
    modality: "Présentiel",
    trainerId: "trainer1",
    maxParticipants: 20,
    status: "upcoming"
  },
  {
    id: "2", 
    title: "Formation Métier - Gestion de projet",
    description: "Améliorer vos compétences en gestion de projet",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    location: "Salle 205",
    modality: "Hybride",
    trainerId: "trainer2",
    maxParticipants: 15,
    status: "upcoming"
  }
];

export const formationService = {
  getAllFormations: async (): Promise<Formation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFormations), 500);
    });
  },

  getFormationById: async (id: string): Promise<Formation | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formation = mockFormations.find(f => f.id === id);
        resolve(formation);
      }, 300);
    });
  },

  getFormationsByFormateur: async (formateurName: string): Promise<Formation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock filtering by trainer name
        const formations = mockFormations.filter(f => 
          f.trainerId.includes('trainer') // Simple mock logic
        );
        resolve(formations);
      }, 400);
    });
  },

  createFormation: async (formation: Omit<Formation, 'id'>): Promise<Formation> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFormation: Formation = {
          ...formation,
          id: `formation_${Date.now()}`
        };
        mockFormations.push(newFormation);
        resolve(newFormation);
      }, 600);
    });
  },

  updateFormation: async (id: string, updates: Partial<Formation>): Promise<Formation> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFormations.findIndex(f => f.id === id);
        if (index === -1) {
          reject(new Error('Formation not found'));
          return;
        }
        
        mockFormations[index] = { ...mockFormations[index], ...updates };
        resolve(mockFormations[index]);
      }, 500);
    });
  },

  deleteFormation: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFormations.findIndex(f => f.id === id);
        if (index === -1) {
          reject(new Error('Formation not found'));
          return;
        }
        
        mockFormations.splice(index, 1);
        resolve();
      }, 400);
    });
  }
};
