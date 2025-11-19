import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Building2, LogOut } from 'lucide-react';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import { HRDashboard } from './dashboards/HRDashboard';
import HSEDashboard from './dashboards/HSEDashboard';
import { FormateurDashboard } from './dashboards/FormateurDashboard';
import ApprenantDashboard from './dashboards/ApprenantDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';

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

  const getDashboardComponent = () => {
    if (roles.length === 0) {
      return <ApprenantDashboard />;
    }

    // Priority order: super_admin > drh > hr > hse > manager > formateur > apprenant
    if (roles.some(r => r.role === 'super_admin')) {
      return <SuperAdminDashboard />;
    }
    if (roles.some(r => r.role === 'drh' || r.role === 'hr')) {
      return <HRDashboard />;
    }
    if (roles.some(r => r.role === 'hse')) {
      return <HSEDashboard />;
    }
    if (roles.some(r => r.role === 'manager')) {
      return <ManagerDashboard />;
    }
    if (roles.some(r => r.role === 'formateur')) {
      return <FormateurDashboard />;
    }
    
    return <ApprenantDashboard />;
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
        {getDashboardComponent()}
      </main>
    </div>
  );
}
