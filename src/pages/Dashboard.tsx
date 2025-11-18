import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, LogOut, User, Shield, Calendar, Users, BookOpen, MessageSquare, Bell, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, roles, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getRoleName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      super_admin: 'Super Administrateur',
      drh: 'DRH',
      hr: 'RH',
      hse: 'HSE',
      manager: 'Manager',
      formateur: 'Formateur',
      apprenant: 'Apprenant',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ciment-green/10 via-background to-ciment-green-dark/10">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ciment-green">CIMFORM</h1>
              <p className="text-xs text-muted-foreground">Gestion des formations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue, {profile.first_name}!
          </h2>
          <p className="text-muted-foreground">
            Accédez rapidement à vos fonctionnalités principales
          </p>
        </div>

        {/* Roles Display */}
        <Card className="mb-8 border-ciment-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-ciment-green" />
              Vos rôles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <span
                  key={role.id}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {getRoleName(role.role)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-ciment-green/20">
            <CardHeader>
              <Calendar className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Sessions de formation</CardTitle>
              <CardDescription>
                Consultez et gérez les sessions disponibles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-ciment-green/20">
            <CardHeader>
              <Users className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                Gérez les inscriptions et les présences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-ciment-green/20">
            <CardHeader>
              <User className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Formateurs</CardTitle>
              <CardDescription>
                Accédez aux profils et disponibilités
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-ciment-green/20">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Matrices</CardTitle>
              <CardDescription>
                Consultez les matrices de compétences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-ciment-green/20">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Messagerie</CardTitle>
              <CardDescription>
                Communiquez avec vos collègues
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-ciment-green/20">
            <CardHeader>
              <Bell className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Restez informé des événements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-ciment-green/20">
            <CardHeader>
              <FileText className="w-10 h-10 text-ciment-green mb-2" />
              <CardTitle>Rapports</CardTitle>
              <CardDescription>
                Générez des rapports détaillés
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
