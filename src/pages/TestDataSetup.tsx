import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  position?: string;
}

const testUsers: TestUser[] = [
  {
    email: 'admin@cimencam.cm',
    password: 'Admin@2024',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    department: 'Direction Générale',
    position: 'Administrateur Système',
  },
  {
    email: 'drh.douala@cimencam.cm',
    password: 'Drh@2024',
    firstName: 'Marie',
    lastName: 'Nguema',
    role: 'drh',
    department: 'RH',
    position: 'Directrice RH',
  },
  {
    email: 'rh.douala@cimencam.cm',
    password: 'Rh@2024',
    firstName: 'Jean',
    lastName: 'Mbarga',
    role: 'hr',
    department: 'RH',
    position: 'Gestionnaire RH',
  },
  {
    email: 'hse.douala@cimencam.cm',
    password: 'Hse@2024',
    firstName: 'Paul',
    lastName: 'Kamga',
    role: 'hse',
    department: 'HSE',
    position: 'Responsable HSE',
  },
  {
    email: 'manager.production@cimencam.cm',
    password: 'Manager@2024',
    firstName: 'Sophie',
    lastName: 'Nkolo',
    role: 'manager',
    department: 'Production',
    position: 'Chef de Service',
  },
  {
    email: 'formateur1@cimencam.cm',
    password: 'Form@2024',
    firstName: 'Thomas',
    lastName: 'Ebogo',
    role: 'formateur',
    department: 'Formation',
    position: 'Formateur HSE',
  },
  {
    email: 'formateur2@cimencam.cm',
    password: 'Form@2024',
    firstName: 'Alice',
    lastName: 'Fouda',
    role: 'formateur',
    department: 'Formation',
    position: 'Formateur Métier',
  },
  {
    email: 'apprenant1@cimencam.cm',
    password: 'App@2024',
    firstName: 'Marc',
    lastName: 'Onana',
    role: 'apprenant',
    department: 'Production',
    position: 'Technicien',
  },
  {
    email: 'apprenant2@cimencam.cm',
    password: 'App@2024',
    firstName: 'Julie',
    lastName: 'Biya',
    role: 'apprenant',
    department: 'Maintenance',
    position: 'Opérateur',
  },
];

export default function TestDataSetup() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ email: string; success: boolean; message: string }[]>([]);
  const { toast } = useToast();

  const createTestUsers = async () => {
    setLoading(true);
    setResults([]);
    const newResults: typeof results = [];

    // Get site ID for Douala
    const { data: sites } = await supabase.from('sites').select('id').eq('code', 'DLA').single();
    const siteId = sites?.id;

    for (const user of testUsers) {
      try {
        // Create user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              first_name: user.firstName,
              last_name: user.lastName,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Update profile with additional info
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              department: user.department,
              position: user.position,
              site_id: siteId,
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;

          // Add role (use insert with proper typing)
          const { error: roleError } = await supabase.from('user_roles').insert([{
            user_id: authData.user.id,
            role: user.role as any,
            site_id: siteId,
          }]);

          if (roleError) throw roleError;

          // If formateur, create formateur entry
          if (user.role === 'formateur') {
            const { error: formateurError } = await supabase.from('formateurs').insert([{
              user_id: authData.user.id,
              specialties: user.position?.includes('HSE') ? ['HSE', 'Sécurité'] : ['Technique', 'Métier'],
              certifications: ['Certification Formateur'],
              habilitation_status: 'approved' as any,
            }]);

            if (formateurError) throw formateurError;
          }

          newResults.push({
            email: user.email,
            success: true,
            message: `Créé avec succès - Rôle: ${user.role}`,
          });
        }
      } catch (error: any) {
        newResults.push({
          email: user.email,
          success: false,
          message: error.message || 'Erreur inconnue',
        });
      }
    }

    setResults(newResults);
    setLoading(false);

    const successCount = newResults.filter((r) => r.success).length;
    toast({
      title: 'Création des utilisateurs terminée',
      description: `${successCount}/${testUsers.length} utilisateurs créés avec succès`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ciment-green/10 via-background to-ciment-green-dark/10 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-ciment-green/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-ciment-green">
              Configuration des données de test CIMFORM
            </CardTitle>
            <CardDescription>
              Créez automatiquement des utilisateurs de test avec différents rôles pour tester toutes les
              fonctionnalités du système.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Utilisateurs qui seront créés :</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testUsers.map((user) => (
                  <div key={user.email} className="text-sm">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                    <div className="text-xs">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
              <p className="text-sm">
                <strong>⚠️ Note importante :</strong> Tous les utilisateurs auront le mot de passe indiqué
                dans le tableau ci-dessus. Changez-les après la première connexion.
              </p>
            </div>

            <Button
              onClick={createTestUsers}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                'Créer les utilisateurs de test'
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Résultats :</h3>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      result.success ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{result.email}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Identifiants de connexion :</h3>
              <div className="space-y-1 text-sm">
                <div>👤 <strong>Super Admin:</strong> admin@cimencam.cm / Admin@2024</div>
                <div>👤 <strong>DRH:</strong> drh.douala@cimencam.cm / Drh@2024</div>
                <div>👤 <strong>RH:</strong> rh.douala@cimencam.cm / Rh@2024</div>
                <div>👤 <strong>HSE:</strong> hse.douala@cimencam.cm / Hse@2024</div>
                <div>👤 <strong>Manager:</strong> manager.production@cimencam.cm / Manager@2024</div>
                <div>👤 <strong>Formateur:</strong> formateur1@cimencam.cm / Form@2024</div>
                <div>👤 <strong>Apprenant:</strong> apprenant1@cimencam.cm / App@2024</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
