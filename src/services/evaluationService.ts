
interface Question {
  id: number;
  texte: string;
  type: 'QCM' | 'Vrai/Faux' | 'Texte';
  options?: string[];
  reponseCorrecte?: string | string[];
  points: number;
}

interface Evaluation {
  id: number;
  formationId: number;
  titre: string;
  description?: string;
  questions: Question[];
  duree: number; // en minutes
  seuilReussite: number; // pourcentage
}

interface ResultatEvaluation {
  id: number;
  evaluationId: number;
  participantId: number;
  datePassage: string;
  score: number;
  reussi: boolean;
  reponses: {
    questionId: number;
    reponse: string | string[];
    correcte: boolean;
    points: number;
  }[];
  commentaire?: string;
}

// Simule une base de données pour les évaluations
let evaluationsData: Evaluation[] = [
  {
    id: 1,
    formationId: 1,
    titre: "Évaluation de sécurité en hauteur",
    description: "Ce test évalue vos connaissances sur les procédures de sécurité pour le travail en hauteur",
    questions: [
      {
        id: 1,
        texte: "Quelle est la hauteur minimale à partir de laquelle un harnais est obligatoire?",
        type: "QCM",
        options: ["1 mètre", "2 mètres", "3 mètres", "5 mètres"],
        reponseCorrecte: "2 mètres",
        points: 2
      },
      {
        id: 2,
        texte: "Un point d'ancrage doit pouvoir supporter au minimum :",
        type: "QCM",
        options: ["100 kg", "300 kg", "500 kg", "1000 kg"],
        reponseCorrecte: "1000 kg",
        points: 2
      },
      {
        id: 3,
        texte: "Il est permis de travailler seul en hauteur si on est correctement équipé.",
        type: "Vrai/Faux",
        options: ["Vrai", "Faux"],
        reponseCorrecte: "Faux",
        points: 1
      }
    ],
    duree: 15,
    seuilReussite: 70
  }
];

// Simule une base de données pour les résultats d'évaluation
let resultatsData: ResultatEvaluation[] = [
  {
    id: 1,
    evaluationId: 1,
    participantId: 1,
    datePassage: "2024-03-15",
    score: 80,
    reussi: true,
    reponses: [
      {
        questionId: 1,
        reponse: "2 mètres",
        correcte: true,
        points: 2
      },
      {
        questionId: 2,
        reponse: "500 kg",
        correcte: false,
        points: 0
      },
      {
        questionId: 3,
        reponse: "Faux",
        correcte: true,
        points: 1
      }
    ]
  }
];

export const evaluationService = {
  // Récupérer les évaluations pour une formation
  getEvaluationsByFormation: async (formationId: number): Promise<Evaluation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const evaluations = evaluationsData.filter(e => e.formationId === formationId);
        resolve(evaluations);
      }, 300);
    });
  },
  
  // Récupérer une évaluation spécifique
  getEvaluation: async (evaluationId: number): Promise<Evaluation | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const evaluation = evaluationsData.find(e => e.id === evaluationId);
        resolve(evaluation);
      }, 300);
    });
  },
  
  // Soumettre une réponse d'évaluation
  submitEvaluation: async (participantId: number, evaluationId: number, reponses: {questionId: number, reponse: string | string[]}[]): Promise<ResultatEvaluation> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const evaluation = evaluationsData.find(e => e.id === evaluationId);
        if (!evaluation) throw new Error("Évaluation non trouvée");
        
        // Calcul du score (dans un cas réel, vérifierait les réponses par rapport aux bonnes réponses)
        const reponsesEvaluees = reponses.map(rep => {
          const question = evaluation.questions.find(q => q.id === rep.questionId);
          if (!question) throw new Error("Question non trouvée");
          
          const correcte = Array.isArray(question.reponseCorrecte) 
            ? question.reponseCorrecte.includes(rep.reponse as string)
            : question.reponseCorrecte === rep.reponse;
          
          return {
            questionId: rep.questionId,
            reponse: rep.reponse,
            correcte: correcte,
            points: correcte ? question.points : 0
          };
        });
        
        const pointsTotal = evaluation.questions.reduce((sum, q) => sum + q.points, 0);
        const pointsObtenus = reponsesEvaluees.reduce((sum, r) => sum + r.points, 0);
        const score = Math.round((pointsObtenus / pointsTotal) * 100);
        
        const newResultat: ResultatEvaluation = {
          id: Math.max(...resultatsData.map(r => r.id), 0) + 1,
          evaluationId,
          participantId,
          datePassage: new Date().toISOString().split('T')[0],
          score,
          reussi: score >= evaluation.seuilReussite,
          reponses: reponsesEvaluees
        };
        
        resultatsData.push(newResultat);
        resolve(newResultat);
      }, 500);
    });
  },
  
  // Obtenir les résultats d'un participant
  getParticipantResults: async (participantId: number): Promise<ResultatEvaluation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const resultats = resultatsData.filter(r => r.participantId === participantId);
        resolve(resultats);
      }, 300);
    });
  },
  
  // Obtenir les statistiques d'une évaluation
  getEvaluationStats: async (evaluationId: number): Promise<{
    participants: number;
    tauxReussite: number;
    scoreMinimum: number;
    scoreMaximum: number;
    scoreMoyen: number;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const resultats = resultatsData.filter(r => r.evaluationId === evaluationId);
        
        if (resultats.length === 0) {
          resolve({
            participants: 0,
            tauxReussite: 0,
            scoreMinimum: 0,
            scoreMaximum: 0,
            scoreMoyen: 0
          });
          return;
        }
        
        const participants = resultats.length;
        const reussis = resultats.filter(r => r.reussi).length;
        const scores = resultats.map(r => r.score);
        
        resolve({
          participants,
          tauxReussite: Math.round((reussis / participants) * 100),
          scoreMinimum: Math.min(...scores),
          scoreMaximum: Math.max(...scores),
          scoreMoyen: Math.round(scores.reduce((a, b) => a + b, 0) / participants)
        });
      }, 300);
    });
  },
  
  // Créer une nouvelle évaluation
  createEvaluation: async (evaluation: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvaluation: Evaluation = {
          ...evaluation,
          id: Math.max(...evaluationsData.map(e => e.id), 0) + 1
        };
        evaluationsData.push(newEvaluation);
        resolve(newEvaluation);
      }, 300);
    });
  }
};
