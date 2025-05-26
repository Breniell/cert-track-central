
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";

interface Disponibilite {
  debut: string;
  fin: string;
  type?: string;
}

interface Formateur {
  id: number;
  nom: string;
  prenom: string;
  disponibilites?: Disponibilite[];
}

interface FormateurAvailabilityCalendarProps {
  formateur: Formateur;
  onAddAvailability?: () => void;
}

export function FormateurAvailabilityCalendar({ 
  formateur, 
  onAddAvailability 
}: FormateurAvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock availability data if none exists
  const availabilities = formateur.disponibilites || [
    {
      debut: "2024-01-15T09:00:00",
      fin: "2024-01-15T17:00:00",
      type: "Disponible"
    },
    {
      debut: "2024-01-16T08:00:00", 
      fin: "2024-01-16T16:00:00",
      type: "Disponible"
    }
  ];

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availabilities.filter(avail => 
      avail.debut.startsWith(dateStr)
    );
  };

  const selectedDateAvailabilities = selectedDate ? getAvailabilityForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Calendrier des disponibilités</CardTitle>
              <CardDescription>
                Gérez vos créneaux de disponibilité
              </CardDescription>
            </div>
            <Button onClick={onAddAvailability} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  available: (date) => getAvailabilityForDate(date).length > 0
                }}
                modifiersStyles={{
                  available: { 
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }
                }}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-3">
                Disponibilités du {selectedDate?.toLocaleDateString('fr-FR') || 'jour sélectionné'}
              </h3>
              
              {selectedDateAvailabilities.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateAvailabilities.map((avail, index) => {
                    const startTime = new Date(avail.debut).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    const endTime = new Date(avail.fin).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{startTime} - {endTime}</span>
                        </div>
                        <Badge variant="secondary">
                          {avail.type || 'Disponible'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune disponibilité ce jour</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
