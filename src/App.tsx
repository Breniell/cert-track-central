
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Formations from "./pages/Formations";
import Formateurs from "./pages/Formateurs";
import Participants from "./pages/Participants";
import Planning from "./pages/Planning";
import NotFound from "./pages/NotFound";

const App = () => {
  // Créer une nouvelle instance de QueryClient dans le composant
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/formateurs" element={<Formateurs />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/planning" element={<Planning />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
