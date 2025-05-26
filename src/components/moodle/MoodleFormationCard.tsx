
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Download, Edit } from "lucide-react";
import { Formation } from "../../types";
import { useMoodle } from "../../contexts/MoodleContext";
import { toast } from "@/hooks/use-toast";

interface MoodleFormationCardProps {
  formation: Formation;
  onEdit?: (formation: Formation) => void;
  onEnroll?: (formationId: string) => void;
  onViewDetails?: (formation: Formation) => void;
  showActions?: boolean;
}

export default function MoodleFormationCard({
  formation,
  onEdit,
  onEnroll,
  onViewDetails,
  showActions = true
}: MoodleFormationCardProps) {
  const { isTrainer, isRH } = useMoodle();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(formation.startDate);
    const endDate = new Date(formation.endDate);
    
    if (startDate > now) {
      return <Badge className="bg-green-500 text-white">À venir</Badge>;
    } else if (endDate > now) {
      return <Badge className="bg-blue-500 text-white">En cours</Badge>;
    } else {
      return <Badge className="bg-gray-500 text-white">Terminée</Badge>;
    }
  };

  const getModalityBadge = () => {
    return formation.modality === 'online' ? (
      <Badge variant="outline" className="text-blue-600 border-blue-600">En ligne</Badge>
    ) : (
      <Badge variant="outline" className="text-green-600 border-green-600">Présentiel</Badge>
    );
  };

  const handleEnroll = async () => {
    if (!onEnroll) return;
    
    setIsEnrolling(true);
    try {
      await onEnroll(formation.id);
      toast({
        title: "Inscription réussie",
        description: `Vous êtes maintenant inscrit à "${formation.title}"`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Impossible de vous inscrire à cette formation"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const isFormationFull = formation.participants.length >= formation.maxParticipants;
  const canEdit = isTrainer;
  const canEnroll = !isTrainer && !isRH && formation.status === 'upcoming' && !isFormationFull;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              {getStatusBadge()}
              {getModalityBadge()}
            </div>
            <CardTitle className="text-lg text-gray-900">{formation.title}</CardTitle>
            <CardDescription className="mt-1">{formation.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(formation.startDate)}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(formation.startDate)} - {formatTime(formation.endDate)}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {formation.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              {formation.participants.length} / {formation.maxParticipants} participants
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Formateur:</span> {formation.trainerName}
          </div>

          {showActions && (
            <div className="flex gap-2 pt-3 border-t">
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(formation)}
                    className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Participants
                  </Button>
                </>
              )}

              {canEnroll && (
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling || isFormationFull}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  {isEnrolling ? "Inscription..." : "S'inscrire"}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails?.(formation)}
                className="text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white"
              >
                Détails
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
