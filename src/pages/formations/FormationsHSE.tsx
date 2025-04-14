
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const FormationsHSE = () => {
  const [formations] = useState([
    {
      id: 1,
      titre: "Sécurité sur site industriel",
      statut: "urgent",
      validite: "1 an",
      participants: 25,
      dateProchaine: "2024-05-01",
    },
    {
      id: 2,
      titre: "Manipulation produits dangereux",
      statut: "planifié",
      validite: "2 ans",
      participants: 15,
      dateProchaine: "2024-04-20",
    },
  ]);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Formations HSE
            </h1>
            <p className="text-muted-foreground">
              Gestion des formations santé, sécurité et environnement
            </p>
          </div>
          <Button>Nouvelle formation HSE</Button>
        </div>

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            3 formations nécessitent un renouvellement dans les 30 prochains jours.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formations.map((formation) => (
            <Card key={formation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{formation.titre}</CardTitle>
                  <Badge variant={formation.statut === "urgent" ? "destructive" : "default"}>
                    {formation.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Validité:</dt>
                    <dd className="text-sm font-medium">{formation.validite}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Participants:</dt>
                    <dd className="text-sm font-medium">{formation.participants}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Prochaine session:</dt>
                    <dd className="text-sm font-medium">{formation.dateProchaine}</dd>
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

export default FormationsHSE;
