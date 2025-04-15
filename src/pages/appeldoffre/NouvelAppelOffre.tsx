
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { appelOffreService } from "@/services/appelOffreService";
import { Form } from "@/components/ui/form";
import { InformationsGeneralesStep } from "./components/InformationsGeneralesStep";
import { CriteresStep } from "./components/CriteresStep";
import { DocumentsStep } from "./components/DocumentsStep";
import { appelOffreSchema, type AppelOffreFormData } from "./schemas/appelOffreSchema";
import { cn } from "@/lib/utils";

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

  const form = useForm<AppelOffreFormData>({
    resolver: zodResolver(appelOffreSchema),
    defaultValues,
  });

  const onSubmit = async (data: AppelOffreFormData) => {
    try {
      // Ensure all required fields are present and properly formatted to satisfy the AppelOffre type
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
        documents: data.documents,
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

            {activeStep === 0 && <InformationsGeneralesStep control={form.control} />}
            {activeStep === 1 && <CriteresStep control={form.control} />}
            {activeStep === 2 && <DocumentsStep control={form.control} />}

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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Création en cours..." : "Créer l'appel d'offre"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
