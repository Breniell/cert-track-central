
import { createRoot } from 'react-dom/client';
import MoodleApp from './MoodleApp.tsx';
import './index.css';

// Point d'entrée pour l'intégration Moodle
// Ce fichier sera compilé séparément pour le plugin Moodle

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
  root.render(<MoodleApp />);
  
  console.log('CIMENCAM Plus plugin initialized successfully');
};

// Si nous sommes en mode développement, monter directement
if (import.meta.env.DEV) {
  const container = document.getElementById('root');
  if (container) {
    // Simuler les données Moodle pour le développement
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
        roles: ['trainer'],
        capabilities: ['local/cimencamplus:manage_formations']
      }
    };
    
    const root = createRoot(container);
    root.render(<MoodleApp />);
  }
}
