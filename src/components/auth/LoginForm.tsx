
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

interface LoginFormProps {
  onLoginSuccess: (userId: number) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "jean.dupont@example.com",
      password: "password123",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      console.log("Tentative de connexion avec:", values);
      const response = await authService.login(values.email, values.password);
      console.log("Réponse de connexion:", response);
      onLoginSuccess(response.user.id);
      toast({
        title: "Vérification requise",
        description: "Veuillez entrer votre code PIN à 4 chiffres.",
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Identifiants incorrects. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Exemple de connexion</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2 text-sm">
            <p><strong>Email:</strong> jean.dupont@example.com</p>
            <p><strong>Mot de passe:</strong> password123</p>
            <p><strong>Code PIN:</strong> 1234</p>
          </div>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
    </div>
  );
}
