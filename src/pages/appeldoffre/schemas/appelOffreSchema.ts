
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
    autres: z.array(z.string()).optional(),
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

// Add a type definition to make useFieldArray work correctly with nested fields
// This helps TypeScript understand the structure of our form
export type NestedKeyOf<ObjectType extends object> = 
  {[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object 
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (string | number)];
