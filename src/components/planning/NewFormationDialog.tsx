
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface NewFormationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewFormationDialog({ open, onOpenChange }: NewFormationDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<string>("HSE");
  const [titre, setTitre] = useState<string>("");
  const [lieu, setLieu] = useState<string>("");
  const [formateur, setFormateur] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<string>("10");
  const [duree, setDuree] = useState<string>("8h");
  const [description, setDescription] = useState<string>("");
  const [estUrgente, setEstUrgente] = useState<boolean>(false);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici, on simule l'ajout d'une formation
    toast({
      title: "Formation créée",
      description: `La formation "${titre}" a été ajoutée au planning.`,
    });
    
    // Réinitialiser le formulaire et fermer le dialogue
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDate(new Date());
    setType("HSE");
    setTitre("");
    setLieu("");
    setFormateur("");
    setMaxParticipants("10");
    setDuree("8h");
    setDescription("");
    setEstUrgente(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouvelle formation</DialogTitle>
            <DialogDescription>
              Créez une nouvelle session de formation en remplissant les informations ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de formation</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HSE">HSE</SelectItem>
                    <SelectItem value="Métier">Métier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="titre">Titre de la formation</Label>
              <Input
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex: Sécurité en hauteur"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lieu">Lieu</Label>
                <Input
                  id="lieu"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  placeholder="Ex: Salle 102"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="formateur">Formateur</Label>
                <Input
                  id="formateur"
                  value={formateur}
                  onChange={(e) => setFormateur(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Nombre maximum de participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duree">Durée</Label>
                <Input
                  id="duree"
                  value={duree}
                  onChange={(e) => setDuree(e.target.value)}
                  placeholder="Ex: 8h"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails de la formation..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="urgente"
                checked={estUrgente}
                onCheckedChange={setEstUrgente}
              />
              <Label htmlFor="urgente">Formation urgente</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer la formation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
