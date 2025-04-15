
import { Control } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppelOffreFormData } from "../schemas/appelOffreSchema";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useFieldArray } from "react-hook-form";

interface CriteresStepProps {
  control: Control<AppelOffreFormData>;
}

export function CriteresStep({ control }: CriteresStepProps) {
  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } = 
    useFieldArray({
      control,
      name: "criteres.qualification",
    });

  const { fields: autresFields, append: appendAutre, remove: removeAutre } = 
    useFieldArray({
      control,
      name: "criteres.autres",
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Critères</CardTitle>
        <CardDescription>Définissez les critères de sélection des prestataires</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="criteres.experience"
          render={({ field }) => (
            <FormItem>
              <Label>Expérience minimale (années)</Label>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>Qualifications requises</Label>
          {qualificationFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={control}
                name={`criteres.qualification.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Qualification requise" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeQualification(index)}
                disabled={qualificationFields.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
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

        <FormField
          control={control}
          name="criteres.delai"
          render={({ field }) => (
            <FormItem>
              <Label>Délai d'exécution</Label>
              <FormControl>
                <Input {...field} placeholder="Ex: 2 semaines, 1 mois" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>Autres critères (facultatif)</Label>
          {autresFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={control}
                name={`criteres.autres.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Autre critère" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
  );
}

