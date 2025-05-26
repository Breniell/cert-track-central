
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MoodleProvider } from "@/contexts/MoodleContext";

// Pages CIMENCAM essentielles
import TrainerDashboard from "./pages/TrainerDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import RHDashboard from "./pages/RHDashboard";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MoodleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/trainer" element={<TrainerDashboard />} />
              <Route path="/learner" element={<LearnerDashboard />} />
              <Route path="/rh" element={<RHDashboard />} />
              <Route path="/" element={<Navigate to="/learner" replace />} />
              <Route path="*" element={<Navigate to="/learner" replace />} />
            </Routes>
          </TooltipProvider>
        </MoodleProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
