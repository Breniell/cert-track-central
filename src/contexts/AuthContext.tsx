
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { authService, User, UserRole } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userId: string, role: UserRole) => void;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const userData = await authService.checkAuth(token);
          setUser(userData);
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userId: string, role: UserRole) => {
    // Simuler un utilisateur connecté
    const newUser: User = {
      id: parseInt(userId),
      nom: "Utilisateur",
      prenom: "Connecté",
      email: "utilisateur@example.com",
      role: role,
      dateCreation: new Date().toISOString(),
      permissions: [],
      pin: ""
    };
    
    setUser(newUser);
    localStorage.setItem("authToken", `simulated_jwt_token_${userId}_${Date.now()}`);
    
    // Rediriger vers la page d'accueil appropriée selon le rôle
    switch (role) {
      case "administrateur":
        navigate("/admin");
        break;
      case "formateur":
        navigate("/formateur");
        break;
      case "personnel":
        navigate("/personnel");
        break;
      case "hse":
        navigate("/hse/verification-documents");
        break;
      case "sous-traitant":
        navigate("/personnel/formations");
        break;
      case "rh":
        navigate("/formations");
        break;
      default:
        navigate("/");
    }
    
    toast({
      title: "Connexion réussie",
      description: `Bienvenue, ${newUser.prenom} ${newUser.nom}`,
    });
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("authToken");
      navigate("/login");
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de la déconnexion",
      });
    }
  };

  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    return await authService.checkPermission(user.id, permission);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
