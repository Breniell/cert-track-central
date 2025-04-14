
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { authService, User } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.login(email, password);
      setUser(user);
      localStorage.setItem("authToken", token);
      
      // Rediriger vers la page d'accueil appropriée selon le rôle
      switch (user.role) {
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
        default:
          navigate("/");
      }
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${user.prenom} ${user.nom}`,
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: "Adresse e-mail ou mot de passe incorrect",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
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
