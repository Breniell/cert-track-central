
import { Control } from "react-hook-form";
import { Plus, Trash2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppelOffreFormData } from "../schemas/appelOffreSchema";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useFieldArray } from "react-hook-form";

interface DocumentsStepProps {
  control: Control<AppelOffreFormData>;
}

export function DocumentsStep({ control }: DocumentsStepProps) {
  const { fields: documentFields, append: appendDocument, remove: removeDocument } = 
    useFieldArray({
      control,
      name: "documents",
    });

  return (
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
              <FormField
                control={control}
                name={`documents.${index}.nom`}
                render={({ field }) => (
                  <FormItem>
                    <Label>Nom du document</Label>
                    <FormControl>
                      <Input {...field} placeholder="Nom du document" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`documents.${index}.obligatoire`}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        id={`documents.${index}.obligatoire`}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`documents.${index}.obligatoire`}>Document obligatoire</Label>
                    </div>
                  )}
                />
              </div>
              
              <FormField
                control={control}
                name={`documents.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <Label>URL (facultatif)</Label>
                    <FormControl>
                      <Input {...field} placeholder="URL du document" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
  );
}

