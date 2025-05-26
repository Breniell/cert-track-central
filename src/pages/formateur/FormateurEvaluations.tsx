
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ClipboardCheck, Eye, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const FormateurEvaluations = () => {
  const [activeTab, setActiveTab] = useState("en-cours");
  const { toast } = useToast();
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);

  const handleCreateEvaluation = () => {
    setIsCreatingEvaluation(true);
  };

  const handleEvaluationSubmit = () => {
    setIsCreatingEvaluation(false);
    toast({
      title: "Évaluation créée",
      description: "L'évaluation a été enregistrée avec succès.",
    });
  };

  const evaluations = [
    {
      id: 1,
      titre: "Évaluation sécurité en hauteur",
      formation: "Sécurité en hauteur",
      date: "15/03/2024",
      participants: 12,
      statut: "En cours",
    },
    {
      id: 2,
      titre: "Test produits chimiques",
      formation: "Manipulation des produits chimiques",
      date: "18/03/2024",
      participants: 6,
      statut: "Terminée",
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6" />
              Évaluations
            </h1>
            <p className="text-muted-foreground">Gérez les évaluations de vos formations</p>
          </div>
          <Button onClick={handleCreateEvaluation}>
            <Plus className="h-4 w-4 mr-2" />
            Créer une évaluation
          </Button>
        </div>

        {isCreatingEvaluation ? (
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle évaluation</CardTitle>
              <CardDescription>Créez une nouvelle évaluation pour une formation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de l'évaluation</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Ex: Évaluation sécurité en hauteur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Formation associée</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Sélectionner une formation</option>
                    <option>Sécurité en hauteur</option>
                    <option>Manipulation des produits chimiques</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleEvaluationSubmit}>Créer l'évaluation</Button>
                  <Button variant="outline" onClick={() => setIsCreatingEvaluation(false)}>Annuler</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="en-cours" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="en-cours">En cours</TabsTrigger>
              <TabsTrigger value="terminees">Terminées</TabsTrigger>
              <TabsTrigger value="toutes">Toutes</TabsTrigger>
            </TabsList>
            <TabsContent value="en-cours">
              <div className="grid grid-cols-1 gap-4">
                {evaluations
                  .filter((evaluation) => evaluation.statut === "En cours")
                  .map((evaluation) => (
                    <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="terminees">
              <div className="grid grid-cols-1 gap-4">
                {evaluations
                  .filter((evaluation) => evaluation.statut === "Terminée")
                  .map((evaluation) => (
                    <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="toutes">
              <div className="grid grid-cols-1 gap-4">
                {evaluations.map((evaluation) => (
                  <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

const EvaluationCard = ({ evaluation }: { evaluation: any }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{evaluation.titre}</CardTitle>
        <CardDescription>Formation: {evaluation.formation}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm">{evaluation.date}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Participants</p>
            <p className="text-sm">{evaluation.participants}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Statut</p>
            <p className="text-sm">{evaluation.statut}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Voir les résultats
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FormateurEvaluations;
