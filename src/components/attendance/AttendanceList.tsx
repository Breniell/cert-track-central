import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface AttendanceListProps {
  sessionId: string;
}

interface Participant {
  id: string;
  user_id: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
  };
  attendance?: {
    id: string;
    checkin_at: string;
    absent: boolean;
    late: boolean;
  };
}

export function AttendanceList({ sessionId }: AttendanceListProps) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadParticipants();
  }, [sessionId]);

  async function loadParticipants() {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*, profiles!inner(*)')
      .eq('session_id', sessionId)
      .eq('status', 'enrolled');

    if (enrollments) {
      const { data: attendances } = await supabase.from('attendances').select('*').eq('session_id', sessionId);

      const participantsWithAttendance = enrollments.map((enrollment: any) => ({
        id: enrollment.id,
        user_id: enrollment.user_id,
        profile: enrollment.profiles,
        attendance: attendances?.find((a) => a.user_id === enrollment.user_id),
      }));

      setParticipants(participantsWithAttendance);
    }
  }

  async function toggleAttendance(participant: Participant, present: boolean) {
    setLoading(true);
    try {
      if (participant.attendance) {
        await supabase
          .from('attendances')
          .update({
            absent: !present,
            checkin_at: present ? new Date().toISOString() : null,
          })
          .eq('id', participant.attendance.id);
      } else {
        await supabase.from('attendances').insert({
          session_id: sessionId,
          user_id: participant.user_id,
          absent: !present,
          checkin_at: present ? new Date().toISOString() : null,
          marked_by: user!.id,
        });
      }

      await loadParticipants();
      toast.success('Présence enregistrée');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }

  async function markLate(participant: Participant) {
    setLoading(true);
    try {
      if (participant.attendance) {
        await supabase.from('attendances').update({ late: true }).eq('id', participant.attendance.id);
      } else {
        await supabase.from('attendances').insert({
          session_id: sessionId,
          user_id: participant.user_id,
          late: true,
          absent: false,
          checkin_at: new Date().toISOString(),
          marked_by: user!.id,
        });
      }

      await loadParticipants();
      toast.success('Retard enregistré');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste de présence ({participants.length} participants)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((participant) => {
            const isPresent = participant.attendance && !participant.attendance.absent;
            const isLate = participant.attendance?.late;

            return (
              <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <Checkbox
                    checked={isPresent}
                    onCheckedChange={(checked) => toggleAttendance(participant, checked as boolean)}
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {participant.profile.first_name} {participant.profile.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{participant.profile.email}</p>
                    <p className="text-xs text-muted-foreground">{participant.profile.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isLate && <Badge variant="destructive">Retard</Badge>}
                  {isPresent && participant.attendance?.checkin_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(participant.attendance.checkin_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                  {isPresent && !isLate && (
                    <Button size="sm" variant="outline" onClick={() => markLate(participant)} disabled={loading}>
                      Marquer retard
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {participants.length === 0 && <p className="text-center text-muted-foreground py-8">Aucun participant inscrit</p>}
        </div>
      </CardContent>
    </Card>
  );
}
