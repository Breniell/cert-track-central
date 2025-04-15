
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Index from "./pages/Index";
import FormationsHSE from "./pages/formations/FormationsHSE";
import Formations from "./pages/Formations";
import Formateurs from "./pages/Formateurs";
import Participants from "./pages/Participants";
import Planning from "./pages/Planning";
import NotFound from "./pages/NotFound";
import Collaboration from "./pages/Collaboration";
import AdminDashboard from "./pages/AdminDashboard";
import AdminConsole from "./pages/AdminConsole";
import Budget from "./pages/Budget";

// Nouvelles pages pour les formateurs
import FormateurDashboard from "./pages/formateur/Dashboard";
import FormateurFormations from "./pages/formateur/Formations";
import FormateurPlanning from "./pages/formateur/Planning";
import GestionPointage from "./pages/formateur/GestionPointage";

// Nouvelles pages pour le personnel
import PersonnelDashboard from "./pages/personnel/Dashboard";
import PersonnelFormations from "./pages/personnel/Formations";
import PersonnelHistorique from "./pages/personnel/Historique";

// Nouvelles pages HSE
import VerificationDocuments from "./pages/hse/VerificationDocuments";

// Nouvelles pages pour les appels d'offres
import AppelsOffre from "./pages/appeldoffre/AppelsOffre";
import AppelOffreDetails from "./pages/appeldoffre/AppelOffreDetails";
import NouvelAppelOffre from "./pages/appeldoffre/NouvelAppelOffre";

// Imports for new pages
import FormationsMetiers from "./pages/formations/FormationsMetiers";
import PlanningGeneral from "./pages/planning/PlanningGeneral";

// New pages for advanced features
import FormateurProfile from "./pages/formateurs/FormateurProfile";
import EvaluationManager from "./pages/evaluations/EvaluationManager";
import BudgetManager from "./pages/budget/BudgetManager";

// Route protégée par authentification
const ProtectedRoute = ({ element, requiredRole }: { element: JSX.Element, requiredRole?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

// Layout du router
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Routes administrateur et générales */}
      <Route path="/" element={<ProtectedRoute element={<Index />} />} />
      <Route path="/formations/hse" element={<ProtectedRoute element={<FormationsHSE />} requiredRole={['administrateur', 'hse', 'rh']} />} />
      <Route path="/formations/metiers" element={<ProtectedRoute element={<FormationsMetiers />} requiredRole={['administrateur', 'rh']} />} />
      <Route path="/formations" element={<ProtectedRoute element={<Formations />} />} />
      <Route path="/planning" element={<ProtectedRoute element={<PlanningGeneral />} />} />
      <Route path="/formateurs" element={<ProtectedRoute element={<Formateurs />} requiredRole={['administrateur', 'rh']} />} />
      <Route path="/formateurs/:id" element={<ProtectedRoute element={<FormateurProfile />} requiredRole={['administrateur', 'rh']} />} />
      <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole={['administrateur']} />} />
      <Route path="/admin/console" element={<ProtectedRoute element={<AdminConsole />} requiredRole={['administrateur']} />} />
      <Route path="/budget" element={<ProtectedRoute element={<Budget />} requiredRole={['administrateur', 'rh']} />} />
      <Route path="/budget/manager" element={<ProtectedRoute element={<BudgetManager />} requiredRole={['administrateur', 'rh']} />} />
      <Route path="/participants" element={<ProtectedRoute element={<Participants />} />} />
      <Route path="/evaluations" element={<ProtectedRoute element={<EvaluationManager />} requiredRole={['administrateur', 'formateur', 'rh']} />} />
      
      {/* Routes Appels d'offre */}
      <Route path="/appels-offre" element={<ProtectedRoute element={<AppelsOffre />} />} />
      <Route path="/appels-offre/:id" element={<ProtectedRoute element={<AppelOffreDetails />} />} />
      <Route path="/appels-offre/nouveau" element={<ProtectedRoute element={<NouvelAppelOffre />} />} />
      
      <Route path="/collaboration" element={<ProtectedRoute element={<Collaboration />} />} />

      {/* Routes formateur */}
      <Route path="/formateur">
        <Route index element={<ProtectedRoute element={<FormateurDashboard />} requiredRole={['formateur']} />} />
        <Route path="formations" element={<ProtectedRoute element={<FormateurFormations />} requiredRole={['formateur']} />} />
        <Route path="planning" element={<ProtectedRoute element={<FormateurPlanning />} requiredRole={['formateur']} />} />
        <Route path="pointage" element={<ProtectedRoute element={<GestionPointage />} requiredRole={['formateur']} />} />
      </Route>

      {/* Routes personnel et sous-traitant */}
      <Route path="/personnel">
        <Route index element={<ProtectedRoute element={<PersonnelDashboard />} requiredRole={['personnel', 'sous-traitant']} />} />
        <Route path="formations" element={<ProtectedRoute element={<PersonnelFormations />} requiredRole={['personnel', 'sous-traitant']} />} />
        <Route path="historique" element={<ProtectedRoute element={<PersonnelHistorique />} requiredRole={['personnel']} />} />
      </Route>

      {/* Routes HSE */}
      <Route path="/hse">
        <Route path="verification-documents" element={<ProtectedRoute element={<VerificationDocuments />} requiredRole={['administrateur', 'hse']} />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
