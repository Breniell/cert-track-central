import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Shield, User, Key, Fingerprint, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

// Schéma de validation pour le formulaire de MFA
const mfaSchema = z.object({
  code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
});

const pinSchema = z.object({
  pin: z.string().length(4, "Le code PIN doit contenir exactement 4 chiffres"),
});

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [requireMFA, setRequireMFA] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [showPinInput, setShowPinInput] = useState(false);
  const [tempUserId, setTempUserId] = useState<number | null>(null);

  // Formulaire de connexion
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Formulaire de MFA
  const mfaForm = useForm<z.infer<typeof mfaSchema>>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: "",
    },
  });

  const pinForm = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Gestion de la soumission du formulaire de connexion
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const response = await authService.login(values.email, values.password);
      setTempUserId(response.user.id);
      setShowPinInput(true);
      toast({
        title: "Vérification requise",
        description: "Veuillez entrer votre code PIN à 4 chiffres.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Identifiants incorrects. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la soumission du formulaire MFA
  const onMFASubmit = async (values: z.infer<typeof mfaSchema>) => {
    setIsLoading(true);
    try {
      // Simuler la vérification MFA (à remplacer par un appel API réel)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      // MFA vérifié avec succès
      login(userId!, "admin");
      toast({
        title: "Vérification réussie",
        description: "Bienvenue sur la plateforme de gestion de formations.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Code invalide",
        description: "Le code entré est incorrect. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la soumission du code PIN
  const onPinSubmit = async (values: z.infer<typeof pinSchema>) => {
    if (!tempUserId) return;
    
    setIsLoading(true);
    try {
      const isPinValid = await authService.verifyPin(tempUserId, values.pin);
      
      if (isPinValid) {
        const userData = await authService.getUserById(tempUserId);
        if (userData) {
          login(tempUserId.toString(), userData.role);
          toast({
            title: "Connexion réussie",
            description: `Bienvenue ${userData.prenom} ${userData.nom}`,
          });
          navigate("/");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Code PIN invalide",
          description: "Le code PIN entré est incorrect. Veuillez réessayer.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la connexion SSO
  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simuler une connexion SSO (à remplacer par l'intégration réelle)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      });

      login("user-sso-123", "admin");
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

  if (showPinInput) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Code PIN
              </CardTitle>
              <CardDescription>
                Veuillez entrer votre code PIN à 4 chiffres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...pinForm}>
                <form onSubmit={pinForm.handleSubmit(onPinSubmit)} className="space-y-4">
                  <FormField
                    control={pinForm.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP
                            maxLength={4}
                            render={({ slots }) => (
                              <InputOTPGroup>
                                {slots.map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}
                              </InputOTPGroup>
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Vérification..." : "Valider"}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => setShowPinInput(false)} disabled={isLoading}>
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
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

        {requireMFA ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Vérification en deux étapes
              </CardTitle>
              <CardDescription>
                Veuillez entrer le code de vérification envoyé à votre appareil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...mfaForm}>
                <form onSubmit={mfaForm.handleSubmit(onMFASubmit)} className="space-y-4">
                  <FormField
                    control={mfaForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code de vérification</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              {...field}
                              className="pl-10"
                              placeholder="Entrez le code à 6 chiffres"
                              inputMode="numeric"
                              maxLength={6}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Vérification..." : "Vérifier"}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => setRequireMFA(false)} disabled={isLoading}>
                  Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input {...field} className="pl-10" placeholder="nom@entreprise.com" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                  {...field}
                                  type="password"
                                  className="pl-10"
                                  placeholder="Votre mot de passe"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="px-2">
                      Mot de passe oublié ?
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="sso">
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
        )}
      </div>
    </div>
  );
}
