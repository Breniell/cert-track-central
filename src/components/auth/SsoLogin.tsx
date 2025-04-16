
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Fingerprint } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function SsoLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simuler une connexion SSO (à remplacer par l'intégration réelle)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      });

      login("user-sso-123", "administrateur");
      toast({
        title: "Connexion SSO réussie",
        description: `Connexion réussie via ${provider}.`,
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion SSO",
        description: `La connexion via ${provider} a échoué. Veuillez réessayer.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex flex-col space-y-2">
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleSSOLogin("Microsoft")}
          disabled={isLoading}
        >
          <User className="mr-2 h-4 w-4" />
          Se connecter avec Microsoft
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleSSOLogin("Google")}
          disabled={isLoading}
        >
          <User className="mr-2 h-4 w-4" />
          Se connecter avec Google
        </Button>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Ou</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => handleSSOLogin("Biométrique")}
        disabled={isLoading}
      >
        <Fingerprint className="mr-2 h-4 w-4" />
        Authentification biométrique
      </Button>
    </div>
  );
}
