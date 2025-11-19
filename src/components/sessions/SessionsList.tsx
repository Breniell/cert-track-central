import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function SessionsList() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const { data } = await supabase
      .from('training_sessions')
      .select('*, sites(name), formateurs(*, profiles(*))')
      .order('start_datetime', { ascending: false })
      .limit(20);

    if (data) setSessions(data);
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: 'outline',
      validated_hr: 'secondary',
      validated_hse: 'default',
      ongoing: 'warning',
      completed: 'success',
      cancelled: 'destructive',
    };
    return colors[status] || 'outline';
  };

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{session.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={session.type === 'HSE' ? 'destructive' : 'default'}>{session.type}</Badge>
                <Badge variant={getStatusColor(session.status) as any}>{session.status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">
                  {format(new Date(session.start_datetime), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="font-medium">Lieu</p>
                <p className="text-muted-foreground">{session.location}</p>
              </div>
              <div>
                <p className="font-medium">Site</p>
                <p className="text-muted-foreground">{session.sites?.name}</p>
              </div>
              <div>
                <p className="font-medium">Capacité</p>
                <p className="text-muted-foreground">{session.capacity} places</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
