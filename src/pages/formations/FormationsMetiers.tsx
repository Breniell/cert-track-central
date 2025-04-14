
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BookOpen, AlertTriangle } from "lucide-react";
import { useState } from "react";

const FormationsMetiers = () => {
  const [formations] = useState([
    {
      id: 1,
      titre: "Formation Excel Avancé",
      statut: "planifié",
      duree: "3 jours",
      participants: 15,
      dateDebut: "2024-05-15",
    },
    {
      id: 2,
      titre: "Leadership et Management",
      statut: "en cours",
      duree: "5 jours",
      participants: 12,
      dateDebut: "2024-04-25",
    },
  ]);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Formations Métiers
            </h1>
            <p className="text-muted-foreground">
              Gestion des formations professionnelles et techniques
            </p>
          </div>
          <Button>Nouvelle formation métier</Button>
        </div>

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Rappel</AlertTitle>
          <AlertDescription>
            2 formations sont prévues pour le mois prochain. Pensez à valider les inscriptions.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formations.map((formation) => (
            <Card key={formation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{formation.titre}</CardTitle>
                  <Badge variant={formation.statut === "en cours" ? "secondary" : "default"}>
                    {formation.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Durée:</dt>
                    <dd className="text-sm font-medium">{formation.duree}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Participants:</dt>
                    <dd className="text-sm font-medium">{formation.participants}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Date de début:</dt>
                    <dd className="text-sm font-medium">{formation.dateDebut}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Détails
                  </Button>
                  <Button size="sm" className="flex-1">
                    S'inscrire
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FormationsMetiers;
