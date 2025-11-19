import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const localizer = momentLocalizer(moment);

interface SessionEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
}

export function SessionCalendar() {
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [view, setView] = useState<View>('month');

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const { data } = await supabase
      .from('training_sessions')
      .select('*, sites(name), formateurs(*, profiles(*))')
      .order('start_datetime');

    if (data) {
      const calendarEvents = data.map((session) => ({
        id: session.id,
        title: session.title,
        start: new Date(session.start_datetime),
        end: new Date(session.end_datetime),
        resource: session,
      }));
      setEvents(calendarEvents);
    }
  }

  const eventStyleGetter = (event: SessionEvent) => {
    const status = event.resource.status;
    let backgroundColor = 'hsl(var(--primary))';

    if (status === 'completed') backgroundColor = 'hsl(var(--success))';
    if (status === 'cancelled') backgroundColor = 'hsl(var(--destructive))';
    if (status === 'ongoing') backgroundColor = 'hsl(var(--warning))';
    if (status === 'validated_hr') backgroundColor = 'hsl(var(--accent))';
    if (status === 'validated_hse') backgroundColor = 'hsl(var(--secondary))';

    return { style: { backgroundColor } };
  };

  return (
    <>
      <div className="h-[600px] bg-background p-4 rounded-lg">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          onSelectEvent={(event) => setSelectedSession(event.resource)}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: 'Suivant',
            previous: 'Précédent',
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            agenda: 'Agenda',
          }}
        />
      </div>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div>
                <Badge variant={selectedSession.type === 'HSE' ? 'destructive' : 'default'}>{selectedSession.type}</Badge>
                <Badge className="ml-2">{selectedSession.status}</Badge>
              </div>
              <p className="text-muted-foreground">{selectedSession.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Lieu:</strong> {selectedSession.location}
                </div>
                <div>
                  <strong>Capacité:</strong> {selectedSession.capacity}
                </div>
                <div>
                  <strong>Durée:</strong> {selectedSession.duration_hours}h
                </div>
                <div>
                  <strong>Site:</strong> {selectedSession.sites?.name}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
