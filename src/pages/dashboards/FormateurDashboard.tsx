import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceList } from '@/components/attendance/AttendanceList';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function FormateurDashboard() {
  const [mySessions, setMySessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMySessions();
  }, []);

  async function loadMySessions() {
    const { data: formateur } = await supabase.from('formateurs').select('id').eq('user_id', user!.id).single();

    if (formateur) {
      const { data: sessions } = await supabase
        .from('training_sessions')
        .select('*, sites(name)')
        .eq('formateur_id', formateur.id)
        .order('start_datetime');

      if (sessions) setMySessions(sessions);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Formateur</h1>
        <p className="text-muted-foreground">Mes sessions et gestion de présence</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mySessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaine session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {mySessions[0] ? format(new Date(mySessions[0].start_datetime), 'dd MMM', { locale: fr }) : '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Mes sessions</TabsTrigger>
          <TabsTrigger value="presence">Gestion présence</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <div className="space-y-4">
            {mySessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{session.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                    </div>
                    <Badge variant={session.type === 'HSE' ? 'destructive' : 'default'}>{session.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p>
                        <strong>Date:</strong> {format(new Date(session.start_datetime), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      <p>
                        <strong>Lieu:</strong> {session.location}
                      </p>
                    </div>
                    <Button onClick={() => setSelectedSession(session)}>Gérer présence</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="presence">
          {selectedSession ? (
            <AttendanceList sessionId={selectedSession.id} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Sélectionnez une session pour gérer la présence
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
