
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { fr } from "date-fns/locale";

interface Session {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  trainer: string;
  type: 'available' | 'booked' | 'unavailable';
}

interface SessionCalendarProps {
  trainerId?: string;
  isTrainerView?: boolean;
  onSessionSelect?: (session: Session) => void;
}

export default function SessionCalendar({ 
  trainerId, 
  isTrainerView = false, 
  onSessionSelect 
}: SessionCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Simuler des sessions
  const [sessions] = useState<Session[]>([
    {
      id: 1,
      title: "Sécurité en hauteur",
      date: new Date(2024, 2, 15),
      startTime: "08:00",
      endTime: "12:00",
      location: "Salle A",
      trainer: "Jean Dupont",
      type: 'booked'
    },
    {
      id: 2,
      title: "Disponible",
      date: new Date(2024, 2, 16),
      startTime: "14:00",
      endTime: "17:00",
      location: "Salle B",
      trainer: "Jean Dupont",
      type: 'available'
    },
    {
      id: 3,
      title: "Manipulation produits chimiques",
      date: new Date(2024, 2, 18),
      startTime: "09:00",
      endTime: "16:00",
      location: "Laboratoire",
      trainer: "Marie Martin",
      type: 'booked'
    },
    {
      id: 4,
      title: "Congé",
      date: new Date(2024, 2, 20),
      startTime: "00:00",
      endTime: "23:59",
      location: "-",
      trainer: "Jean Dupont",
      type: 'unavailable'
    }
  ]);

  const filteredSessions = trainerId 
    ? sessions.filter(s => s.trainer === trainerId || s.trainer === "Jean Dupont")
    : sessions;

  const getSessionsForDate = (date: Date) => {
    return filteredSessions.filter(session => 
      session.date.toDateString() === date.toDateString()
    );
  };

  const getSessionTypeColor = (type: Session['type']) => {
    switch (type) {
      case 'available':
        return 'bg-cimencam-green text-white';
      case 'booked':
        return 'bg-blue-500 text-white';
      case 'unavailable':
        return 'bg-cimencam-red text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSessionTypeLabel = (type: Session['type']) => {
    switch (type) {
      case 'available':
        return 'Disponible';
      case 'booked':
        return 'Réservé';
      case 'unavailable':
        return 'Indisponible';
      default:
        return 'Inconnu';
    }
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  const modifiers = {
    hasSession: filteredSessions.map(s => s.date),
    available: filteredSessions.filter(s => s.type === 'available').map(s => s.date),
    booked: filteredSessions.filter(s => s.type === 'booked').map(s => s.date),
    unavailable: filteredSessions.filter(s => s.type === 'unavailable').map(s => s.date)
  };

  const modifiersStyles = {
    hasSession: { fontWeight: 'bold' },
    available: { backgroundColor: '#28a745', color: 'white' },
    booked: { backgroundColor: '#007bff', color: 'white' },
    unavailable: { backgroundColor: '#dc3545', color: 'white' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendrier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-cimencam-gray">
            <CalendarIcon className="w-5 h-5 mr-2" />
            {isTrainerView ? "Mes disponibilités" : "Planning des sessions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            locale={fr}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
          
          {/* Légende */}
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm text-cimencam-gray">Légende:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cimencam-green text-white">Disponible</Badge>
              <Badge className="bg-blue-500 text-white">Réservé</Badge>
              <Badge className="bg-cimencam-red text-white">Indisponible</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails du jour sélectionné */}
      <Card>
        <CardHeader>
          <CardTitle className="text-cimencam-gray">
            {selectedDate 
              ? `Sessions du ${selectedDate.toLocaleDateString('fr-FR')}`
              : "Sélectionnez une date"
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateSessions.length > 0 ? (
            <div className="space-y-3">
              {selectedDateSessions.map(session => (
                <div 
                  key={session.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSessionSelect?.(session)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-cimencam-gray">{session.title}</h4>
                    <Badge className={getSessionTypeColor(session.type)}>
                      {getSessionTypeLabel(session.type)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {session.startTime} - {session.endTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {session.location}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {session.trainer}
                    </div>
                  </div>
                  
                  {session.type === 'available' && isTrainerView && (
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
                      >
                        Modifier la disponibilité
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedDate 
                ? "Aucune session prévue ce jour"
                : "Sélectionnez une date pour voir les sessions"
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
