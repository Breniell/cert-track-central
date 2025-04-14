
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center text-white text-xl font-bold">
              CTC
            </div>
          </div>
          <h1 className="text-2xl font-bold">CertTrackCentral</h1>
          <p className="text-gray-600">Plateforme de gestion des formations</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Mot de passe oublié?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Comptes de démonstration:</p>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              setEmail("jean.dupont@example.com");
              setPassword("password");
            }}>
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setEmail("pierre.dubois@example.com");
              setPassword("password");
            }}>
              Formateur
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setEmail("sophie.martin@example.com");
              setPassword("password");
            }}>
              RH
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setEmail("marie.petit@example.com");
              setPassword("password");
            }}>
              Personnel
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setEmail("thomas.leroy@external.com");
              setPassword("password");
            }}>
              Sous-traitant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
