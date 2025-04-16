
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const mfaSchema = z.object({
  code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
});

interface MfaVerificationProps {
  userId: string;
  onBack: () => void;
}

export function MfaVerification({ userId, onBack }: MfaVerificationProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof mfaSchema>>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof mfaSchema>) => {
    setIsLoading(true);
    try {
      // Simuler la vérification MFA (à remplacer par un appel API réel)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      login(userId, "admin");
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

  return (
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
          <Button variant="link" onClick={onBack} disabled={isLoading}>
            Retour à la connexion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
