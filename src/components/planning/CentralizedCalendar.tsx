
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Formation, FormationType } from "@/types/Formation";
import { CalendarIcon } from "lucide-react";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarFilters } from "./CalendarFilters";
import { CalendarEventDetails } from "./CalendarEventDetails";
import { CalendarLegend } from "./CalendarLegend";
import { formationService } from "@/services/formationService";
import { addDays } from "date-fns";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event: any) => {
  let backgroundColor = '#9b87f5';
  
  switch (event.type) {
    case 'HSE':
      backgroundColor = '#06b6d4';
      break;
    case 'Métier':
      backgroundColor = '#10b981';
      break;
    case 'Urgente':
      backgroundColor = '#ef4444';
      break;
    default:
      backgroundColor = '#9b87f5';
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
  const [selectedEvent, setSelectedEvent] = useState<Formation | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<{
    types: FormationType[];
    formateurs: string[];
    lieux: string[];
    urgence: boolean;
  }>({
    types: ["HSE", "Métier"],
    formateurs: [],
    lieux: [],
    urgence: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const formations = await formationService.getAllFormations();
        
        const calendarEvents = formations.map(formation => ({
          id: formation.id,
          title: formation.title,
          start: new Date(formation.startDate),
          end: addDays(new Date(formation.startDate), 1),
          type: formation.modality === 'HSE' ? 'HSE' : 'Métier',
          formateur: formation.trainerId,
          lieu: formation.location,
          participants: 0,
          maxParticipants: formation.maxParticipants,
          statut: formation.status,
          estUrgente: false,
          formation: formation
        }));
        
        setEvents(calendarEvents);
        
        // Fix type issues by ensuring proper string types
        const uniqueFormateurs = [...new Set(formations.map(f => f.trainerId))]
          .filter((nom): nom is string => typeof nom === 'string')
          .map((nom, index) => ({
            id: index + 1,
            nom
          }));
        setFormateurs(uniqueFormateurs);
        
        const uniqueLieux = [...new Set(formations.map(f => f.location))]
          .filter((lieu): lieu is string => typeof lieu === 'string');
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

  const filteredEvents = events.filter(event => {
    if (filters.types.length > 0 && !filters.types.includes(event.type)) {
      return false;
    }
    if (filters.formateurs.length > 0 && !filters.formateurs.includes(event.formateur)) {
      return false;
    }
    if (filters.lieux.length > 0 && !filters.lieux.includes(event.lieu)) {
      return false;
    }
    if (filters.urgence && !event.estUrgente) {
      return false;
    }
    return true;
  });

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.formation);
    setIsEventDetailsOpen(true);
    if (onEventSelect) {
      onEventSelect(event.formation);
    }
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: string) => {
    setView(newView);
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
                toolbar: (toolbarProps) => (
                  <CalendarToolbar
                    {...toolbarProps}
                    onShowFilters={() => setIsFilterDialogOpen(true)}
                    onNewEvent={onNewEvent}
                  />
                ),
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
            />
          </div>
          <CalendarLegend />
        </CardContent>
      </Card>

      <CalendarFilters
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={filters}
        formateurs={formateurs}
        lieux={lieux}
        onFiltersChange={setFilters}
        onReset={() => {
          setFilters({
            types: ["HSE", "Métier"],
            formateurs: [],
            lieux: [],
            urgence: false
          });
        }}
      />

      <CalendarEventDetails
        isOpen={isEventDetailsOpen}
        onClose={() => setIsEventDetailsOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
