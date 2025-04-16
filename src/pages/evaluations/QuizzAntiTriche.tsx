
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, Lock, ShieldAlert } from "lucide-react";
import AntiTricheSurveilledExam from "@/components/evaluations/AntiTricheSurveilledExam";
import { useAuth } from "@/contexts/AuthContext";

export default function QuizzAntiTriche() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean } | null>(null);

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleExamComplete = (score: number, passed: boolean) => {
    setExamCompleted(true);
    setExamStarted(false);
    setExamResult({ score, passed });
  };

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Accès non autorisé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p>Vous devez être connecté pour accéder à cette évaluation.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/login')}>Se connecter</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (examStarted) {
    return (
      <AntiTricheSurveilledExam 
        evaluationId={parseInt(id || '0')} 
        userId={user.id} 
        onComplete={handleExamComplete}
      />
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {examCompleted ? (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {examResult?.passed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <CardTitle>
                {examResult?.passed ? "Évaluation réussie" : "Évaluation échouée"}
              </CardTitle>
              <CardDescription>
                Votre score: {examResult?.score}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="mb-4">
                  {examResult?.passed 
                    ? "Félicitations ! Vous avez réussi cette évaluation." 
                    : "Vous n'avez pas atteint le score minimum requis pour cette évaluation."}
                </p>
                <Button onClick={() => navigate('/personnel/formations')}>
                  Retour aux formations
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <ShieldAlert className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-center">Évaluation surveillée</CardTitle>
              <CardDescription className="text-center">
                Cette évaluation est surveillée et comprend des mesures anti-triche.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="flex items-center text-yellow-800 font-medium mb-2">
                  <Info className="h-5 w-5 mr-2" />
                  Instructions importantes
                </h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Assurez-vous d'être dans un environnement calme et sans distraction.</li>
                  <li>• Fermez toutes les autres applications et onglets de votre navigateur.</li>
                  <li>• N'utilisez pas la fonction copier-coller pendant l'examen.</li>
                  <li>• Ne quittez pas la fenêtre d'examen avant d'avoir terminé.</li>
                  <li>• Interdiction de prendre des captures d'écran ou d'imprimer les questions.</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="flex items-center text-blue-800 font-medium mb-2">
                  <Lock className="h-5 w-5 mr-2" />
                  Système de surveillance
                </h3>
                <p className="text-sm text-blue-700">
                  Cet examen est équipé d'un système de surveillance automatisé qui détecte 
                  les comportements suspects. Toute tentative de triche pourra entraîner le 
                  verrouillage de l'examen et des sanctions administratives.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleStartExam}>
                Commencer l'évaluation
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
