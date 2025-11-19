import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';

interface SessionValidationProps {
  session: any;
  onValidated?: () => void;
}

export function SessionValidation({ session, onValidated }: SessionValidationProps) {
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const canValidateHR = hasRole('hr') || hasRole('drh');
  const canValidateHSE = hasRole('hse');

  const needsHRValidation = session.status === 'planned';
  const needsHSEValidation = session.status === 'validated_hr' && session.type === 'HSE';

  async function handleValidate(validationType: 'hr' | 'hse', approve: boolean) {
    setLoading(true);
    try {
      let newStatus = session.status;
      const updates: any = {};

      if (validationType === 'hr') {
        if (approve) {
          newStatus = session.type === 'HSE' ? 'validated_hr' : 'validated_hse';
          updates.validated_hr_at = new Date().toISOString();
          updates.validated_hr_by = user!.id;
        } else {
          newStatus = 'cancelled';
        }
      } else if (validationType === 'hse') {
        if (approve) {
          newStatus = 'validated_hse';
          updates.validated_hse_at = new Date().toISOString();
          updates.validated_hse_by = user!.id;
        } else {
          newStatus = 'cancelled';
        }
      }

      await supabase
        .from('training_sessions')
        .update({ ...updates, status: newStatus })
        .eq('id', session.id);

      toast.success(approve ? 'Session validée' : 'Session refusée');
      onValidated?.();
    } catch (error) {
      toast.error('Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  }

  if (!canValidateHR && !canValidateHSE) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow de validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Validation RH</span>
            <Badge variant={session.validated_hr_at ? 'default' : 'outline'}>
              {session.validated_hr_at ? 'Validée' : 'En attente'}
            </Badge>
          </div>

          {session.type === 'HSE' && (
            <div className="flex items-center justify-between">
              <span>Validation HSE</span>
              <Badge variant={session.validated_hse_at ? 'default' : 'outline'}>
                {session.validated_hse_at ? 'Validée' : 'En attente'}
              </Badge>
            </div>
          )}
        </div>

        {needsHRValidation && canValidateHR && (
          <div className="flex gap-2">
            <Button onClick={() => handleValidate('hr', true)} disabled={loading} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approuver (RH)
            </Button>
            <Button onClick={() => handleValidate('hr', false)} disabled={loading} variant="destructive" className="flex-1">
              <XCircle className="mr-2 h-4 w-4" />
              Refuser
            </Button>
          </div>
        )}

        {needsHSEValidation && canValidateHSE && (
          <div className="flex gap-2">
            <Button onClick={() => handleValidate('hse', true)} disabled={loading} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approuver (HSE)
            </Button>
            <Button onClick={() => handleValidate('hse', false)} disabled={loading} variant="destructive" className="flex-1">
              <XCircle className="mr-2 h-4 w-4" />
              Refuser
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
