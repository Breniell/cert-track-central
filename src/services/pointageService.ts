
import { Participant } from "@/types/Formation";

export interface PointageRecord {
  participantId: number;
  formationId: number;
  datePointage: string;
  typePointage: 'Entrée' | 'Sortie';
  heure: string;
  methode: 'QR' | 'Badge' | 'Manuel';
  valide: boolean;
}

// Simule une base de données pour les pointages
let pointagesData: PointageRecord[] = [
  {
    participantId: 1,
    formationId: 1,
    datePointage: "2024-03-15",
    typePointage: "Entrée",
    heure: "08:15",
    methode: "Badge",
    valide: true
  },
  {
    participantId: 1,
    formationId: 1,
    datePointage: "2024-03-15",
    typePointage: "Sortie",
    heure: "16:30",
    methode: "Badge",
    valide: true
  },
  {
    participantId: 2,
    formationId: 1,
    datePointage: "2024-03-15",
    typePointage: "Entrée",
    heure: "08:10",
    methode: "QR",
    valide: true
  }
];

export const pointageService = {
  // Récupérer tous les pointages d'une formation
  getPointagesByFormation: async (formationId: number): Promise<PointageRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = pointagesData.filter(p => p.formationId === formationId);
        resolve(records);
      }, 300);
    });
  },
  
  // Récupérer les pointages d'un participant
  getPointagesByParticipant: async (participantId: number): Promise<PointageRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = pointagesData.filter(p => p.participantId === participantId);
        resolve(records);
      }, 300);
    });
  },
  
  // Enregistrer un pointage
  recordPointage: async (pointage: Omit<PointageRecord, 'valide'>): Promise<PointageRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPointage: PointageRecord = {
          ...pointage,
          valide: true // Dans un cas réel, effectuerait des vérifications
        };
        pointagesData.push(newPointage);
        resolve(newPointage);
      }, 300);
    });
  },
  
  // Générer un code QR pour le pointage (simulé)
  generateQRCode: async (formationId: number): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simuler la génération d'un code QR (dans un cas réel, utiliserait une bibliothèque pour générer un vrai QR)
        resolve(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=formation_${formationId}_${Date.now()}`);
      }, 300);
    });
  },
  
  // Vérifier le statut de présence des participants
  checkParticipantsPresence: async (formationId: number): Promise<{presents: number; absents: number; participants: {id: number; present: boolean}[]}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans un cas réel, vérifierait les entrées et sorties pour chaque participant
        const participantsStatus = [
          {id: 1, present: true},
          {id: 2, present: true},
          {id: 3, present: false},
          {id: 4, present: true},
        ];
        
        const presents = participantsStatus.filter(p => p.present).length;
        const absents = participantsStatus.length - presents;
        
        resolve({
          presents,
          absents,
          participants: participantsStatus
        });
      }, 300);
    });
  }
};
