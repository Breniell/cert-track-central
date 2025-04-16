
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Scan, Camera, CheckCircle, XCircle, Loader2, ClipboardList } from "lucide-react";
import { pointageService, PointageRecord } from "@/services/pointageService";

interface PointageQRScannerProps {
  formationId: number;
  onPointageSuccess?: (record: PointageRecord) => void;
}

export function PointageQRScanner({ formationId, onPointageSuccess }: PointageQRScannerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("scanner");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [pointageType, setPointageType] = useState<"Entrée" | "Sortie">("Entrée");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentPointages, setRecentPointages] = useState<PointageRecord[]>([]);

  // Récupérer les pointages récents
  useEffect(() => {
    const fetchRecentPointages = async () => {
      try {
        const records = await pointageService.getPointagesByFormation(formationId);
        setRecentPointages(records.slice(0, 5)); // Limiter aux 5 plus récents
      } catch (error) {
        console.error("Erreur lors de la récupération des pointages:", error);
      }
    };

    fetchRecentPointages();
    
    // Rafraîchir les pointages toutes les 30 secondes
    const interval = setInterval(fetchRecentPointages, 30000);
    return () => clearInterval(interval);
  }, [formationId]);

  // Générer un QR code pour la formation
  useEffect(() => {
    if (activeTab === "qrcode" && !qrCodeUrl) {
      generateQRCode();
    }
  }, [activeTab, qrCodeUrl]);

  // Simuler la lecture d'un QR code (dans un environnement réel, cela utiliserait l'API Web Camera)
  const startScanner = () => {
    setIsCameraActive(true);
    setScanStatus("scanning");
    
    // Simulation de la détection d'un QR code après un délai
    setTimeout(() => {
      const participantIds = [1, 2, 3, 4]; // Simuler différents participants
      const randomParticipantId = participantIds[Math.floor(Math.random() * participantIds.length)];
      const detectedQRCode = `participant_${randomParticipantId}_formation_${formationId}`;
      
      handleScanResult(detectedQRCode);
    }, 3000);
  };

  // Arrêter le scanner
  const stopScanner = () => {
    setIsCameraActive(false);
    setScanStatus("idle");
    setScanResult(null);
  };

  // Traiter le résultat du scan
  const handleScanResult = async (result: string) => {
    setScanResult(result);
    
    // Extraire l'ID du participant du QR code (format : participant_ID_formation_ID)
    const match = result.match(/participant_(\d+)_formation_\d+/);
    if (!match) {
      setScanStatus("error");
      toast({
        variant: "destructive",
        title: "QR code invalide",
        description: "Le format du QR code n'est pas reconnu."
      });
      return;
    }
    
    const participantId = parseInt(match[1]);
    
    try {
      setScanStatus("scanning");
      
      // Enregistrer le pointage
      const now = new Date();
      const pointage: Omit<PointageRecord, 'valide'> = {
        participantId,
        formationId,
        datePointage: now.toISOString().split('T')[0],
        typePointage: pointageType,
        heure: now.toTimeString().split(' ')[0].substring(0, 5),
        methode: "QR"
      };
      
      const record = await pointageService.recordPointage(pointage);
      
      // Mettre à jour la liste des pointages récents
      setRecentPointages(prev => [record, ...prev.slice(0, 4)]);
      
      setScanStatus("success");
      toast({
        title: "Pointage réussi",
        description: `Participant #${participantId} : ${pointageType} enregistré à ${pointage.heure}.`
      });
      
      if (onPointageSuccess) {
        onPointageSuccess(record);
      }
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setScanStatus("idle");
        setScanResult(null);
      }, 3000);
      
    } catch (error) {
      setScanStatus("error");
      toast({
        variant: "destructive",
        title: "Erreur de pointage",
        description: "Une erreur est survenue lors de l'enregistrement du pointage."
      });
    }
  };

  // Générer un QR code pour la formation
  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      const url = await pointageService.generateQRCode(formationId);
      setQrCodeUrl(url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le QR code."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Changer le type de pointage (entrée/sortie)
  const togglePointageType = () => {
    setPointageType(prev => prev === "Entrée" ? "Sortie" : "Entrée");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Système de Pointage QR
        </CardTitle>
        <CardDescription>
          Scanner le QR code du participant ou présenter le QR code de la formation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner">Scanner un QR</TabsTrigger>
            <TabsTrigger value="qrcode">QR de la formation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scanner" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant={pointageType === "Entrée" ? "default" : "outline"} 
                  size="sm"
                  onClick={togglePointageType}
                  disabled={scanStatus === "scanning"}
                >
                  Entrée
                </Button>
                <Button 
                  variant={pointageType === "Sortie" ? "default" : "outline"} 
                  size="sm"
                  onClick={togglePointageType}
                  disabled={scanStatus === "scanning"}
                >
                  Sortie
                </Button>
              </div>
              {scanStatus === "idle" ? (
                <Button onClick={startScanner} className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Activer la caméra
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopScanner} className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Arrêter
                </Button>
              )}
            </div>
            
            <div className="relative aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
              {scanStatus === "idle" && !isCameraActive && (
                <div className="text-white text-center p-4">
                  <Scan className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Cliquez sur "Activer la caméra" pour commencer le scan</p>
                </div>
              )}
              
              {scanStatus === "scanning" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isCameraActive && (
                    <>
                      <div className="absolute inset-0 border-2 border-dashed border-white/30 animate-pulse rounded-md"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-primary"></div>
                      <Scan className="h-10 w-10 text-primary animate-pulse" />
                      <p className="text-white mt-2">Recherche d'un QR code...</p>
                    </>
                  )}
                </div>
              )}
              
              {scanStatus === "success" && (
                <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p className="text-white mt-2">Pointage enregistré avec succès !</p>
                  {scanResult && (
                    <p className="text-white/70 text-sm mt-1">
                      {scanResult.replace(/_/g, ' ')}
                    </p>
                  )}
                </div>
              )}
              
              {scanStatus === "error" && (
                <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center">
                  <XCircle className="h-12 w-12 text-red-500" />
                  <p className="text-white mt-2">Erreur lors du scan</p>
                  <Button variant="secondary" size="sm" className="mt-2" onClick={() => setScanStatus("idle")}>
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
            
            {recentPointages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Pointages récents
                </h3>
                <ul className="space-y-2">
                  {recentPointages.map((pointage, index) => (
                    <li key={index} className="text-sm flex justify-between items-center p-2 bg-slate-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${pointage.typePointage === 'Entrée' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                        <span>Participant #{pointage.participantId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>{pointage.typePointage}</span>
                        <span>·</span>
                        <span>{pointage.heure}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="qrcode">
            <div className="flex flex-col items-center justify-center p-4">
              {isLoading ? (
                <div className="text-center p-8 flex flex-col items-center">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                  <p>Génération du QR code...</p>
                </div>
              ) : qrCodeUrl ? (
                <>
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <img src={qrCodeUrl} alt="QR Code de la formation" className="w-64 h-64" />
                  </div>
                  <Alert>
                    <AlertTitle className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Instructions
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-sm">
                      Affichez ce QR code aux participants qui pourront le scanner avec leur application mobile pour enregistrer leur présence.
                    </AlertDescription>
                  </Alert>
                  <Button variant="outline" className="mt-4" onClick={generateQRCode}>
                    Régénérer le QR code
                  </Button>
                </>
              ) : (
                <div className="text-center text-red-500">
                  <XCircle className="h-10 w-10 mx-auto mb-2" />
                  <p>Erreur lors de la génération du QR code.</p>
                  <Button variant="outline" className="mt-4" onClick={generateQRCode}>
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          Formation #{formationId} • Type de pointage: {pointageType}
        </p>
      </CardFooter>
    </Card>
  );
}
