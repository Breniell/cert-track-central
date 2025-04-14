
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";

const FormateursListe = () => {
  const [formateurs] = useState([
    {
      id: 1,
      nom: "Jean Dupont",
      specialite: "HSE",
      experience: "8 ans",
      rating: 4.8,
      status: "disponible",
    },
    {
      id: 2,
      nom: "Marie Martin",
      specialite: "Excel & BI",
      experience: "5 ans",
      rating: 4.5,
      status: "en formation",
    },
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {formateurs.map((formateur) => (
        <Card key={formateur.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>{formateur.nom}</CardTitle>
              <Badge variant={formateur.status === "disponible" ? "success" : "secondary"}>
                {formateur.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Spécialité:</span>
                <span className="font-medium">{formateur.specialite}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expérience:</span>
                <span className="font-medium">{formateur.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Évaluation:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium">{formateur.rating}/5</span>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Voir le profil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormateursListe;
