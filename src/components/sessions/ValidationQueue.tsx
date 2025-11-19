import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionValidation } from './SessionValidation';

export function ValidationQueue() {
  const [pendingSessions, setPendingSessions] = useState<any[]>([]);

  useEffect(() => {
    loadPendingSessions();
  }, []);

  async function loadPendingSessions() {
    const { data } = await supabase
      .from('training_sessions')
      .select('*, sites(name)')
      .in('status', ['planned', 'validated_hr'])
      .order('start_datetime');

    if (data) setPendingSessions(data);
  }

  return (
    <div className="space-y-4">
      {pendingSessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">Aucune session en attente de validation</CardContent>
        </Card>
      ) : (
        pendingSessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionValidation session={session} onValidated={loadPendingSessions} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
