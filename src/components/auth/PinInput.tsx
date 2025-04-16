
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

const pinSchema = z.object({
  pin: z.string().length(4, "Le code PIN doit contenir exactement 4 chiffres"),
});

interface PinInputProps {
  userId: number;
  onBack: () => void;
}

export function PinInput({ userId, onBack }: PinInputProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof pinSchema>) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const isPinValid = await authService.verifyPin(userId, values.pin);
      
      if (isPinValid) {
        const userData = await authService.getUserById(userId);
        if (userData) {
          login(userId.toString(), userData.role);
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

  return (
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={4}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, i) => (
                            <InputOTPSlot key={i} {...slot} index={i} />
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
          <Button variant="link" onClick={onBack} disabled={isLoading}>
            Retour à la connexion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
