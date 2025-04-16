
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, KeyRound } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

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
  const [manualPin, setManualPin] = useState("");

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

  // Gestionnaire pour la saisie manuelle du PIN
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPin.length !== 4) {
      toast({
        variant: "destructive",
        title: "Code PIN invalide",
        description: "Le code PIN doit contenir exactement 4 chiffres.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const isPinValid = await authService.verifyPin(userId, manualPin);
      
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

        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Problème de saisie ? Utilisez l'option manuelle :</h3>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Entrez votre code PIN"
                className="pl-10"
                value={manualPin}
                onChange={(e) => {
                  // Accepter uniquement les chiffres
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 4) {
                    setManualPin(value);
                  }
                }}
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
              {isLoading ? "Vérification..." : "Valider saisie manuelle"}
            </Button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={onBack} disabled={isLoading}>
            Retour à la connexion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
