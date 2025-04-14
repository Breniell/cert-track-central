
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, FileText, User, CheckCircle, AlertCircle, List } from "lucide-react";
import { Formation } from "@/types/Formation";

interface FormationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  formation: Formation | null;
  onRegister?: (id: number) => void;
  showRegisterButton?: boolean;
  showManageButton?: boolean;
  onManageParticipants?: (id: number) => void;
}

export default function FormationDetails({ 
  isOpen, 
  onClose, 
  formation,
  onRegister,
  showRegisterButton = false,
  showManageButton = false,
  onManageParticipants
}: FormationDetailsProps) {
  if (!formation) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Détails de la formation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeStyles(formation.type)}`}>
              {formation.type}
            </span>
            {formation.estUrgente && (
              <Badge variant="destructive" className="text-white">Urgente</Badge>
            )}
            <h3 className="text-xl font-semibold text-gray-900">{formation.titre}</h3>
            <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(formation.statut)}`}>
              {formation.statut}
            </span>
          </div>
          
          {formation.description && (
            <div className="mb-6 text-gray-700">
              <p>{formation.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">Date</p>
                <p>{new Date(formation.date).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">Durée</p>
                <p>{formation.duree}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">Lieu</p>
                <p>{formation.lieu}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <p className="font-medium">Formateur</p>
                <p>{formation.formateur}</p>
              </div>
            </div>
          </div>
          
          {formation.prerequis && formation.prerequis.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <List className="w-4 h-4 mr-2 text-gray-400" />
                Prérequis
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 pl-4">
                {formation.prerequis.map((prerequis, index) => (
                  <li key={index}>{prerequis}</li>
                ))}
              </ul>
            </div>
          )}
          
          {formation.objectifs && formation.objectifs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <List className="w-4 h-4 mr-2 text-gray-400" />
                Objectifs
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 pl-4">
                {formation.objectifs.map((objectif, index) => (
                  <li key={index}>{objectif}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Participants</h4>
              <Badge variant="outline">{formation.participants}/{formation.maxParticipants}</Badge>
            </div>
            
            <div className="mt-3 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 rounded-full bg-primary" 
                style={{ width: `${(formation.participants / formation.maxParticipants) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {formation.dateValidite && (
            <div className="flex items-center p-4 bg-green-50 rounded-lg mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <div>
                <p className="font-medium text-green-700">Validité de la formation</p>
                <p className="text-green-600">Valide jusqu'au {formation.dateValidite}</p>
              </div>
            </div>
          )}
          
          {formation.documentationRequise && (
            <div className={`flex items-center p-4 ${formation.documentsValides ? 'bg-green-50' : 'bg-amber-50'} rounded-lg`}>
              {formation.documentsValides ? (
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-500 mr-2" />
              )}
              <div>
                <p className={`font-medium ${formation.documentsValides ? 'text-green-700' : 'text-amber-700'}`}>
                  Documents administratifs
                </p>
                <p className={formation.documentsValides ? 'text-green-600' : 'text-amber-600'}>
                  {formation.documentsValides ? 'Documents vérifiés et approuvés' : 'Vérification de documents requise'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          
          {showRegisterButton && onRegister && formation.statut === 'À venir' && (
            <Button 
              onClick={() => {
                onRegister(formation.id);
                onClose();
              }}
              disabled={formation.participants >= formation.maxParticipants}
            >
              S'inscrire
            </Button>
          )}
          
          {showManageButton && onManageParticipants && (
            <Button onClick={() => {
              onManageParticipants(formation.id);
              onClose();
            }}>
              Gérer les participants
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
