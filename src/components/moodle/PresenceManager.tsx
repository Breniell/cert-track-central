
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { useMoodle } from "../../contexts/MoodleContext";
import { toast } from "@/hooks/use-toast";

interface PresenceManagerProps {
  formationId: string;
  sessionId?: string;
  isTrainerView?: boolean;
}

interface AttendanceRecord {
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  status: 'present' | 'absent' | 'late';
  timestamp?: number;
}

export default function PresenceManager({ 
  formationId, 
  sessionId, 
  isTrainerView = false 
}: PresenceManagerProps) {
  const { user, isTrainer } = useMoodle();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [pinCode, setPinCode] = useState("");
  const [sessionPinCode, setSessionPinCode] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startAttendanceSession = async () => {
    if (!isTrainer) return;

    setIsLoading(true);
    try {
      const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
      setSessionPinCode(generatedPin);
      
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSessionActive(true);
      toast({
        title: "Session de présence démarrée",
        description: `Code PIN: ${generatedPin}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de démarrer la session de présence"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markPresence = async () => {
    if (!user || !sessionId) return;

    setIsLoading(true);
    try {
      // Simuler la vérification du code PIN
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (pinCode === sessionPinCode) {
        toast({
          title: "Présence marquée",
          description: "Votre présence a été enregistrée avec succès"
        });
        setPinCode("");
      } else {
        throw new Error("Code PIN incorrect");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Code PIN incorrect ou session expirée"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500 text-white">Présent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500 text-white">Retard</Badge>;
      default:
        return <Badge className="bg-red-500 text-white">Absent</Badge>;
    }
  };

  if (isTrainerView && isTrainer) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Users className="w-5 h-5 mr-2" />
              Gestion des présences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isSessionActive ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Aucune session de présence active
                </p>
                <Button
                  onClick={startAttendanceSession}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isLoading ? "Démarrage..." : "Démarrer une session"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">
                    Session active
                  </h4>
                  <p className="text-lg font-mono bg-white p-2 rounded border">
                    Code PIN: <strong>{sessionPinCode}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Communiquez ce code aux participants pour qu'ils marquent leur présence
                  </p>
                </div>

                {attendanceRecords.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Présences en temps réel
                    </h4>
                    {attendanceRecords.map((record) => (
                      <div key={record.user_id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <span className="ml-3 font-medium">
                            {record.firstname} {record.lastname}
                          </span>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vue apprenant
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">Marquer ma présence</CardTitle>
      </CardHeader>
      <CardContent>
        {isSessionActive ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Entrez le code PIN communiqué par votre formateur pour marquer votre présence
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Code PIN"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                maxLength={4}
                className="text-center text-lg font-mono"
              />
              <Button
                onClick={markPresence}
                disabled={isLoading || pinCode.length !== 4}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isLoading ? "Vérification..." : "Je suis présent"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Aucune session de présence active</p>
            <p className="text-sm mt-2">
              Attendez que votre formateur démarre la session
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
