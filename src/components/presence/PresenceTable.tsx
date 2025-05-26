
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Participant {
  id: number;
  nom: string;
  email: string;
  service: string;
  present: boolean;
  heureArrivee?: string;
}

interface PresenceTableProps {
  formationId: number;
  formationTitle: string;
  isSessionActive: boolean;
  onToggleSession: () => void;
}

export default function PresenceTable({ 
  formationId, 
  formationTitle, 
  isSessionActive, 
  onToggleSession 
}: PresenceTableProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 1,
      nom: "John Doe",
      email: "john.doe@cimencam.cm",
      service: "Production",
      present: true,
      heureArrivee: "08:15"
    },
    {
      id: 2,
      nom: "Jane Smith",
      email: "jane.smith@cimencam.cm",
      service: "Qualité",
      present: true,
      heureArrivee: "08:20"
    },
    {
      id: 3,
      nom: "Alice Brown",
      email: "alice.brown@cimencam.cm",
      service: "Maintenance",
      present: false
    },
    {
      id: 4,
      nom: "Bob Wilson",
      email: "bob.wilson@cimencam.cm",
      service: "IT",
      present: true,
      heureArrivee: "08:10"
    }
  ]);

  const [sessionCode] = useState("FORM2024");

  const presentCount = participants.filter(p => p.present).length;
  const totalCount = participants.length;

  const handleExportPresences = () => {
    const csvContent = [
      "Nom,Email,Service,Présence,Heure d'arrivée",
      ...participants.map(p => 
        `"${p.nom}","${p.email}","${p.service}","${p.present ? 'Présent' : 'Absent'}","${p.heureArrivee || 'N/A'}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presences_${formationTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export réussi",
      description: "La liste des présences a été téléchargée"
    });
  };

  const togglePresence = (participantId: number) => {
    setParticipants(prev => 
      prev.map(p => {
        if (p.id === participantId) {
          const newPresent = !p.present;
          return {
            ...p,
            present: newPresent,
            heureArrivee: newPresent && !p.heureArrivee 
              ? new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : p.heureArrivee
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Contrôles de session */}
      <Card className={isSessionActive ? "border-cimencam-green" : "border-gray-200"}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-cimencam-gray">
              <Clock className="w-5 h-5 mr-2" />
              Session de pointage
            </CardTitle>
            <Badge 
              variant={isSessionActive ? "default" : "secondary"}
              className={isSessionActive ? "bg-cimencam-green" : ""}
            >
              {isSessionActive ? "Session active" : "Session fermée"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium text-cimencam-gray">{formationTitle}</h3>
              {isSessionActive && (
                <p className="text-sm text-gray-600 mt-1">
                  Code de session: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{sessionCode}</span>
                </p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600">
                  <Users className="w-4 h-4 inline mr-1" />
                  {presentCount}/{totalCount} présents
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cimencam-green transition-all duration-300"
                    style={{ width: `${(presentCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportPresences}
                className="text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
              <Button
                onClick={onToggleSession}
                className={isSessionActive 
                  ? "bg-cimencam-red hover:bg-red-600 text-white" 
                  : "bg-cimencam-green hover:bg-green-600 text-white"
                }
              >
                {isSessionActive ? "Fermer la session" : "Ouvrir la session"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des présences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-cimencam-gray">Liste des participants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Heure d'arrivée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map(participant => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{participant.nom}</div>
                      <div className="text-sm text-gray-500">{participant.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{participant.service}</TableCell>
                  <TableCell>
                    {participant.heureArrivee ? (
                      <span className="font-mono text-sm">{participant.heureArrivee}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={participant.present ? "default" : "secondary"}
                      className={participant.present ? "bg-cimencam-green" : "bg-cimencam-red text-white"}
                    >
                      <span className="flex items-center">
                        {participant.present ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {participant.present ? "Présent" : "Absent"}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isSessionActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePresence(participant.id)}
                        className={participant.present 
                          ? "text-cimencam-red border-cimencam-red hover:bg-cimencam-red hover:text-white"
                          : "text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
                        }
                      >
                        {participant.present ? "Marquer absent" : "Marquer présent"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
