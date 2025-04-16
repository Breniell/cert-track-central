
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { Formation } from "@/types/Formation";

interface CalendarEventDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  event: Formation | null;
}

export function CalendarEventDetails({
  isOpen,
  onClose,
  event
}: CalendarEventDetailsProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event.titre}</DialogTitle>
          <DialogDescription>
            Détails de la formation
          </DialogDescription>
        </DialogHeader>
        {event && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Type</Label>
                <div className="font-medium">
                  <Badge variant={event.type === 'HSE' ? 'secondary' : 'success'}>
                    {event.type}
                  </Badge>
                  {event.estUrgente && (
                    <Badge variant="destructive" className="ml-2">
                      Urgente
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Statut</Label>
                <div className="font-medium">
                  <Badge variant={
                    event.statut === 'À venir' ? 'outline' : 
                    event.statut === 'En cours' ? 'default' :
                    event.statut === 'Terminée' ? 'success' : 'destructive'
                  }>
                    {event.statut}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <Label className="text-sm text-gray-500">Date</Label>
                <div className="font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {new Date(event.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Durée</Label>
                <div className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  {event.duree}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Lieu</Label>
                <div className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {event.lieu}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Participants</Label>
                <div className="font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  {event.participants} / {event.maxParticipants}
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
