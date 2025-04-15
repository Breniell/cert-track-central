
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { appelOffreService } from "@/services/appelOffreService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { FileText, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Type for document with required fields matching the service
type Document = {
  nom: string;
  obligatoire: boolean;
  url?: string;
};

// Schéma de validation pour l'appel d'offre
const appelOffreSchema = z.object({
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

type AppelOffreFormData = z.infer<typeof appelOffreSchema>;

export default function NouvelAppelOffre() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Informations générales", "Critères", "Documents"];

  const defaultValues: AppelOffreFormData = {
    reference: `AO-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    titre: "",
    description: "",
    typeFormation: "",
    datePublication: new Date(),
    dateCloture: new Date(new Date().setDate(new Date().getDate() + 14)),
    budgetMaximum: undefined,
    statut: "En préparation",
    criteres: {
      experience: 0,
      qualification: [""],
      delai: "",
      autres: [],
    },
    documents: [
      {
        nom: "Cahier des charges",
        obligatoire: true,
        url: "",
      }
    ],
    departementDemandeur: "",
    responsableDemande: "",
  };

  const { 
    control, 
    handleSubmit, 
    watch,
    register,
    formState: { errors, isSubmitting } 
  } = useForm<AppelOffreFormData>({
    resolver: zodResolver(appelOffreSchema),
    defaultValues,
  });

  // Setting up field arrays for documents
  const { fields: documentFields, append: appendDocument, remove: removeDocument } = 
    useFieldArray({
      control,
      name: "documents",
    });

  // Setting up field arrays for qualifications
  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } = 
    useFieldArray({
      control,
      name: "criteres.qualification",
    });

  // Setting up field arrays for other criteria
  const { fields: autresFields, append: appendAutre, remove: removeAutre } = 
    useFieldArray({
      control,
      name: "criteres.autres",
    });

  const onSubmit = async (data: AppelOffreFormData) => {
    try {
      // Ensure all required fields are defined and properly typed
      const formattedData = {
        reference: data.reference,
        titre: data.titre,
        description: data.description,
        typeFormation: data.typeFormation,
        datePublication: format(data.datePublication, 'yyyy-MM-dd'),
        dateCloture: format(data.dateCloture, 'yyyy-MM-dd'),
        budgetMaximum: data.budgetMaximum || 0,
        statut: "En préparation" as const,
        criteres: {
          experience: data.criteres.experience,
          qualification: data.criteres.qualification,
          delai: data.criteres.delai,
          autres: data.criteres.autres || [],
        },
        // Ensure documents meet the required structure
        documents: data.documents.map(doc => ({
          nom: doc.nom,  // Required field
          obligatoire: doc.obligatoire,  // Required field
          url: doc.url || "",  // Optional field
        })),
        departementDemandeur: data.departementDemandeur,
        responsableDemande: data.responsableDemande,
      };
      
      await appelOffreService.createAppelOffre(formattedData);
      
      toast({
        title: "Appel d'offre créé",
        description: "L'appel d'offre a été créé avec succès",
      });
      
      navigate("/appels-offre");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'appel d'offre",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Nouvel appel d'offre</h1>
            <p className="text-muted-foreground">Créez un nouvel appel d'offre pour une formation</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/appels-offre")}>Annuler</Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex-1 text-center py-2 border-b-2",
                    activeStep === index 
                      ? "border-primary text-primary font-medium" 
                      : "border-muted text-muted-foreground"
                  )}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {activeStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Informations de base sur l'appel d'offre</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Référence</Label>
                    <Input
                      id="reference"
                      {...register("reference")}
                    />
                    {errors.reference && (
                      <p className="text-sm text-destructive">{errors.reference.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="typeFormation">Type de formation</Label>
                    <Input
                      id="typeFormation"
                      {...register("typeFormation")}
                      placeholder="HSE, Métier, Management, etc."
                    />
                    {errors.typeFormation && (
                      <p className="text-sm text-destructive">{errors.typeFormation.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre</Label>
                  <Input
                    id="titre"
                    {...register("titre")}
                    placeholder="Titre de l'appel d'offre"
                  />
                  {errors.titre && (
                    <p className="text-sm text-destructive">{errors.titre.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Description détaillée de l'appel d'offre"
                    rows={5}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date de publication</Label>
                    <Controller
                      control={control}
                      name="datePublication"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.datePublication && (
                      <p className="text-sm text-destructive">{errors.datePublication.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date de clôture</Label>
                    <Controller
                      control={control}
                      name="dateCloture"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.dateCloture && (
                      <p className="text-sm text-destructive">{errors.dateCloture.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budgetMaximum">Budget maximum (FCFA)</Label>
                  <Controller
                    control={control}
                    name="budgetMaximum"
                    render={({ field }) => (
                      <Input
                        id="budgetMaximum"
                        type="number"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value || ""}
                        placeholder="Budget maximum en FCFA"
                      />
                    )}
                  />
                  {errors.budgetMaximum && (
                    <p className="text-sm text-destructive">{errors.budgetMaximum.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="departementDemandeur">Département demandeur</Label>
                    <Input
                      id="departementDemandeur"
                      {...register("departementDemandeur")}
                      placeholder="Département demandeur"
                    />
                    {errors.departementDemandeur && (
                      <p className="text-sm text-destructive">{errors.departementDemandeur.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsableDemande">Responsable de la demande</Label>
                    <Input
                      id="responsableDemande"
                      {...register("responsableDemande")}
                      placeholder="Nom du responsable"
                    />
                    {errors.responsableDemande && (
                      <p className="text-sm text-destructive">{errors.responsableDemande.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Critères</CardTitle>
                <CardDescription>Définissez les critères de sélection des prestataires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="experience">Expérience minimale (années)</Label>
                  <Controller
                    control={control}
                    name="criteres.experience"
                    render={({ field }) => (
                      <Input
                        id="experience"
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                      />
                    )}
                  />
                  {errors.criteres?.experience && (
                    <p className="text-sm text-destructive">{errors.criteres.experience.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Qualifications requises</Label>
                  {qualificationFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        {...register(`criteres.qualification.${index}`)}
                        placeholder="Qualification requise"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (qualificationFields.length > 1) {
                            removeQualification(index);
                          }
                        }}
                        disabled={qualificationFields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {errors.criteres?.qualification && (
                    <p className="text-sm text-destructive">{errors.criteres.qualification.message}</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendQualification("")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une qualification
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delai">Délai d'exécution</Label>
                  <Input
                    id="delai"
                    {...register("criteres.delai")}
                    placeholder="Ex: 2 semaines, 1 mois"
                  />
                  {errors.criteres?.delai && (
                    <p className="text-sm text-destructive">{errors.criteres.delai.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Autres critères (facultatif)</Label>
                  {autresFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        {...register(`criteres.autres.${index}`)}
                        placeholder="Autre critère"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAutre(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendAutre("")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un autre critère
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Définissez les documents requis pour répondre à l'appel d'offre</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Document {index + 1}</h3>
                      </div>
                      {documentFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDocument(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`documents.${index}.nom`}>Nom du document</Label>
                        <Input
                          id={`documents.${index}.nom`}
                          {...register(`documents.${index}.nom` as const)}
                          placeholder="Nom du document"
                        />
                        {errors.documents?.[index]?.nom && (
                          <p className="text-sm text-destructive">{errors.documents[index].nom.message}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Controller
                          control={control}
                          name={`documents.${index}.obligatoire` as const}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              id={`documents.${index}.obligatoire`}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          )}
                        />
                        <Label htmlFor={`documents.${index}.obligatoire`}>Document obligatoire</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`documents.${index}.url`}>URL (facultatif)</Label>
                        <Input
                          id={`documents.${index}.url`}
                          {...register(`documents.${index}.url` as const)}
                          placeholder="URL du document"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendDocument({ nom: "", obligatoire: false, url: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un document
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={activeStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création en cours..." : "Créer l'appel d'offre"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
