
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pointageService, PointageRecord } from "@/services/pointageService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { QrCode, Clock, CheckCircle, UserCheck, Badge } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PointageScannerProps {
  formationId: number;
}

export default function PointageScanner({ formationId }: PointageScannerProps) {
  const [participantId, setParticipantId] = useState<string>("");
  const [typePointage, setTypePointage] = useState<"Entrée" | "Sortie">("Entrée");
  const [methodePointage, setMethodePointage] = useState<"QR" | "Badge" | "Manuel">("Manuel");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: pointages, isLoading } = useQuery({
    queryKey: ["pointages", formationId],
    queryFn: () => pointageService.getPointagesByFormation(formationId)
  });
  
  const { data: presenceStats } = useQuery({
    queryKey: ["presence-stats", formationId],
    queryFn: () => pointageService.checkParticipantsPresence(formationId)
  });
  
  const generateQRCodeMutation = useMutation({
    mutationFn: () => pointageService.generateQRCode(formationId),
    onSuccess: (url) => {
      setQrCodeUrl(url);
      toast({
        title: "Code QR généré",
        description: "Le code QR est prêt à être scanné par les participants."
      });
    }
  });
  
  const recordPointageMutation = useMutation({
    mutationFn: (data: Omit<PointageRecord, "valide">) => pointageService.recordPointage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pointages", formationId] });
      queryClient.invalidateQueries({ queryKey: ["presence-stats", formationId] });
      
      toast({
        title: "Pointage enregistré",
        description: `Le pointage de type "${typePointage}" a été enregistré avec succès.`
      });
      
      // Réinitialiser le formulaire
      if (methodePointage === "Manuel") {
        setParticipantId("");
      }
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du pointage.",
        variant: "destructive"
      });
    }
  });
  
  const handleGenerateQR = () => {
    generateQRCodeMutation.mutate();
  };
  
  const handleRecordPointage = () => {
    if (!participantId && methodePointage === "Manuel") {
      toast({
        title: "Erreur",
        description: "Veuillez saisir l'identifiant du participant.",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    const datePointage = now.toISOString().split('T')[0];
    const heure = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    recordPointageMutation.mutate({
      participantId: parseInt(participantId),
      formationId,
      datePointage,
      typePointage,
      heure,
      methode: methodePointage
    });
  };
  
  const groupPointagesByParticipant = () => {
    if (!pointages) return {};
    
    const grouped: { [key: number]: { entree?: PointageRecord; sortie?: PointageRecord } } = {};
    
    pointages.forEach(pointage => {
      if (!grouped[pointage.participantId]) {
        grouped[pointage.participantId] = {};
      }
      
      if (pointage.typePointage === "Entrée") {
        grouped[pointage.participantId].entree = pointage;
      } else {
        grouped[pointage.participantId].sortie = pointage;
      }
    });
    
    return grouped;
  };
  
  const groupedPointages = groupPointagesByParticipant();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="scanner">
        <TabsList>
          <TabsTrigger value="scanner">Pointage</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Système de pointage</CardTitle>
              <CardDescription>
                Enregistrez les entrées et sorties des participants à la formation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Méthode de pointage</label>
                <div className="flex gap-2">
                  <Button 
                    variant={methodePointage === "QR" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setMethodePointage("QR")}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                  <Button 
                    variant={methodePointage === "Badge" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setMethodePointage("Badge")}
                  >
                    <Badge className="w-4 h-4 mr-2" />
                    Badge
                  </Button>
                  <Button 
                    variant={methodePointage === "Manuel" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setMethodePointage("Manuel")}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Manuel
                  </Button>
                </div>
              </div>
              
              {methodePointage === "QR" && (
                <div className="space-y-4">
                  <Button onClick={handleGenerateQR}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Générer un code QR
                  </Button>
                  
                  {qrCodeUrl && (
                    <div className="flex flex-col items-center space-y-2">
                      <img src={qrCodeUrl} alt="QR Code pour le pointage" className="border p-2 rounded" />
                      <p className="text-sm text-gray-500">Scannez ce code QR pour enregistrer votre présence</p>
                    </div>
                  )}
                </div>
              )}
              
              {methodePointage === "Manuel" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID du participant</label>
                    <Input
                      type="text"
                      value={participantId}
                      onChange={(e) => setParticipantId(e.target.value)}
                      placeholder="Entrez l'ID du participant"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de pointage</label>
                    <Select
                      value={typePointage}
                      onValueChange={(value: "Entrée" | "Sortie") => setTypePointage(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de pointage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrée">Entrée</SelectItem>
                        <SelectItem value="Sortie">Sortie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {methodePointage === "Manuel" && (
                <Button onClick={handleRecordPointage}>
                  <Clock className="w-4 h-4 mr-2" />
                  Enregistrer le pointage
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique des pointages</CardTitle>
              <CardDescription>
                Consultez les entrées et sorties enregistrées pour cette formation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-gray-500">Chargement des pointages...</p>
              ) : Object.keys(groupedPointages).length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrée</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sortie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(groupedPointages).map(([participantId, data]) => {
                        const entree = data.entree?.heure || "-";
                        const sortie = data.sortie?.heure || "-";
                        
                        // Calcul de la durée si entrée et sortie sont présentes
                        let duree = "-";
                        let dureeComplete = false;
                        if (data.entree && data.sortie) {
                          const [heureEntree, minuteEntree] = data.entree.heure.split(':').map(Number);
                          const [heureSortie, minuteSortie] = data.sortie.heure.split(':').map(Number);
                          
                          const totalMinutesEntree = heureEntree * 60 + minuteEntree;
                          const totalMinutesSortie = heureSortie * 60 + minuteSortie;
                          
                          const diffMinutes = totalMinutesSortie - totalMinutesEntree;
                          const heures = Math.floor(diffMinutes / 60);
                          const minutes = diffMinutes % 60;
                          
                          duree = `${heures}h${minutes < 10 ? '0' : ''}${minutes}`;
                          dureeComplete = true;
                        }
                        
                        return (
                          <tr key={participantId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Participant #{participantId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entree}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {sortie}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {duree}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dureeComplete ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Présent
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Incomplet
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">Aucun pointage enregistré pour cette formation.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistiques">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de présence</CardTitle>
              <CardDescription>
                Consultez le taux de présence et les statistiques pour cette formation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {presenceStats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-green-800 font-medium">Présents</p>
                      <p className="text-3xl font-bold text-green-600">{presenceStats.presents}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-red-800 font-medium">Absents</p>
                      <p className="text-3xl font-bold text-red-600">{presenceStats.absents}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Taux de présence</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${(presenceStats.presents / (presenceStats.presents + presenceStats.absents)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {Math.round((presenceStats.presents / (presenceStats.presents + presenceStats.absents)) * 100)}%
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Détail par participant</h4>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {presenceStats.participants.map((p) => (
                            <tr key={p.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Participant #{p.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {p.present ? (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Présent
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Absent
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">Chargement des statistiques...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
