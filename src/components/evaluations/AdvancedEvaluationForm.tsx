
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, Timer, Shield, Eye, RotateCw } from "lucide-react";
import { evaluationService } from "@/services/evaluationService";

interface Question {
  id: number;
  texte: string;
  type: 'QCM' | 'Vrai/Faux' | 'Texte';
  options?: string[];
  points: number;
}

interface AdvancedEvaluationFormProps {
  evaluationId: number;
  formationId: number;
  participantId: number;
  onComplete: (score: number, passed: boolean) => void;
}

export function AdvancedEvaluationForm({
  evaluationId,
  formationId,
  participantId,
  onComplete
}: AdvancedEvaluationFormProps) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(30); // 30 secondes par question
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationTitle, setEvaluationTitle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowFocused, setWindowFocused] = useState(true);
  const [antiCheatWarnings, setAntiCheatWarnings] = useState(0);
  const [randomizedQuestions, setRandomizedQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Schéma de validation dynamique pour la question courante
  const createQuestionSchema = (question: Question) => {
    if (question.type === 'QCM' && question.options) {
      return z.object({
        [`question_${question.id}`]: z.string({ required_error: "Veuillez sélectionner une réponse" })
      });
    } else if (question.type === 'Vrai/Faux') {
      return z.object({
        [`question_${question.id}`]: z.enum(['Vrai', 'Faux'], { required_error: "Veuillez sélectionner une réponse" })
      });
    } else {
      return z.object({
        [`question_${question.id}`]: z.string({ required_error: "Veuillez entrer une réponse" })
          .min(1, "La réponse ne peut pas être vide")
      });
    }
  };

  // Créer le formulaire avec react-hook-form
  const form = useForm<any>({
    resolver: zodResolver(questions[currentQuestionIndex] ? createQuestionSchema(questions[currentQuestionIndex]) : z.object({})),
    defaultValues: {}
  });

  // Charger les questions de l'évaluation
  useEffect(() => {
    const loadEvaluation = async () => {
      setIsLoading(true);
      try {
        const evaluation = await evaluationService.getEvaluation(evaluationId);
        if (evaluation) {
          setEvaluationTitle(evaluation.titre);
          
          // Randomiser l'ordre des questions pour l'anti-triche
          const shuffledQuestions = [...evaluation.questions].sort(() => Math.random() - 0.5);
          setRandomizedQuestions(shuffledQuestions);
          setQuestions(shuffledQuestions);
          setTotalQuestions(shuffledQuestions.length);
          
          // Initialiser le timer global
          setTimeLeft(evaluation.duree * 60); // Conversion minutes -> secondes
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'évaluation. Veuillez réessayer."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluation();
  }, [evaluationId, toast]);

  // Gestion du timer global
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  // Gestion du timer par question
  useEffect(() => {
    if (questionTimeLeft <= 0 || isSubmitting) return;

    const questionTimer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(questionTimer);
          // Passer automatiquement à la question suivante si le temps est écoulé
          if (currentQuestionIndex < questions.length - 1) {
            handleNextQuestion();
          } else {
            handleSubmitEvaluation();
          }
          return 30; // Réinitialiser à 30 secondes pour la prochaine question
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(questionTimer);
  }, [questionTimeLeft, currentQuestionIndex, isSubmitting, questions.length]);

  // Détection de changement de focus pour l'anti-triche
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // L'utilisateur a changé d'onglet ou minimisé la fenêtre
        setWindowFocused(false);
        handleAntiCheatViolation("Changement d'onglet détecté");
      } else {
        setWindowFocused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Gestionnaire pour quand le temps global est écoulé
  const handleTimeUp = () => {
    toast({
      variant: "destructive",
      title: "Temps écoulé !",
      description: "Le temps imparti pour l'évaluation est terminé. Vos réponses vont être soumises automatiquement."
    });
    handleSubmitEvaluation();
  };

  // Gestionnaire pour passer à la question suivante
  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const fieldName = `question_${currentQuestion.id}`;
    
    // Vérifier si la question actuelle a été répondue
    if (!form.getValues(fieldName)) {
      // Si pas de réponse, enregistrer une réponse vide
      form.setValue(fieldName, currentQuestion.type === 'Vrai/Faux' ? 'Faux' : '');
    }

    // Passer à la question suivante
    setCurrentQuestionIndex(prev => prev + 1);
    setQuestionTimeLeft(30); // Réinitialiser le timer de question
  };

  // Gestionnaire pour soumettre l'évaluation
  const handleSubmitEvaluation = async () => {
    setIsSubmitting(true);
    
    try {
      // Préparer les réponses au format attendu par l'API
      const formValues = form.getValues();
      const reponses = questions.map(question => ({
        questionId: question.id,
        reponse: formValues[`question_${question.id}`] || ''
      }));

      // Soumettre les réponses
      const result = await evaluationService.submitEvaluation(participantId, evaluationId, reponses);
      
      // Notifier l'utilisateur et propager le résultat au composant parent
      toast({
        title: result.reussi ? "Évaluation réussie" : "Évaluation terminée",
        description: `Votre score est de ${result.score}%. ${result.reussi ? "Félicitations !" : ""}`,
        variant: result.reussi ? "default" : "destructive"
      });
      
      onComplete(result.score, result.reussi);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de l'évaluation. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
      exitFullscreen();
    }
  };

  // Gestionnaire pour violation des règles anti-triche
  const handleAntiCheatViolation = (reason: string) => {
    setAntiCheatWarnings(prev => {
      const newCount = prev + 1;
      
      toast({
        variant: "destructive",
        title: `Alerte de sécurité (${newCount}/3)`,
        description: `${reason}. Attention : vous risquez d'être disqualifié.`
      });
      
      // Si trop de violations, soumettre automatiquement
      if (newCount >= 3) {
        toast({
          variant: "destructive",
          title: "Évaluation terminée",
          description: "Trop de violations des règles de sécurité détectées."
        });
        handleSubmitEvaluation();
      }
      
      return newCount;
    });
  };

  // Entrer/Sortir du mode plein écran
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen && isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Formatage du temps restant
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Si chargement en cours
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5 animate-spin" />
            Chargement de l'évaluation
          </CardTitle>
          <CardDescription>Préparation des questions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Progress value={30} className="w-1/2" />
        </CardContent>
      </Card>
    );
  }

  // Si pas de questions chargées
  if (questions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Erreur de chargement
          </CardTitle>
          <CardDescription>Impossible de charger les questions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6">Aucune question n'a été trouvée pour cette évaluation.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full">
            Réessayer
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Composant principal d'évaluation
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle>{evaluationTitle}</CardTitle>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleFullscreen}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            </Button>
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              <Timer className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        <CardDescription>
          Question {currentQuestionIndex + 1} sur {totalQuestions} • Temps restant pour cette question: {formatTime(questionTimeLeft)}
        </CardDescription>
        <Progress value={(currentQuestionIndex / totalQuestions) * 100} className="w-full" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            <div className="space-y-6">
              {questions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">
                      {questions[currentQuestionIndex].texte}
                    </FormLabel>
                    
                    {questions[currentQuestionIndex].type === 'QCM' && questions[currentQuestionIndex].options && (
                      <FormField
                        control={form.control}
                        name={`question_${questions[currentQuestionIndex].id}`}
                        render={({ field }) => (
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              {questions[currentQuestionIndex].options!.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option} id={`option-${index}`} />
                                  <label htmlFor={`option-${index}`} className="text-sm font-medium cursor-pointer">
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        )}
                      />
                    )}
                    
                    {questions[currentQuestionIndex].type === 'Vrai/Faux' && (
                      <FormField
                        control={form.control}
                        name={`question_${questions[currentQuestionIndex].id}`}
                        render={({ field }) => (
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Vrai" id="vrai" />
                                <label htmlFor="vrai" className="text-sm font-medium cursor-pointer">
                                  Vrai
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Faux" id="faux" />
                                <label htmlFor="faux" className="text-sm font-medium cursor-pointer">
                                  Faux
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        )}
                      />
                    )}
                    
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-xs text-gray-500">Surveillance anti-triche active</span>
        </div>
        <div>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNextQuestion} disabled={isSubmitting}>
              Question suivante
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitEvaluation} 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? "Soumission..." : "Terminer l'évaluation"}
              <CheckCircle className={`h-4 w-4 ${isSubmitting ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
