
export type FormationType = 'HSE' | 'Métier' | 'Urgente';
export type FormationStatus = 'À venir' | 'En cours' | 'Terminée' | 'Annulée';
export type DocumentStatus = 'À vérifier' | 'Validé' | 'Rejeté' | 'Non requis';

export interface Prerequis {
  id: number;
  description: string;
  obligatoire: boolean;
}

export interface Document {
  id: number;
  nom: string;
  type: string;
  statut: DocumentStatus;
  dateVerification?: string;
  verifiePar?: string;
  commentaire?: string;
  dateExpiration?: string;
}

export interface Participant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  type: 'Interne' | 'Sous-traitant';
  departement?: string;
  entreprise?: string;
  documentsValidation?: {
    cnps?: boolean;
    certificatMedical?: boolean;
  };
  presence?: {
    pointageEntree?: string;
    pointageSortie?: string;
    present: boolean;
  };
  evaluation?: {
    score?: number;
    valide?: boolean;
    commentaire?: string;
  };
}

export interface Formateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialites: string[];
  certifications: string[];
  tauxHoraire: number;
  disponibilites?: {
    debut: string;
    fin: string;
  }[];
  evaluations?: {
    score: number;
    commentaire: string;
    formation: number;
  }[];
}

export interface Cout {
  formateurCout: number;
  materiel?: number;
  salle?: number;
  restauration?: number;
  total: number;
  devise: 'FCFA' | 'EUR';
}

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

  // Nouveaux champs selon le cahier des charges
  formateurDetails?: Formateur;
  listeParticipants?: Participant[];
  documents?: Document[];
  prerequisDetails?: Prerequis[];
  couts?: Cout;
  departement?: string;
  modeFormation?: 'Interne' | 'Externe';
  appeldoffre?: {
    reference?: string;
    statut?: 'En préparation' | 'Publié' | 'Clôturé' | 'Attribué';
    datePublication?: string;
    dateCloture?: string;
    prestatairesRepondus?: number;
    prestaireSelectionne?: string;
  };
  evaluation?: {
    methode: 'QCM' | 'Pratique' | 'Mixte';
    seuilReussite: number;
    resultats?: {
      moyenne: number;
      tauxReussite: number;
      feedback: {
        positif: number;
        neutre: number;
        negatif: number;
      };
    };
  };
  supports?: {
    id: number;
    nom: string;
    type: string;
    url: string;
  }[];
}
