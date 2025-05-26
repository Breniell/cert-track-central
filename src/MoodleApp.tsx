
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MoodleProvider } from "@/contexts/MoodleContext";
import MoodleRouter from "@/components/moodle/MoodleRouter";

// Application principale pour l'intégration Moodle
// Cette application sera montée dans un conteneur Moodle
const MoodleApp = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <MoodleProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <MoodleRouter />
          </div>
          <Toaster />
        </TooltipProvider>
      </MoodleProvider>
    </QueryClientProvider>
  );
};

export default MoodleApp;
