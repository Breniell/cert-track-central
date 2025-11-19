import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, BookOpen, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SessionForm } from '@/components/sessions/SessionForm';
import { SessionCalendar } from '@/components/sessions/SessionCalendar';
import { SessionsList } from '@/components/sessions/SessionsList';
import { ValidationQueue } from '@/components/sessions/ValidationQueue';

export function HRDashboard() {
  const [stats, setStats] = useState<any>({});
  const [showSessionForm, setShowSessionForm] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data: sessions } = await supabase.from('training_sessions').select('*');
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: formateurs } = await supabase.from('formateurs').select('*').eq('active', true);
    const { data: attendances } = await supabase.from('attendances').select('*');

    const present = attendances?.filter((a) => !a.absent).length || 0;
    const total = attendances?.length || 1;

    setStats({
      sessions: sessions?.length || 0,
      profiles: profiles?.length || 0,
      formateurs: formateurs?.length || 0,
      attendance: Math.round((present / total) * 100),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord RH</h1>
          <p className="text-muted-foreground">Gestion des formations et des collaborateurs</p>
        </div>
        <Button onClick={() => setShowSessionForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer une session
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions planifiées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profiles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formateurs actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.formateurs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendance}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <SessionCalendar />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionsList />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationQueue />
        </TabsContent>
      </Tabs>

      <Dialog open={showSessionForm} onOpenChange={setShowSessionForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une session de formation</DialogTitle>
          </DialogHeader>
          <SessionForm
            onSuccess={() => {
              setShowSessionForm(false);
              loadStats();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
