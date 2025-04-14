
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { evaluationService } from "@/services/evaluationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EvaluationFormProps {
  evaluationId: number;
  participantId: number;
  onComplete?: () => void;
}

export default function EvaluationForm({ evaluationId, participantId, onComplete }: EvaluationFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string | string[]}>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: evaluation, isLoading, error } = useQuery({
    queryKey: ["evaluation", evaluationId],
    queryFn: () => evaluationService.getEvaluation(evaluationId),
    onSuccess: (data) => {
      if (data) {
        // Initialiser le timer
        setTimeLeft(data.duree * 60);
      }
    }
  });

  const submitEvaluationMutation = useMutation({
    mutationFn: () => {
      const reponses = Object.keys(answers).map(questionId => ({
        questionId: parseInt(questionId),
        reponse: answers[parseInt(questionId)]
      }));
      
      return evaluationService.submitEvaluation(participantId, evaluationId, reponses);
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      
      toast({
        title: data.reussi ? "Évaluation réussie" : "Évaluation non réussie",
        description: `Votre score est de ${data.score}%. ${data.reussi ? "Félicitations!" : ""}`,
        variant: data.reussi ? "default" : "destructive"
      });
      
      if (onComplete) {
        onComplete();
      }
    },
    onError: () => {
      setIsSubmitting(false);
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de l'évaluation.",
        variant: "destructive"
      });
    }
  });

  // Gestion du timer
  useState(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === null || prevTime <= 1) {
            clearInterval(timer);
            
            // Si le temps est écoulé, soumettre automatiquement
            if (!isSubmitting) {
              handleSubmit();
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  });

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (evaluation && currentQuestion < evaluation.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (evaluation) {
      // Vérifier si toutes les questions ont une réponse
      const answeredQuestions = Object.keys(answers).length;
      
      if (answeredQuestions < evaluation.questions.length) {
        const confirmation = window.confirm(`Vous n'avez répondu qu'à ${answeredQuestions} question(s) sur ${evaluation.questions.length}. Voulez-vous vraiment soumettre l'évaluation ?`);
        
        if (!confirmation) {
          return;
        }
      }
      
      setIsSubmitting(true);
      submitEvaluationMutation.mutate();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement de l'évaluation...</div>;
  }

  if (error || !evaluation) {
    return <div className="p-8 text-center text-red-500">Erreur lors du chargement de l'évaluation.</div>;
  }

  const currentQuestionData = evaluation.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / evaluation.questions.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{evaluation.titre}</CardTitle>
              <CardDescription>{evaluation.description}</CardDescription>
            </div>
            {timeLeft !== null && (
              <div className={`flex items-center ${timeLeft < 60 ? 'text-red-500' : 'text-gray-500'}`}>
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Question {currentQuestion + 1} sur {evaluation.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {currentQuestionData.texte}
              </h3>
              
              {currentQuestionData.type === 'QCM' && currentQuestionData.options && (
                <RadioGroup
                  value={answers[currentQuestionData.id] as string || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                >
                  <div className="space-y-3">
                    {currentQuestionData.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${option}`} />
                        <Label htmlFor={`option-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
              
              {currentQuestionData.type === 'Vrai/Faux' && currentQuestionData.options && (
                <RadioGroup
                  value={answers[currentQuestionData.id] as string || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                >
                  <div className="space-y-3">
                    {currentQuestionData.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${option}`} />
                        <Label htmlFor={`option-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
              
              {currentQuestionData.type === 'Texte' && (
                <Textarea 
                  placeholder="Saisissez votre réponse ici..."
                  value={(answers[currentQuestionData.id] as string) || ""}
                  onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0 || isSubmitting}
          >
            Précédent
          </Button>
          
          <div className="flex gap-2">
            {currentQuestion < evaluation.questions.length - 1 ? (
              <Button 
                onClick={handleNextQuestion}
                disabled={isSubmitting}
              >
                Suivant
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Terminer l'évaluation
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {timeLeft !== null && timeLeft < 60 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Temps limité!</h4>
            <p className="text-sm text-red-700">Il vous reste moins d'une minute pour terminer l'évaluation.</p>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-800">Conseils pour réussir</h4>
          <ul className="text-sm text-blue-700 list-disc list-inside">
            <li>Lisez attentivement chaque question</li>
            <li>Vous pouvez naviguer entre les questions et modifier vos réponses avant de soumettre</li>
            <li>Surveillez le temps restant pour vous assurer de répondre à toutes les questions</li>
            <li>Le seuil de réussite est de {evaluation.seuilReussite}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
