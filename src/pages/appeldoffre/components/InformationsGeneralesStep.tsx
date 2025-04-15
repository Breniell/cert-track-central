
import { Control, useFormState } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AppelOffreFormData } from "../schemas/appelOffreSchema";
import { FormField, FormItem, Form, FormControl, FormMessage } from "@/components/ui/form";

interface InformationsGeneralesStepProps {
  control: Control<AppelOffreFormData>;
}

export function InformationsGeneralesStep({ control }: InformationsGeneralesStepProps) {
  const { errors } = useFormState({ control });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
        <CardDescription>Informations de base sur l'appel d'offre</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <Label>Référence</Label>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="typeFormation"
            render={({ field }) => (
              <FormItem>
                <Label>Type de formation</Label>
                <FormControl>
                  <Input {...field} placeholder="HSE, Métier, Management, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="titre"
          render={({ field }) => (
            <FormItem>
              <Label>Titre</Label>
              <FormControl>
                <Input {...field} placeholder="Titre de l'appel d'offre" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <FormControl>
                <Textarea {...field} placeholder="Description détaillée de l'appel d'offre" rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="datePublication"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Label>Date de publication</Label>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="dateCloture"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Label>Date de clôture</Label>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="budgetMaximum"
          render={({ field }) => (
            <FormItem>
              <Label>Budget maximum (FCFA)</Label>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Budget maximum en FCFA"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="departementDemandeur"
            render={({ field }) => (
              <FormItem>
                <Label>Département demandeur</Label>
                <FormControl>
                  <Input {...field} placeholder="Département demandeur" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="responsableDemande"
            render={({ field }) => (
              <FormItem>
                <Label>Responsable de la demande</Label>
                <FormControl>
                  <Input {...field} placeholder="Nom du responsable" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

