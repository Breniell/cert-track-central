
interface InteractionLog {
  timestamp: number;
  eventType: 'focus' | 'blur' | 'copy' | 'paste' | 'print' | 'keydown' | 'mouseMove';
  details?: string;
}

export interface ExamSession {
  id: number;
  userId: number;
  evaluationId: number;
  startTime: number;
  endTime?: number;
  interactions: InteractionLog[];
  capturedScreenshots: string[];
  status: 'en_cours' | 'terminé' | 'annulé' | 'suspicieux';
  suspiciousActivityCount: number;
}

// Service pour la détection de triche
export const antiTricheService = {
  // Démarre une nouvelle session d'examen
  startExamSession: async (userId: number, evaluationId: number): Promise<ExamSession> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const session: ExamSession = {
          id: Math.floor(Math.random() * 10000),
          userId,
          evaluationId,
          startTime: Date.now(),
          interactions: [],
          capturedScreenshots: [],
          status: 'en_cours',
          suspiciousActivityCount: 0,
        };
        resolve(session);
      }, 300);
    });
  },

  // Enregistre une interaction utilisateur
  logInteraction: async (sessionId: number, interaction: Omit<InteractionLog, 'timestamp'>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans une implémentation réelle, ceci serait enregistré dans une base de données
        console.log(`Interaction enregistrée pour la session ${sessionId}:`, interaction);
        resolve();
      }, 100);
    });
  },

  // Enregistre une capture d'écran
  logScreenshot: async (sessionId: number, screenshotData: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans une implémentation réelle, ceci serait enregistré dans une base de données
        console.log(`Capture d'écran enregistrée pour la session ${sessionId}`);
        resolve();
      }, 100);
    });
  },

  // Finit une session d'examen
  endExamSession: async (sessionId: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans une implémentation réelle, ceci marquerait la session comme terminée dans la base de données
        console.log(`Session d'examen ${sessionId} terminée`);
        resolve();
      }, 300);
    });
  },

  // Analyse les actions pour détecter les comportements suspects
  analyzeSession: async (sessionId: number): Promise<{suspiciousScore: number; findings: string[]}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simule l'analyse du comportement de l'utilisateur
        // Dans une implémentation réelle, il y aurait des algorithmes complexes pour détecter les patterns suspects
        const suspiciousScore = Math.random() * 100;
        const findings: string[] = [];
        
        if (suspiciousScore > 80) {
          findings.push("Changements fréquents de fenêtre détectés");
          findings.push("Comportement de copier-coller excessif");
        } else if (suspiciousScore > 50) {
          findings.push("Temps de réponse anormalement court pour la complexité des questions");
        }
        
        resolve({ suspiciousScore, findings });
      }, 500);
    });
  },

  // Génère un rapport pour le surveillant
  generateSurveillanceReport: async (sessionId: number): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simule la génération d'un rapport détaillé
        const reportUrl = `https://example.com/surveillance/report/${sessionId}`;
        resolve(reportUrl);
      }, 300);
    });
  }
};
