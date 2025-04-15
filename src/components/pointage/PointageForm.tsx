
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QrCode, UserCheck, Clock, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PointageFormProps {
  formationId: number;
  formationTitre: string;
}

export function PointageForm({ formationId, formationTitre }: PointageFormProps) {
  const [method, setMethod] = useState<"qrcode" | "manual">("qrcode");
  const [participantId, setParticipantId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePointage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!participantId && method === "manual") {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un identifiant de participant valide"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simuler le traitement du pointage
    setTimeout(() => {
      toast({
        title: "Pointage effectué",
        description: `Participant ${participantId || "#12345"} enregistré pour la formation "${formationTitre}"`
      });
      setIsSubmitting(false);
      setParticipantId("");
    }, 1500);
  };

  const startScanner = () => {
    setIsScanning(true);
    
    // Simuler un scan QR après 3 secondes
    setTimeout(() => {
      const scannedId = Math.floor(10000 + Math.random() * 90000).toString();
      setParticipantId(scannedId);
      setIsScanning(false);
      
      toast({
        title: "QR Code scanné",
        description: `Identifiant participant: ${scannedId}`,
      });
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pointage des participants</CardTitle>
        <CardDescription>
          Enregistrez la présence des participants pour la formation "{formationTitre}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePointage} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Méthode de pointage</label>
            <Select 
              value={method} 
              onValueChange={(value) => setMethod(value as "qrcode" | "manual")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qrcode">Scan QR Code</SelectItem>
                <SelectItem value="manual">Saisie manuelle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {method === "qrcode" ? (
            <div className="flex flex-col items-center space-y-4 py-4">
              {isScanning ? (
                <div className="relative w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-green-500/10 animate-pulse"></div>
                  <div className="absolute w-40 h-40 border-2 border-green-500"></div>
                  <div className="absolute w-48 h-1 bg-green-500 animate-bounce opacity-75"></div>
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              )}
              
              <Button 
                type="button"
                variant={isScanning ? "secondary" : "default"}
                className="w-full"
                onClick={isScanning ? () => setIsScanning(false) : startScanner}
              >
                {isScanning ? "Annuler le scan" : "Scanner un QR Code"}
              </Button>
              
              {participantId && (
                <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
                  <UserCheck className="text-green-500 h-5 w-5" />
                  <span className="text-green-700">Participant #{participantId} détecté</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">ID du participant</label>
              <Input
                type="text"
                placeholder="Entrez l'ID du participant"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <p>Le pointage d'entrée enregistre l'heure exacte de présence.</p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Select defaultValue="entree">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entree">Pointage Entrée</SelectItem>
            <SelectItem value="sortie">Pointage Sortie</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handlePointage} 
          disabled={isSubmitting || (method === "manual" && !participantId)}
        >
          {isSubmitting ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer le pointage"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
