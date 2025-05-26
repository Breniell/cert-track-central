
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Download, Edit } from "lucide-react";
import { MoodleFormation } from "@/services/moodleApi";
import { useMoodle } from "@/contexts/MoodleContext";
import { toast } from "@/hooks/use-toast";

interface MoodleFormationCardProps {
  formation: MoodleFormation;
  onEdit?: (formation: MoodleFormation) => void;
  onEnroll?: (formationId: number) => void;
  onViewDetails?: (formation: MoodleFormation) => void;
  showActions?: boolean;
}

export default function MoodleFormationCard({
  formation,
  onEdit,
  onEnroll,
  onViewDetails,
  showActions = true
}: MoodleFormationCardProps) {
  const { isTrainer, isRH, hasCapability } = useMoodle();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    const now = Date.now() / 1000;
    if (formation.startdate > now) {
      return <Badge className="bg-cimencam-green text-white">À venir</Badge>;
    } else if (formation.enddate > now) {
      return <Badge className="bg-blue-500 text-white">En cours</Badge>;
    } else {
      return <Badge className="bg-gray-500 text-white">Terminée</Badge>;
    }
  };

  const getModalityBadge = () => {
    return formation.modality === 'online' ? (
      <Badge variant="outline" className="text-blue-600 border-blue-600">En ligne</Badge>
    ) : (
      <Badge variant="outline" className="text-cimencam-green border-cimencam-green">Présentiel</Badge>
    );
  };

  const handleEnroll = async () => {
    if (!onEnroll) return;
    
    setIsEnrolling(true);
    try {
      await onEnroll(formation.id);
      toast({
        title: "Inscription réussie",
        description: `Vous êtes maintenant inscrit à "${formation.name}"`
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

  const isFormationFull = formation.enrolled >= formation.capacity;
  const canEdit = isTrainer && hasCapability('local/cimencamplus:manage_formations');
  const canEnroll = !isTrainer && !isRH && formation.startdate > Date.now() / 1000 && !isFormationFull;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              {getStatusBadge()}
              {getModalityBadge()}
              <Badge variant="outline" className="text-cimencam-gray">
                {formation.category}
              </Badge>
            </div>
            <CardTitle className="text-lg text-cimencam-gray">{formation.name}</CardTitle>
            <CardDescription className="mt-1">{formation.summary}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(formation.startdate)}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(formation.startdate)} - {formatTime(formation.enddate)}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {formation.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              {formation.enrolled} / {formation.capacity} participants
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Formateur:</span> {formation.trainer_name}
          </div>

          {showActions && (
            <div className="flex gap-2 pt-3 border-t">
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(formation)}
                    className="text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-cimencam-gray border-cimencam-gray hover:bg-cimencam-gray hover:text-white"
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
                  className="bg-cimencam-green hover:bg-green-600 text-white"
                  size="sm"
                >
                  {isEnrolling ? "Inscription..." : "S'inscrire"}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails?.(formation)}
                className="text-cimencam-gray border-cimencam-gray hover:bg-cimencam-gray hover:text-white"
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
