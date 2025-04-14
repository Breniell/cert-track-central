
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pointageService, PointageRecord } from "@/services/pointageService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Clock, QrCode, UserCheck, CheckCircle, XCircle, RotateCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PointageSystemProps {
  formationId: number;
}

export default function PointageSystem({ formationId }: PointageSystemProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isManuelDialogOpen, setIsManuelDialogOpen] = useState(false);
  const [participantId, setParticipantId] = useState<string>("");
  const [pointageType, setPointageType] = useState<"Entrée" | "Sortie">("Entrée");
  const [activeTab, setActiveTab] = useState("pointage");

  const queryClient = useQueryClient();

  const { data: pointages, isLoading, error } = useQuery({
    queryKey: ["pointages", formationId],
    queryFn: () => pointageService.getPointagesByFormation(formationId)
  });

  const { data: presenceData, isLoading: isLoadingPresence } = useQuery({
    queryKey: ["presence", formationId],
    queryFn: () => pointageService.checkParticipantsPresence(formationId)
  });

  const { data: qrCodeUrl, isLoading: isLoadingQR } = useQuery({
    queryKey: ["qrcode", formationId],
    queryFn: () => pointageService.generateQRCode(formationId),
    enabled: isQRDialogOpen
  });

  const recordPointageMutation = useMutation({
    mutationFn: (data: Omit<PointageRecord, 'valide'>) => pointageService.recordPointage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pointages", formationId] });
      queryClient.invalidateQueries({ queryKey: ["presence", formationId] });
      
      toast({
        title: "Pointage enregistré",
        description: `Le pointage ${pointageType.toLowerCase()} a été enregistré avec succès.`
      });
      
      setIsManuelDialogOpen(false);
      setParticipantId("");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du pointage.",
        variant: "destructive"
      });
    }
  });

  const handleManualPointage = () => {
    const participantIdNumber = parseInt(participantId);
    
    if (isNaN(participantIdNumber)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un identifiant de participant valide.",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    const heure = now.toTimeString().split(' ')[0].substring(0, 5);
    
    recordPointageMutation.mutate({
      participantId: participantIdNumber,
      formationId,
      datePointage: now.toISOString().split('T')[0],
      typePointage: pointageType,
      heure,
      methode: "Manuel"
    });
  };

  const refreshPointage = () => {
    queryClient.invalidateQueries({ queryKey: ["pointages", formationId] });
    queryClient.invalidateQueries({ queryKey: ["presence", formationId] });
    
    toast({
      title: "Actualisation",
      description: "Les données de pointage ont été actualisées."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Système de pointage</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshPointage}>
            <RotateCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="default" size="sm" onClick={() => setIsQRDialogOpen(true)}>
            <QrCode className="w-4 h-4 mr-2" />
            Code QR
          </Button>
          <Button size="sm" onClick={() => setIsManuelDialogOpen(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Pointage manuel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pointage" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pointage">Historique des pointages</TabsTrigger>
          <TabsTrigger value="presence">État des présences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pointage">
          {isLoading ? (
            <div className="text-center p-8">Chargement des pointages...</div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">Erreur lors du chargement des pointages.</div>
          ) : pointages && pointages.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Historique des pointages</CardTitle>
                <CardDescription>Liste des entrées et sorties enregistrées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Participant</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Type</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Heure</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-500">Méthode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointages.map((pointage, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 text-sm">{pointage.participantId}</td>
                          <td className="p-3 text-sm">{pointage.datePointage}</td>
                          <td className="p-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pointage.typePointage === 'Entrée' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {pointage.typePointage}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{pointage.heure}</td>
                          <td className="p-3 text-sm">{pointage.methode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">Aucun pointage enregistré pour cette formation.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="presence">
          {isLoadingPresence ? (
            <div className="text-center p-8">Chargement des présences...</div>
          ) : presenceData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Présents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <UserCheck className="h-12 w-12 text-green-500 mr-3" />
                    <span className="text-4xl font-bold">{presenceData.presents}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Absents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <XCircle className="h-12 w-12 text-red-500 mr-3" />
                    <span className="text-4xl font-bold">{presenceData.absents}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">{presenceData.presents + presenceData.absents}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Détail des présences</CardTitle>
                  <CardDescription>État de présence des participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3 text-left text-sm font-medium text-gray-500">Participant ID</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-500">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {presenceData.participants.map((participant) => (
                          <tr key={participant.id} className="border-b">
                            <td className="p-3 text-sm">{participant.id}</td>
                            <td className="p-3 text-sm">
                              {participant.present ? (
                                <div className="flex items-center">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                  <span>Présent</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                  <span>Absent</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">Impossible de charger les données de présence.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog pour le code QR */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Code QR de pointage</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {isLoadingQR ? (
              <div className="text-center p-8">Génération du code QR...</div>
            ) : qrCodeUrl ? (
              <>
                <img src={qrCodeUrl} alt="QR Code de pointage" className="w-64 h-64" />
                <p className="mt-4 text-center text-sm text-gray-500">
                  Présentez ce code QR aux participants pour qu'ils puissent scanner et enregistrer leur présence.
                </p>
              </>
            ) : (
              <div className="text-center text-red-500">Erreur lors de la génération du code QR.</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsQRDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour le pointage manuel */}
      <Dialog open={isManuelDialogOpen} onOpenChange={setIsManuelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pointage manuel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="participantId">Identifiant du participant</Label>
              <Input 
                id="participantId" 
                placeholder="Entrez l'ID du participant"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pointageType">Type de pointage</Label>
              <Select 
                value={pointageType} 
                onValueChange={(value) => setPointageType(value as "Entrée" | "Sortie")}
              >
                <SelectTrigger id="pointageType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrée">Entrée</SelectItem>
                  <SelectItem value="Sortie">Sortie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManuelDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleManualPointage}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
