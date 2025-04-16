
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Formation } from "@/types/Formation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface FormationCardProps {
  formation: Formation;
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function FormationCard({ formation, onViewDetails, onEdit }: FormationCardProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'HSE':
        return 'bg-blue-100 text-blue-700';
      case 'Métier':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusStyles = (statut: string) => {
    switch (statut) {
      case 'À venir':
        return 'bg-blue-100 text-blue-700';
      case 'En cours':
        return 'bg-green-100 text-green-700';
      case 'Terminée':
        return 'bg-gray-100 text-gray-700';
      case 'Annulée':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={getTypeStyles(formation.type)}>
                {formation.type}
              </Badge>
              {formation.estUrgente && (
                <Badge variant="destructive" className="text-white">Urgente</Badge>
              )}
              <Badge variant="outline" className={`ml-auto ${getStatusStyles(formation.statut)}`}>
                {formation.statut}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{formation.titre}</h3>
            <p className="text-sm text-gray-500 mb-4">Formateur: {formation.formateur}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{new Date(formation.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{formation.duree}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{formation.lieu}</span>
              </div>
            </div>
            
            {formation.dateValidite && (
              <div className="mt-3 flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                <span>Validité jusqu'au: {formation.dateValidite}</span>
              </div>
            )}
            
            {formation.documentationRequise && (
              <div className="mt-3 flex items-center text-sm">
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                {formation.documentsValides ? (
                  <span className="text-green-600">Documents vérifiés</span>
                ) : (
                  <span className="text-amber-600">Vérification de documents requise</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-3 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          <span className={formation.participants >= formation.maxParticipants ? "text-red-600 font-medium" : ""}>
            {formation.participants}/{formation.maxParticipants} participants
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onViewDetails(formation.id)}>
            Détails
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(formation.id)}>
            Modifier
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
