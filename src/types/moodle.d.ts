
// Déclarations TypeScript pour l'intégration Moodle
declare global {
  interface Window {
    initCimencamPlus: (containerId: string, config?: any) => void;
    M: {
      cfg: {
        wwwroot: string;
        sesskey: string;
        [key: string]: any;
      };
      user: {
        id: number;
        username: string;
        firstname: string;
        lastname: string;
        email: string;
        roles: string[];
        capabilities: string[];
        [key: string]: any;
      } | null;
      [key: string]: any;
    };
  }
}

export {};
