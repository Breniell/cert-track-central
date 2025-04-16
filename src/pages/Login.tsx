
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PinInput } from "@/components/auth/PinInput";
import { SsoLogin } from "@/components/auth/SsoLogin";

export default function Login() {
  const [showPinInput, setShowPinInput] = useState(false);
  const [tempUserId, setTempUserId] = useState<number | null>(null);

  const handleLoginSuccess = (userId: number) => {
    console.log("Connexion réussie, redirection vers la saisie du PIN", userId);
    setTempUserId(userId);
    setShowPinInput(true);
  };

  if (showPinInput && tempUserId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="w-full max-w-md">
          <PinInput
            userId={tempUserId}
            onBack={() => setShowPinInput(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Plateforme de Gestion des Formations</h1>
          <p className="text-gray-600 mt-2">Coordination RH, HSE & Formations Métiers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Accédez à la plateforme de gestion des formations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credentials">Identifiants</TabsTrigger>
                <TabsTrigger value="sso">SSO</TabsTrigger>
              </TabsList>
              <TabsContent value="credentials">
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              </TabsContent>
              <TabsContent value="sso">
                <SsoLogin />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full rounded-md bg-amber-50 p-3">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Information de sécurité</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Pour des raisons de sécurité, l'authentification à deux facteurs est activée pour les comptes administratifs et HSE.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
