
import { Document, DocumentStatus } from "@/types/Formation";

// Simule une base de données pour les documents
let documentsData: Document[] = [
  {
    id: 1,
    nom: "Attestation CNPS",
    type: "CNPS",
    statut: "Validé",
    dateVerification: "2024-02-15",
    verifiePar: "Jean Martin",
    dateExpiration: "2025-02-15"
  },
  {
    id: 2,
    nom: "Certificat médical",
    type: "Médical",
    statut: "À vérifier",
    commentaire: "En attente de validation par le service médical"
  },
  {
    id: 3,
    nom: "Habilitation électrique",
    type: "Habilitation",
    statut: "Validé",
    dateVerification: "2024-01-20",
    verifiePar: "Sophie Dupont",
    dateExpiration: "2026-01-20"
  },
  {
    id: 4,
    nom: "Permis CACES",
    type: "CACES",
    statut: "Rejeté",
    dateVerification: "2024-02-28",
    verifiePar: "Marc Leblanc",
    commentaire: "Document expiré, besoin de mise à jour",
    dateExpiration: "2024-01-15"
  }
];

export const documentService = {
  // Récupérer tous les documents
  getAllDocuments: async (): Promise<Document[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(documentsData);
      }, 300);
    });
  },
  
  // Récupérer les documents d'un participant
  getDocumentsByParticipant: async (participantId: number): Promise<Document[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation - dans un cas réel, filtrer par participant
        const docs = documentsData.slice(0, 2);
        resolve(docs);
      }, 300);
    });
  },
  
  // Vérifier un document
  verifyDocument: async (documentId: number, status: DocumentStatus, comment?: string): Promise<Document> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const document = documentsData.find(d => d.id === documentId);
        if (document) {
          document.statut = status;
          document.commentaire = comment;
          document.dateVerification = new Date().toISOString().split('T')[0];
          document.verifiePar = "Utilisateur actuel"; // Dans un cas réel, utiliserait l'utilisateur connecté
        }
        resolve(document || documentsData[0]);
      }, 300);
    });
  },
  
  // Ajouter un document
  addDocument: async (document: Omit<Document, 'id'>): Promise<Document> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDocument = {
          ...document,
          id: Math.max(...documentsData.map(d => d.id)) + 1
        };
        documentsData.push(newDocument);
        resolve(newDocument);
      }, 300);
    });
  },
  
  // Vérifier si les documents d'un participant sont valides
  checkParticipantDocuments: async (participantId: number): Promise<{valide: boolean; manquants: string[]}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation - vérifierait réellement les documents requis vs disponibles
        const documentsValides = Math.random() > 0.3;
        const documentsManquants = documentsValides ? [] : ["Certificat médical à jour"];
        
        resolve({
          valide: documentsValides,
          manquants: documentsManquants
        });
      }, 300);
    });
  }
};
