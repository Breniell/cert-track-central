
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Formation } from "@/types/Formation";

interface FormationCardProps {
  formation: Formation;
  onViewDetails?: (id: number) => void;
  onEdit?: (id: number) => void;
  onRegister?: (id: number) => void;
  showRegisterButton?: boolean;
  showEditButton?: boolean;
}

export default function FormationCard({ 
  formation, 
  onViewDetails, 
  onEdit, 
  onRegister, 
  showRegisterButton = false,
  showEditButton = false
}: FormationCardProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'HSE':
        return 'bg-ctc-hse-light text-ctc-hse';
      case 'Métier':
        return 'bg-ctc-metier-light text-ctc-metier';
      case 'Urgente':
        return 'bg-red-100 text-red-700';
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
    <div className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeStyles(formation.type)}`}>
              {formation.type}
            </span>
            {formation.estUrgente && (
              <Badge variant="destructive" className="text-white">Urgente</Badge>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{formation.titre}</h3>
            <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(formation.statut)}`}>
              {formation.statut}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Formateur: {formation.formateur}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              {new Date(formation.date).toLocaleDateString('fr-FR')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              {formation.duree}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {formation.lieu}
            </div>
          </div>
          
          {formation.dateValidite && (
            <div className="mt-3 flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Validité jusqu'au: {formation.dateValidite}
            </div>
          )}
          
          {formation.documentationRequise && (
            <div className="mt-3 flex items-center text-sm">
              <FileText className="w-4 h-4 mr-2" />
              {formation.documentsValides ? (
                <span className="text-green-600">Documents vérifiés</span>
              ) : (
                <span className="text-amber-600">Vérification de documents requise</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            {formation.participants}/{formation.maxParticipants} participants
          </div>
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(formation.id)}>
                Détails
              </Button>
            )}
            {showEditButton && onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(formation.id)}>
                Modifier
              </Button>
            )}
            {showRegisterButton && onRegister && formation.statut === 'À venir' && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onRegister(formation.id)}
                disabled={formation.participants >= formation.maxParticipants}
              >
                S'inscrire
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
