
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MoodleApp from './MoodleApp.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Fonction d'initialisation appelée par Moodle
window.initCimencamPlus = function(containerId: string, config: any = {}) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with ID '${containerId}' not found`);
    return;
  }

  // Injecter la configuration Moodle dans window.M si pas déjà présent
  if (config && !window.M) {
    window.M = {
      cfg: config.moodle_config || {},
      user: config.current_user || null
    };
  }

  // Monter l'application React
  const root = createRoot(container);
  root.render(
    <QueryClientProvider client={queryClient}>
      <MoodleApp />
    </QueryClientProvider>
  );
  
  console.log('CIMENCAM Plus plugin initialized successfully');
};

// Si nous sommes en mode développement, monter directement
if (import.meta.env.DEV) {
  const container = document.getElementById('root');
  if (container) {
    // Simuler les données Moodle pour le développement avec rôle modifiable
    window.M = {
      cfg: {
        wwwroot: 'http://localhost',
        sesskey: 'dev_session_key'
      },
      user: {
        id: 1,
        username: 'testuser',
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        roles: ['trainer'], // Changez ici : 'trainer', 'student', 'manager'
        capabilities: ['local/cimencamplus:manage_formations']
      }
    };
    
    const root = createRoot(container);
    root.render(
      <QueryClientProvider client={queryClient}>
        <MoodleApp />
      </QueryClientProvider>
    );
  }
}
