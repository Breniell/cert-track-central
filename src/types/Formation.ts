
export type FormationType = 'HSE' | 'Métier' | 'Urgente';
export type FormationStatus = 'À venir' | 'En cours' | 'Terminée' | 'Annulée';

export interface Formation {
  id: number;
  titre: string;
  type: FormationType;
  date: string;
  duree: string;
  lieu: string;
  participants: number;
  maxParticipants: number;
  formateur: string;
  statut: FormationStatus;
  dateValidite?: string;
  estUrgente?: boolean;
  documentationRequise?: boolean;
  documentsValides?: boolean;
  description?: string;
  prerequis?: string[];
  objectifs?: string[];
}
