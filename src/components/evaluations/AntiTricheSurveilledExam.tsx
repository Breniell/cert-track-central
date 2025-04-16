
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Clock, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { antiTricheService, ExamSession } from "@/services/antiTricheService";
import { evaluationService } from "@/services/evaluationService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Interfaces
interface Question {
  id: number;
  texte: string;
  type: "QCM" | "Vrai/Faux" | "Texte";
  options?: string[];
  points: number;
  tempsMax?: number; // temps max en secondes par question
}

interface EvaluationProps {
  evaluationId: number;
  userId: number;
  onComplete: (score: number, passed: boolean) => void;
}

export default function AntiTricheSurveilledExam({ evaluationId, userId, onComplete }: EvaluationProps) {
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string | string[] }>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [suspiciousActivity, setSuspiciousActivity] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [examLocked, setExamLocked] = useState(false);

  const examContainerRef = useRef<HTMLDivElement>(null);
  const screenshotInterval = useRef<number | null>(null);
  const navigate = useNavigate();

  // Chargement initial
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'évaluation
        const evaluation = await evaluationService.getEvaluation(evaluationId);
        if (!evaluation) {
          toast({
            title: "Erreur",
            description: "Impossible de charger l'évaluation",
            variant: "destructive",
          });
          return;
        }

        // Démarrer une session d'examen surveillé
        const session = await antiTricheService.startExamSession(userId, evaluationId);
        setExamSession(session);

        // Mélanger et sélectionner les questions aléatoirement
        const shuffledQuestions = [...evaluation.questions]
          .sort(() => Math.random() - 0.5);
        
        setQuestions(shuffledQuestions);
        setTotalTime(evaluation.duree * 60); // Convertir en secondes
        setTimeRemaining(evaluation.duree * 60);
      } catch (error) {
        console.error("Erreur lors du chargement de l'examen:", error);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer l'examen",
          variant: "destructive",
        });
      }
    };

    fetchData();

    // Configurer les écouteurs d'événements pour détecter la triche
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("copy", handleCopyPaste);
    window.addEventListener("paste", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeprint", handlePrintAttempt);

    return () => {
      // Nettoyer les écouteurs
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("copy", handleCopyPaste);
      window.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeprint", handlePrintAttempt);
      
      if (screenshotInterval.current) {
        window.clearInterval(screenshotInterval.current);
      }
    };
  }, [evaluationId, userId]);

  // Gestion du temps
  useEffect(() => {
    if (!examSession || examLocked) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examSession, examLocked]);

  // Capturer des captures d'écran périodiques
  useEffect(() => {
    if (!examSession) return;

    // Simulation de capture d'écran (dans un cas réel, utiliserait une bibliothèque comme html2canvas)
    screenshotInterval.current = window.setInterval(() => {
      if (examSession && !examLocked) {
        console.log("Capture d'écran simulée à", new Date().toISOString());
        // Dans un cas réel: 
        // html2canvas(document.body).then(canvas => {
        //   const screenshotData = canvas.toDataURL();
        //   antiTricheService.logScreenshot(examSession.id, screenshotData);
        // });
      }
    }, 30000); // Toutes les 30 secondes

    return () => {
      if (screenshotInterval.current) {
        window.clearInterval(screenshotInterval.current);
      }
    };
  }, [examSession, examLocked]);

  // Détection de triche
  const handleWindowBlur = async () => {
    if (!examSession) return;
    
    await antiTricheService.logInteraction(examSession.id, {
      eventType: 'blur',
      details: 'L\'utilisateur a quitté la fenêtre d\'examen'
    });
    
    recordSuspiciousActivity("Vous avez quitté la fenêtre d'examen");
  };

  const handleCopyPaste = async (e: Event) => {
    if (!examSession) return;
    
    e.preventDefault();
    
    await antiTricheService.logInteraction(examSession.id, {
      eventType: e.type as 'copy' | 'paste',
      details: `Tentative de ${e.type} détectée`
    });
    
    recordSuspiciousActivity(`Tentative de ${e.type} détectée`);
  };

  const handleVisibilityChange = async () => {
    if (!examSession) return;
    
    if (document.hidden) {
      await antiTricheService.logInteraction(examSession.id, {
        eventType: 'blur',
        details: 'L\'utilisateur a changé d\'onglet ou minimisé la fenêtre'
      });
      
      recordSuspiciousActivity("Vous avez changé d'onglet ou minimisé la fenêtre");
    }
  };

  const handlePrintAttempt = async (e: Event) => {
    if (!examSession) return;
    
    e.preventDefault();
    
    await antiTricheService.logInteraction(examSession.id, {
      eventType: 'print',
      details: 'Tentative d\'impression détectée'
    });
    
    recordSuspiciousActivity("Tentative d'impression détectée");
  };

  const recordSuspiciousActivity = (warning: string) => {
    setWarnings(prev => [...prev, warning]);
    setSuspiciousActivity(prev => {
      const newCount = prev + 1;
      
      // Si trop d'activités suspectes, verrouiller l'examen
      if (newCount >= 5 && !examLocked) {
        lockExam("Trop d'activités suspectes détectées");
      }
      
      return newCount;
    });
  };

  const lockExam = async (reason: string) => {
    setExamLocked(true);
    
    toast({
      title: "Examen verrouillé",
      description: reason,
      variant: "destructive",
    });
    
    if (examSession) {
      await antiTricheService.logInteraction(examSession.id, {
        eventType: 'keydown',
        details: `Examen verrouillé: ${reason}`
      });
    }
  };

  const handleTimeUp = async () => {
    if (!examSession) return;
    
    toast({
      title: "Temps écoulé",
      description: "Le temps imparti pour l'examen est terminé.",
    });
    
    await submitExam();
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (examContainerRef.current?.requestFullscreen) {
        examContainerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitExam = async () => {
    if (!examSession) return;
    
    try {
      // Transformer les réponses au format attendu par l'API
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        reponse: answer
      }));
      
      // Envoyer les réponses
      const result = await evaluationService.submitEvaluation(userId, evaluationId, formattedAnswers);
      
      // Terminer la session d'examen
      await antiTricheService.endExamSession(examSession.id);
      
      // Analyser la session pour détecter des comportements suspects
      const analysis = await antiTricheService.analyzeSession(examSession.id);
      
      // Informer l'utilisateur du résultat
      toast({
        title: result.reussi ? "Évaluation réussie" : "Évaluation échouée",
        description: `Votre score: ${result.score}%`,
        variant: result.reussi ? "default" : "destructive",
      });
      
      // Si suspicieux, générer un rapport pour l'administrateur
      if (analysis.suspiciousScore > 70) {
        await antiTricheService.generateSurveillanceReport(examSession.id);
        console.log("Comportement suspect détecté, rapport généré pour l'administrateur");
      }
      
      // Notifier le composant parent
      onComplete(result.score, result.reussi);
    } catch (error) {
      console.error("Erreur lors de la soumission de l'examen:", error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre l'examen",
        variant: "destructive",
      });
    }
  };

  // Afficher un message de chargement
  if (!examSession || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement de l'examen...</p>
      </div>
    );
  }

  // Obtenir la question actuelle
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] as string || '';

  // Formater le temps restant
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculer la progression
  const progressPercentage = Math.floor((Object.keys(answers).length / questions.length) * 100);

  return (
    <div ref={examContainerRef} className="h-screen max-h-screen overflow-hidden">
      {examLocked ? (
        <div className="flex flex-col items-center justify-center h-full">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Examen verrouillé</h2>
          <p className="text-gray-600 mb-6">Votre examen a été verrouillé en raison d'activités suspectes.</p>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      ) : (
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold">Examen Surveillé</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-yellow-50 text-yellow-800 px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFullScreen}
                className="flex items-center"
              >
                {isFullScreen ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Quitter plein écran
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Plein écran
                  </>
                )}
              </Button>
            </div>
          </div>

          {suspiciousActivity > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Avertissement</AlertTitle>
              <AlertDescription>
                Activités suspectes détectées ({suspiciousActivity}/5). 
                L'examen sera verrouillé après 5 avertissements.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Question {currentQuestionIndex + 1}/{questions.length}</CardTitle>
                  <CardDescription>
                    {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-md">
                  <Lock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Mode sécurisé</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{currentQuestion.texte}</h3>
                
                {currentQuestion.type === "QCM" && currentQuestion.options && (
                  <RadioGroup 
                    value={currentAnswer} 
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
                
                {currentQuestion.type === "Vrai/Faux" && (
                  <RadioGroup 
                    value={currentAnswer} 
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Vrai" id="option-vrai" />
                        <Label htmlFor="option-vrai">Vrai</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Faux" id="option-faux" />
                        <Label htmlFor="option-faux">Faux</Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={moveToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </Button>
              <Button 
                onClick={moveToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1 || !currentAnswer}
              >
                Suivant
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Progression</p>
                <p className="font-medium">{Object.keys(answers).length}/{questions.length} questions répondues</p>
              </div>
              <Button 
                onClick={submitExam}
                disabled={Object.keys(answers).length < questions.length}
              >
                Terminer l'examen
              </Button>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <p className="text-xs text-gray-500 italic">
              Votre session est surveillée. Toute tentative de triche sera détectée et pourra 
              entraîner le verrouillage de l'examen. Restez sur cette fenêtre jusqu'à la fin de l'examen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
