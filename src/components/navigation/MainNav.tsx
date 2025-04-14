
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Shield,
  Settings,
} from "lucide-react";

const MainNav = () => {
  const navItems = [
    {
      title: "Formations HSE",
      icon: Shield,
      href: "/formations/hse",
      description: "Gestion des formations santé et sécurité",
    },
    {
      title: "Formations Métiers",
      icon: BookOpen,
      href: "/formations/metiers",
      description: "Gestion des formations professionnelles",
    },
    {
      title: "Planning",
      icon: Calendar,
      href: "/planning",
      description: "Calendrier et programmation",
    },
    {
      title: "Formateurs",
      icon: Users,
      href: "/formateurs",
      description: "Gestion des formateurs",
    },
    {
      title: "Appels d'offres",
      icon: FileText,
      href: "/appels-offre",
      description: "Gestion des appels d'offres",
    },
    {
      title: "Budget & ROI",
      icon: BarChart3,
      href: "/budget",
      description: "Suivi financier et ROI",
    },
    {
      title: "Collaboration",
      icon: MessageSquare,
      href: "/collaboration",
      description: "Espace d'échange",
    },
    {
      title: "Paramètres",
      icon: Settings,
      href: "/parametres",
      description: "Configuration du système",
    },
  ];

  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="no-underline"
        >
          <Button
            variant="outline"
            className="w-full h-full p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
          >
            <item.icon className="h-6 w-6" />
            <span className="font-medium">{item.title}</span>
            <span className="text-sm text-muted-foreground text-center">
              {item.description}
            </span>
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
