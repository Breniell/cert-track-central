
export type UserRole = 'administrateur' | 'rh' | 'hse' | 'formateur' | 'personnel' | 'sous-traitant';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: UserRole;
  departement?: string;
  entreprise?: string;
  avatar?: string;
  dateCreation: string;
  dernierLogin?: string;
  permissions: string[];
}

// Simule une base de données pour les utilisateurs
let usersData: User[] = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    telephone: "+123456789",
    role: "administrateur",
    dateCreation: "2024-01-01",
    dernierLogin: "2024-03-15",
    permissions: ["all"]
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@example.com",
    telephone: "+987654321",
    role: "rh",
    departement: "Ressources Humaines",
    dateCreation: "2024-01-05",
    dernierLogin: "2024-03-14",
    permissions: ["formations.view", "formations.create", "participants.view", "participants.create", "reporting.view"]
  },
  {
    id: 3,
    nom: "Dubois",
    prenom: "Pierre",
    email: "pierre.dubois@example.com",
    role: "formateur",
    departement: "Formation",
    dateCreation: "2024-01-10",
    dernierLogin: "2024-03-13",
    permissions: ["formations.view", "formations.manage", "participants.view", "evaluations.create", "evaluations.manage"]
  },
  {
    id: 4,
    nom: "Petit",
    prenom: "Marie",
    email: "marie.petit@example.com",
    role: "personnel",
    departement: "Production",
    dateCreation: "2024-01-15",
    dernierLogin: "2024-03-12",
    permissions: ["formations.view", "profile.edit"]
  },
  {
    id: 5,
    nom: "Leroy",
    prenom: "Thomas",
    email: "thomas.leroy@external.com",
    role: "sous-traitant",
    entreprise: "ExternalTech SA",
    dateCreation: "2024-02-01",
    dernierLogin: "2024-03-10",
    permissions: ["formations.view", "profile.edit"]
  }
];

export const authService = {
  // Connexion
  login: async (email: string, password: string): Promise<{user: User; token: string}> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = usersData.find(u => u.email === email);
        
        if (!user) {
          reject(new Error("Identifiants incorrects"));
          return;
        }
        
        // Dans un cas réel, vérifierait le mot de passe avec bcrypt ou similaire
        // et générerait un vrai token JWT
        user.dernierLogin = new Date().toISOString();
        
        resolve({
          user,
          token: `simulated_jwt_token_${user.id}_${Date.now()}`
        });
      }, 500);
    });
  },
  
  // Vérifier si l'utilisateur est authentifié
  checkAuth: async (token: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans un cas réel, vérifierait la validité du token JWT
        const isValid = token.startsWith('simulated_jwt_token_');
        
        if (!isValid) {
          resolve(null);
          return;
        }
        
        // Simulation - renvoie un utilisateur basé sur l'ID extrait du token
        const userId = parseInt(token.split('_')[2]);
        const user = usersData.find(u => u.id === userId);
        
        resolve(user || null);
      }, 300);
    });
  },
  
  // Déconnexion
  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans un cas réel, invaliderait le token ou la session
        resolve();
      }, 200);
    });
  },
  
  // Récupérer tous les utilisateurs
  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(usersData);
      }, 300);
    });
  },
  
  // Récupérer un utilisateur par son ID
  getUserById: async (userId: number): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = usersData.find(u => u.id === userId);
        resolve(user);
      }, 300);
    });
  },
  
  // Créer un nouvel utilisateur
  createUser: async (user: Omit<User, 'id' | 'dateCreation'>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...user,
          id: Math.max(...usersData.map(u => u.id)) + 1,
          dateCreation: new Date().toISOString().split('T')[0]
        };
        usersData.push(newUser);
        resolve(newUser);
      }, 300);
    });
  },
  
  // Mettre à jour un utilisateur
  updateUser: async (userId: number, updates: Partial<User>): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = usersData.findIndex(u => u.id === userId);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        usersData[index] = { ...usersData[index], ...updates };
        resolve(usersData[index]);
      }, 300);
    });
  },
  
  // Vérifier les permissions d'un utilisateur
  checkPermission: async (userId: number, permission: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = usersData.find(u => u.id === userId);
        
        if (!user) {
          resolve(false);
          return;
        }
        
        const hasPermission = user.permissions.includes("all") || user.permissions.includes(permission);
        resolve(hasPermission);
      }, 200);
    });
  }
};
