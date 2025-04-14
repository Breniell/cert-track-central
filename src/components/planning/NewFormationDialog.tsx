
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface NewFormationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formationData: any) => void;
}

export default function NewFormationDialog({ isOpen, onClose, onSave }: NewFormationDialogProps) {
  const [titre, setTitre] = useState("");
  const [type, setType] = useState<"HSE" | "Métier">("HSE");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [duree, setDuree] = useState("8h");
  const [lieu, setLieu] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [formateur, setFormateur] = useState("");
  const [estUrgente, setEstUrgente] = useState(false);
  const [documentsRequis, setDocumentsRequis] = useState(false);
  
  const handleSave = () => {
    const newFormation = {
      titre,
      type,
      date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      duree,
      lieu,
      maxParticipants,
      formateur,
      participants: 0,
      statut: "À venir",
      estUrgente,
      documentationRequise: documentsRequis,
      documentsValides: false
    };
    
    onSave(newFormation);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTitre("");
    setType("HSE");
    setDate(new Date());
    setDuree("8h");
    setLieu("");
    setMaxParticipants(10);
    setFormateur("");
    setEstUrgente(false);
    setDocumentsRequis(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle formation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="titre">Titre de la formation</Label>
            <Input 
              id="titre" 
              value={titre} 
              onChange={(e) => setTitre(e.target.value)} 
              placeholder="Saisir le titre de la formation"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de formation</Label>
              <Select value={type} onValueChange={(value: "HSE" | "Métier") => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HSE">HSE</SelectItem>
                  <SelectItem value="Métier">Métier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date de la formation</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {date ? format(date, 'dd/MM/yyyy') : "Sélectionnez une date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duree">Durée</Label>
              <Select value={duree} onValueChange={setDuree}>
                <SelectTrigger>
                  <SelectValue placeholder="Durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4h">4 heures</SelectItem>
                  <SelectItem value="8h">8 heures</SelectItem>
                  <SelectItem value="16h">16 heures</SelectItem>
                  <SelectItem value="24h">24 heures</SelectItem>
                  <SelectItem value="32h">32 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu</Label>
              <Input 
                id="lieu" 
                value={lieu} 
                onChange={(e) => setLieu(e.target.value)} 
                placeholder="Saisir le lieu"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="formateur">Formateur</Label>
              <Input 
                id="formateur" 
                value={formateur} 
                onChange={(e) => setFormateur(e.target.value)} 
                placeholder="Nom du formateur"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Nombre max. de participants</Label>
              <Input 
                id="maxParticipants" 
                type="number" 
                value={maxParticipants.toString()} 
                onChange={(e) => setMaxParticipants(Number(e.target.value))} 
                min={1} 
                max={50}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="estUrgente" 
                checked={estUrgente} 
                onCheckedChange={(checked) => setEstUrgente(checked as boolean)} 
              />
              <Label htmlFor="estUrgente" className="text-sm">Formation urgente</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="documentsRequis" 
                checked={documentsRequis} 
                onCheckedChange={(checked) => setDocumentsRequis(checked as boolean)} 
              />
              <Label htmlFor="documentsRequis" className="text-sm">Documents requis</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave} disabled={!titre || !lieu || !formateur}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
