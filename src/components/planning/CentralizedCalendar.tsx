import { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import moment from "moment";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Filter, Plus, Users, MapPin, Clock } from "lucide-react";
import { Formation, FormationType } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import { formateurService } from "@/services/formateurService";

import "react-big-calendar/lib/css/react-big-calendar.css";

// Configurer le localisateur pour le calendrier
const localizer = momentLocalizer(moment);

// Style pour les événements du calendrier
const eventStyleGetter = (event: any) => {
  let backgroundColor = '#9b87f5'; // Couleur par défaut (primaire)
  
  // Déterminer la couleur en fonction du type de formation
  switch (event.type) {
    case 'HSE':
      backgroundColor = '#06b6d4'; // Cyan
      break;
    case 'Métier':
      backgroundColor = '#10b981'; // Émeraude
      break;
    case 'Urgente':
      backgroundColor = '#ef4444'; // Rouge
      break;
    default:
      backgroundColor = '#9b87f5'; // Primaire
  }

  const style = {
    backgroundColor,
    borderRadius: '4px',
    opacity: 0.95,
    color: 'white',
    border: '0',
    display: 'block',
    padding: '2px 5px'
  };
  
  return {
    style
  };
};

// Type pour les filtres
interface CalendarFilters {
  types: FormationType[];
  formateurs: string[];
  lieux: string[];
  urgence: boolean;
}

// Propriétés du composant
interface CentralizedCalendarProps {
  onEventSelect?: (formation: Formation) => void;
  onNewEvent?: () => void;
}

export function CentralizedCalendar({ onEventSelect, onNewEvent }: CentralizedCalendarProps) {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState<any[]>([]);
  const [formateurs, setFormateurs] = useState<{id: number; nom: string}[]>([]);
  const [lieux, setLieux] = useState<string[]>([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    types: ["HSE", "Métier"],
    formateurs: [],
    lieux: [],
    urgence: false
  });
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Formation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données des formations
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les formations
        const formations = await formationService.getAllFormations();
        
        // Transformer les formations en événements pour le calendrier
        const calendarEvents = formations.map(formation => ({
          id: formation.id,
          title: formation.titre,
          start: new Date(formation.date),
          end: addDays(new Date(formation.date), 1), // Par défaut 1 jour, à ajuster selon la durée
          type: formation.type,
          formateur: formation.formateur,
          lieu: formation.lieu,
          participants: formation.participants,
          maxParticipants: formation.maxParticipants,
          statut: formation.statut,
          estUrgente: formation.estUrgente,
          formation: formation // Conserver l'objet formation complet
        }));
        
        setEvents(calendarEvents);
        
        // Extraire la liste des formateurs unique des formations
        const uniqueFormateurs = [...new Set(formations.map(f => f.formateur))].map((nom, index) => ({
          id: index + 1,
          nom
        }));
        setFormateurs(uniqueFormateurs);
        
        // Extraire la liste des lieux unique des formations
        const uniqueLieux = [...new Set(formations.map(f => f.lieu))];
        setLieux(uniqueLieux);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données du calendrier."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filtrer les événements selon les critères
  const filteredEvents = events.filter(event => {
    // Filtre par type de formation
    if (filters.types.length > 0 && !filters.types.includes(event.type as FormationType)) {
      return false;
    }
    
    // Filtre par formateur
    if (filters.formateurs.length > 0 && !filters.formateurs.includes(event.formateur)) {
      return false;
    }
    
    // Filtre par lieu
    if (filters.lieux.length > 0 && !filters.lieux.includes(event.lieu)) {
      return false;
    }
    
    // Filtre par urgence
    if (filters.urgence && !event.estUrgente) {
      return false;
    }
    
    return true;
  });

  // Gestionnaire de sélection d'un événement
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.formation);
    setIsEventDetailsOpen(true);
    
    if (onEventSelect) {
      onEventSelect(event.formation);
    }
  };

  // Gestionnaire de navigation dans le calendrier
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  // Gestionnaire de changement de vue du calendrier
  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  // Appliquer les filtres
  const applyFilters = (newFilters: CalendarFilters) => {
    setFilters(newFilters);
    setIsFilterDialogOpen(false);
    
    toast({
      title: "Filtres appliqués",
      description: `${newFilters.types.length} types de formation, ${newFilters.formateurs.length} formateurs, ${newFilters.lieux.length} lieux.`
    });
  };

  // Gestionnaire pour le changement de type de formation dans le filtre
  const handleTypeChange = (type: FormationType) => {
    setFilters(prev => {
      const types = prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  };

  // Gestionnaire pour le changement de formateur dans le filtre
  const handleFormateurChange = (formateurNom: string) => {
    setFilters(prev => {
      const formateurs = prev.formateurs.includes(formateurNom)
        ? prev.formateurs.filter(f => f !== formateurNom)
        : [...prev.formateurs, formateurNom];
      return { ...prev, formateurs };
    });
  };

  // Gestionnaire pour le changement de lieu dans le filtre
  const handleLieuChange = (lieu: string) => {
    setFilters(prev => {
      const lieux = prev.lieux.includes(lieu)
        ? prev.lieux.filter(l => l !== lieu)
        : [...prev.lieux, lieu];
      return { ...prev, lieux };
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      types: ["HSE", "Métier"],
      formateurs: [],
      lieux: [],
      urgence: false
    });
  };

  // Personnalisation du header pour le mois
  const customToolbar = (toolbar: any) => {
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToPrev = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const label = () => {
      const date = toolbar.date;
      const dateFormat = 'MMMM yyyy';
      return format(date, dateFormat, { locale: fr });
    };

    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrev}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold capitalize">{label()}</h2>
        <div className="flex items-center gap-2">
          <Select
            value={view}
            onValueChange={value => toolbar.onView(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          {onNewEvent && (
            <Button size="sm" onClick={onNewEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle formation
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Affichage des filtres actifs
  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.types.length < 2) {
      activeFilters.push(
        <Badge key="type" variant="secondary" className="flex items-center gap-1">
          Types: {filters.types.join(', ')}
        </Badge>
      );
    }
    
    if (filters.formateurs.length > 0) {
      activeFilters.push(
        <Badge key="formateur" variant="secondary" className="flex items-center gap-1">
          Formateurs: {filters.formateurs.length}
        </Badge>
      );
    }
    
    if (filters.lieux.length > 0) {
      activeFilters.push(
        <Badge key="lieu" variant="secondary" className="flex items-center gap-1">
          Lieux: {filters.lieux.length}
        </Badge>
      );
    }
    
    if (filters.urgence) {
      activeFilters.push(
        <Badge key="urgence" variant="secondary" className="flex items-center gap-1">
          Urgentes uniquement
        </Badge>
      );
    }
    
    if (activeFilters.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {activeFilters}
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 py-0">
          Réinitialiser
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center text-xl">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendrier des Formations
          </CardTitle>
          <CardDescription>
            Planification et suivi centralisé des sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderActiveFilters()}
          
          <div style={{ height: 700 }}>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              date={date}
              onNavigate={handleNavigate}
              view={view as any}
              onView={handleViewChange as any}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: customToolbar as any,
              }}
              messages={{
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                agenda: 'Agenda',
                today: "Aujourd'hui",
                next: 'Suivant',
                previous: 'Précédent',
                noEventsInRange: 'Aucune formation sur cette période',
              }}
              dayPropGetter={(date) => {
                const today = new Date();
                if (date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()) {
                  return {
                    className: 'rbc-today',
                    style: { backgroundColor: '#f9fafb' }
                  };
                }
                return {};
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
              <span className="text-sm">HSE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-sm">Métier</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
              <span className="text-sm">Urgente</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog de filtres */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filtres du calendrier</DialogTitle>
            <DialogDescription>
              Sélectionnez les critères pour filtrer les formations affichées
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Type de formation</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="type-hse" 
                    checked={filters.types.includes('HSE')}
                    onCheckedChange={() => handleTypeChange('HSE')}
                  />
                  <label htmlFor="type-hse" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    HSE
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="type-metier" 
                    checked={filters.types.includes('Métier')}
                    onCheckedChange={() => handleTypeChange('Métier')}
                  />
                  <label htmlFor="type-metier" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Métier
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Formateurs</h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {formateurs.map(formateur => (
                  <div key={formateur.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`formateur-${formateur.id}`} 
                      checked={filters.formateurs.includes(formateur.nom)}
                      onCheckedChange={() => handleFormateurChange(formateur.nom)}
                    />
                    <label 
                      htmlFor={`formateur-${formateur.id}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {formateur.nom}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Lieu</h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {lieux.map((lieu, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`lieu-${index}`} 
                      checked={filters.lieux.includes(lieu)}
                      onCheckedChange={() => handleLieuChange(lieu)}
                    />
                    <label 
                      htmlFor={`lieu-${index}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {lieu}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="urgence" 
                checked={filters.urgence}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, urgence: checked === true }))}
              />
              <label 
                htmlFor="urgence" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Formations urgentes uniquement
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Button onClick={() => applyFilters(filters)}>
              Appliquer les filtres
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de détails d'événement */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.titre}</DialogTitle>
            <DialogDescription>
              Détails de la formation
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Type</Label>
                  <div className="font-medium">
                    <Badge variant={selectedEvent.type === 'HSE' ? 'secondary' : 'success'}>
                      {selectedEvent.type}
                    </Badge>
                    {selectedEvent.estUrgente && (
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
                      selectedEvent.statut === 'À venir' ? 'outline' : 
                      selectedEvent.statut === 'En cours' ? 'default' :
                      selectedEvent.statut === 'Terminée' ? 'success' : 'destructive'
                    }>
                      {selectedEvent.statut}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Date</Label>
                <div className="font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Durée</Label>
                <div className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  {selectedEvent.duree}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Formateur</Label>
                <div className="font-medium">{selectedEvent.formateur}</div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Lieu</Label>
                <div className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {selectedEvent.lieu}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Participants</Label>
                <div className="font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  {selectedEvent.participants} / {selectedEvent.maxParticipants}
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <Label className="text-sm text-gray-500">Description</Label>
                  <p className="text-sm mt-1">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsEventDetailsOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
