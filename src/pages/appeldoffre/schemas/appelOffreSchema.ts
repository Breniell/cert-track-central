
import { z } from "zod";

// Type for document with required fields matching the service
export type Document = {
  nom: string;
  obligatoire: boolean;
  url?: string;
};

// Schema for appel d'offre form
export const appelOffreSchema = z.object({
  reference: z.string().nonempty("La référence est requise"),
  titre: z.string().nonempty("Le titre est requis"),
  description: z.string().nonempty("La description est requise"),
  typeFormation: z.string().nonempty("Le type de formation est requis"),
  datePublication: z.date(),
  dateCloture: z.date(),
  budgetMaximum: z.number().positive().optional(),
  statut: z.string().default("En préparation"),
  criteres: z.object({
    experience: z.number().min(0, "L'expérience minimale doit être un nombre positif"),
    qualification: z.array(z.string()).nonempty("Au moins une qualification est requise"),
    delai: z.string().nonempty("Le délai est requis"),
    autres: z.array(z.string()).optional().default([]),
  }),
  documents: z.array(
    z.object({
      nom: z.string().nonempty("Le nom du document est requis"),
      obligatoire: z.boolean(),
      url: z.string().optional(),
    })
  ),
  departementDemandeur: z.string().nonempty("Le département demandeur est requis"),
  responsableDemande: z.string().nonempty("Le responsable de la demande est requis"),
});

export type AppelOffreFormData = z.infer<typeof appelOffreSchema>;

// Create a type that correctly represents field array paths with their exact types
export type FieldArrayWithCorrectType = {
  "documents": {
    nom: string;
    obligatoire: boolean;
    url?: string;
  };
  "criteres.qualification": string;
  "criteres.autres": string;
};

// Type for field arrays with proper typing
export type FieldArrayPath = keyof FieldArrayWithCorrectType;
