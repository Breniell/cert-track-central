
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { QrCode, Clock, Check, User, Users, CircleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PointageRecord, pointageService } from "@/services/pointageService";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";

interface PointageFormateurProps {
  formateurId: number;
}

export default function PointageFormateur({ formateurId }: PointageFormateurProps) {
  const [loading, setLoading] = useState(true);
  const [formationId, setFormationId] = useState<number | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [activeFormation, setActiveFormation] = useState<Formation | null>(null);
  const [pointages, setPointages] = useState<PointageRecord[]>([]);
  const [statut, setStatut] = useState<{presents: number; absents: number; participants: {id: number; present: boolean}[]}>({
    presents: 0,
    absents: 0,
    participants: []
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const fetchFormations = async () => {
    try {
      // Dans un cas réel, on filtrerait par formateur
      const data = await formationService.getAllFormations();
      const formateurFormations = data.filter(f => 
        f.formateur === "Jean Dupont" || // Simuler une correspondance avec un formateur
        f.formateur === "Marie Martin" || 
        f.statut === "En cours" || 
        f.statut === "À venir"
      );
      setFormations(formateurFormations);
    } catch (error) {
      console.error("Erreur lors de la récupération des formations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les formations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPointages = async (id: number) => {
    try {
      const records = await pointageService.getPointagesByFormation(id);
      setPointages(records);
      
      // Vérifier le statut de présence des participants
      const statutPresence = await pointageService.checkParticipantsPresence(id);
      setStatut(statutPresence);
    } catch (error) {
      console.error("Erreur lors de la récupération des pointages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les pointages",
        variant: "destructive",
      });
    }
  };

  const handleFormationChange = async (id: string) => {
    const formationIdNum = parseInt(id);
    setFormationId(formationIdNum);
    
    const formation = formations.find(f => f.id === formationIdNum);
    setActiveFormation(formation || null);
    
    if (formationIdNum) {
      await fetchPointages(formationIdNum);
    }
  };

  const generateQrCode = async () => {
    if (!formationId) return;
    
    try {
      const url = await pointageService.generateQRCode(formationId);
      setQrCodeUrl(url);
      toast({
        title: "QR Code généré",
        description: "Le QR code pour le pointage a été généré avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le QR code",
        variant: "destructive",
      });
    }
  };

  const enregistrerPointage = async (participantId: number, typePointage: 'Entrée' | 'Sortie') => {
    if (!formationId) return;
    
    try {
      await pointageService.recordPointage({
        participantId,
        formationId,
        datePointage: new Date().toISOString().split('T')[0],
        typePointage,
        heure: new Date().toTimeString().slice(0, 5),
        methode: 'Manuel'
      });
      
      toast({
        title: "Pointage enregistré",
        description: `Pointage ${typePointage.toLowerCase()} enregistré avec succès`,
      });
      
      // Rafraîchir les pointages après enregistrement
      await fetchPointages(formationId);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du pointage:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le pointage",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Système de pointage</CardTitle>
          <CardDescription>
            Gérez la présence des participants aux formations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formation">Sélectionner une formation</Label>
              <Select onValueChange={handleFormationChange} value={formationId?.toString() || ""}>
                <SelectTrigger id="formation">
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((formation) => (
                    <SelectItem key={formation.id} value={formation.id.toString()}>
                      {formation.titre} - {formation.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeFormation && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{activeFormation.titre}</CardTitle>
                    <Badge 
                      variant={
                        activeFormation.statut === "En cours" 
                          ? "secondary" 
                          : activeFormation.statut === "À venir" 
                            ? "outline" 
                            : activeFormation.statut === "Terminée" 
                              ? "default" 
                              : "destructive"
                      }
                    >
                      {activeFormation.statut}
                    </Badge>
                  </div>
                  <CardDescription>
                    {activeFormation.date} | {activeFormation.lieu} | Durée: {activeFormation.duree}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Participants:</span>{" "}
                      <span className="font-medium">{activeFormation.participants}/{activeFormation.maxParticipants}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Formateur:</span>{" "}
                      <span className="font-medium">{activeFormation.formateur}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {activeFormation && (
        <Tabs defaultValue="pointage">
          <TabsList>
            <TabsTrigger value="pointage">Pointage</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pointage">
            <Card>
              <CardHeader>
                <CardTitle>Pointage des participants</CardTitle>
                <CardDescription>
                  Enregistrez l'entrée et la sortie des participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Total des participants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{statut.presents + statut.absents}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Présents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">{statut.presents}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CircleAlert className="h-4 w-4 mr-2 text-red-500" />
                        Absents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-500">{statut.absents}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Liste des participants</h3>
                    <Input
                      placeholder="Rechercher un participant..."
                      className="max-w-xs"
                    />
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                      <div>ID</div>
                      <div>Nom</div>
                      <div>Statut</div>
                      <div>Entrée</div>
                      <div>Sortie</div>
                    </div>
                    
                    {statut.participants.map((participant) => {
                      // Simuler les données des participants
                      const nom = `Participant ${participant.id}`;
                      const entree = pointages.find(p => p.participantId === participant.id && p.typePointage === 'Entrée')?.heure;
                      const sortie = pointages.find(p => p.participantId === participant.id && p.typePointage === 'Sortie')?.heure;
                      
                      return (
                        <div key={participant.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
                          <div>{participant.id}</div>
                          <div>{nom}</div>
                          <div>
                            <Badge variant={participant.present ? "secondary" : "destructive"}>
                              {participant.present ? "Présent" : "Absent"}
                            </Badge>
                          </div>
                          <div>
                            {entree ? (
                              <span className="text-green-600 font-medium">{entree}</span>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => enregistrerPointage(participant.id, 'Entrée')}
                              >
                                Pointer
                              </Button>
                            )}
                          </div>
                          <div>
                            {sortie ? (
                              <span className="text-green-600 font-medium">{sortie}</span>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => enregistrerPointage(participant.id, 'Sortie')}
                                disabled={!entree}
                              >
                                Pointer
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historique">
            <Card>
              <CardHeader>
                <CardTitle>Historique des pointages</CardTitle>
                <CardDescription>
                  Consultez l'historique des pointages pour cette formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pointages.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                      <div>Participant</div>
                      <div>Date</div>
                      <div>Type</div>
                      <div>Heure</div>
                    </div>
                    
                    {pointages.map((pointage, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0">
                        <div>Participant {pointage.participantId}</div>
                        <div>{pointage.datePointage}</div>
                        <div>
                          <Badge variant={pointage.typePointage === 'Entrée' ? "outline" : "secondary"}>
                            {pointage.typePointage}
                          </Badge>
                        </div>
                        <div>{pointage.heure}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun pointage n'a encore été enregistré pour cette formation.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qrcode">
            <Card>
              <CardHeader>
                <CardTitle>QR Code pour pointage</CardTitle>
                <CardDescription>
                  Générez un QR code que les participants pourront scanner pour s'enregistrer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-6">
                  {qrCodeUrl ? (
                    <div className="p-6 border rounded-md bg-white">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code pour pointage" 
                        className="h-48 w-48"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Aucun QR code n'a encore été généré pour cette formation.</p>
                    </div>
                  )}
                  
                  <Button onClick={generateQrCode}>
                    <QrCode className="h-4 w-4 mr-2" />
                    {qrCodeUrl ? "Régénérer le QR code" : "Générer un QR code"}
                  </Button>
                  
                  {qrCodeUrl && (
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Affichez ce QR code à l'entrée de la salle de formation. Les participants pourront le scanner avec leur téléphone pour s'enregistrer automatiquement.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
