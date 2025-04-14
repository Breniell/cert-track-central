
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  CalendarDays, 
  ClipboardCheck, 
  FileText, 
  MessageSquare, 
  Shield, 
  Sliders, 
  Users 
} from "lucide-react";

export default function Index() {
  const modules = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Console d'administration",
      description: "Contrôle central et paramètres avancés de la plateforme",
      link: "/admin/console",
      primary: true
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestion des formateurs",
      description: "Gérez les profils et la disponibilité des formateurs",
      link: "/formateurs"
    },
    {
      icon: <CalendarDays className="h-6 w-6" />,
      title: "Planning des formations",
      description: "Calendrier et organisation des sessions de formation",
      link: "/planning"
    },
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Participants et inscriptions",
      description: "Suivi des participants et validation des présences",
      link: "/participants"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Vérification documents HSE",
      description: "Contrôle des documents pour les sous-traitants",
      link: "/hse/verification-documents"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Gestion des appels d'offres",
      description: "Créez et suivez les appels d'offres pour formations externes",
      link: "/appels-offre"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Espace collaboratif",
      description: "Forum, messagerie et centre documentaire",
      link: "/collaboration"
    },
    {
      icon: <Sliders className="h-6 w-6" />,
      title: "Paramètres et profil",
      description: "Gérez vos préférences et informations personnelles",
      link: "/admin"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Plateforme de Gestion des Formations</h1>
          <p className="text-gray-600 text-lg">Formations HSE et Métiers | Coordination RH & HSE</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                module.primary ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.primary ? 'bg-primary/10 text-primary' : 'bg-gray-100'}`}>
                    {module.icon}
                  </div>
                </div>
                <CardTitle className="mt-3">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button asChild className={`w-full ${module.primary ? 'bg-primary hover:bg-primary/90' : ''}`}>
                  <Link to={module.link}>Accéder</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 - Plateforme de Gestion des Formations</p>
        </footer>
      </div>
    </div>
  );
}
