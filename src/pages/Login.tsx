
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, Users, Settings, Book, User, FileCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Adresse e-mail ou mot de passe incorrect");
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoAccounts = [
    { role: "Admin", icon: Shield, email: "jean.dupont@example.com", password: "password" },
    { role: "Formateur", icon: Users, email: "pierre.dubois@example.com", password: "password" },
    { role: "RH", icon: Settings, email: "sophie.martin@example.com", password: "password" },
    { role: "Personnel", icon: User, email: "marie.petit@example.com", password: "password" },
    { role: "Sous-traitant", icon: Book, email: "thomas.leroy@external.com", password: "password" },
    { role: "HSE", icon: FileCheck, email: "hse@example.com", password: "password" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-md bg-primary flex items-center justify-center text-white text-2xl font-bold">
              CTC
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">CertTrackCentral</h1>
          <p className="text-gray-600 mt-2">Plateforme de gestion des formations HSE et métiers</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
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
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full h-11 text-base" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-3 font-medium">Comptes de démonstration:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {demoAccounts.map((account, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm"
                className="flex items-center justify-center gap-1.5 py-3 h-auto" 
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                <account.icon className="h-4 w-4" />
                <span>{account.role}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
