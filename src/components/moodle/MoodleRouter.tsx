
import { useMoodle } from '@/contexts/MoodleContext';
import TrainerDashboard from '@/pages/TrainerDashboard';
import LearnerDashboard from '@/pages/LearnerDashboard';
import RHDashboard from '@/pages/RHDashboard';

export default function MoodleRouter() {
  const { user, isLoading, isTrainer, isRH, isLearner } = useMoodle();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cimencam-green mx-auto mb-4"></div>
          <p className="text-cimencam-gray">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-cimencam-gray mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600">
            Vous devez être connecté à Moodle pour accéder à cette interface.
          </p>
        </div>
      </div>
    );
  }

  // Routing basé sur les rôles Moodle
  if (isTrainer) {
    return <TrainerDashboard />;
  }

  if (isRH) {
    return <RHDashboard />;
  }

  if (isLearner) {
    return <LearnerDashboard />;
  }

  // Fallback pour les utilisateurs sans rôle spécifique
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-cimencam-gray mb-2">
          Rôle non reconnu
        </h2>
        <p className="text-gray-600">
          Votre rôle utilisateur ne permet pas d'accéder à cette interface.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Rôles détectés: {user.roles?.join(', ') || 'Aucun'}
        </p>
      </div>
    </div>
  );
}
