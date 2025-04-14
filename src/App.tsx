import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Index from "./pages/Index";
import FormationsHSE from "./pages/formations/FormationsHSE";
import Formations from "./pages/Formations";
import Formateurs from "./pages/Formateurs";
import Participants from "./pages/Participants";
import Planning from "./pages/Planning";
import NotFound from "./pages/NotFound";
import Collaboration from "./pages/Collaboration";
import AdminDashboard from "./pages/AdminDashboard";
import AdminConsole from "./pages/AdminConsole"; // Nouvelle page de console d'administration
import Budget from "./pages/Budget"; // Nouvelle page de budget

// Nouvelles pages pour les formateurs
import FormateurDashboard from "./pages/formateur/Dashboard";
import FormateurFormations from "./pages/formateur/Formations";
import FormateurPlanning from "./pages/formateur/Planning";

// Nouvelles pages pour le personnel
import PersonnelDashboard from "./pages/personnel/Dashboard";
import PersonnelFormations from "./pages/personnel/Formations";
import PersonnelHistorique from "./pages/personnel/Historique";

// Nouvelles pages HSE
import VerificationDocuments from "./pages/hse/VerificationDocuments";

// Nouvelles pages pour les appels d'offres
import AppelsOffre from "./pages/appeldoffre/AppelsOffre";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/formations/hse" element={<FormationsHSE />} />
            {/* Routes administrateur */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/console" element={<AdminConsole />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/formateurs" element={<Formateurs />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/appels-offre" element={<AppelsOffre />} />
            <Route path="/collaboration" element={<Collaboration />} />

            {/* Routes formateur */}
            <Route path="/formateur">
              <Route index element={<FormateurDashboard />} />
              <Route path="formations" element={<FormateurFormations />} />
              <Route path="planning" element={<FormateurPlanning />} />
            </Route>

            {/* Routes personnel */}
            <Route path="/personnel">
              <Route index element={<PersonnelDashboard />} />
              <Route path="formations" element={<PersonnelFormations />} />
              <Route path="historique" element={<PersonnelHistorique />} />
            </Route>

            {/* Routes HSE */}
            <Route path="/hse">
              <Route path="verification-documents" element={<VerificationDocuments />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
