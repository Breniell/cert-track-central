
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Users,
  FileText,
  BarChart3,
  ShieldIcon,
  Building,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  stats: number;
  secondaryStat?: { 
    count: number; 
    label: string; 
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" 
  };
  href: string;
  actionLabel: string;
  color: string;
}

const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  stats, 
  secondaryStat, 
  href, 
  actionLabel, 
  color 
}: DashboardCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${color} text-white`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Icon className="h-6 w-6" />
        </div>
        <CardDescription className="text-white/80">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold">{stats}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          {secondaryStat && (
            <div className="text-right">
              <Badge variant={secondaryStat.variant || "default"} className="mb-1">
                {secondaryStat.count}
              </Badge>
              <p className="text-xs text-muted-foreground">{secondaryStat.label}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button variant="ghost" className="w-full justify-between" asChild>
          <Link to={href}>
            {actionLabel}
            <Plus className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const AdminDashboard = () => {
  // Ces données seraient normalement chargées depuis une API
  const dashboardData = [
    {
      title: "Formations HSE",
      description: "Gestion des formations sécurité et santé",
      icon: ShieldIcon,
      stats: 24,
      secondaryStat: { count: 5, label: "Nouvelles", variant: "success" as const },
      href: "/formations/hse",
      actionLabel: "Voir les formations HSE",
      color: "bg-red-600"
    },
    {
      title: "Formations Métiers",
      description: "Compétences techniques et métiers",
      icon: BookOpen,
      stats: 36,
      secondaryStat: { count: 8, label: "Récentes", variant: "secondary" as const },
      href: "/formations/metiers",
      actionLabel: "Voir les formations Métiers",
      color: "bg-blue-600"
    },
    {
      title: "Planning",
      description: "Calendrier des sessions",
      icon: Calendar,
      stats: 42,
      secondaryStat: { count: 3, label: "Aujourd'hui", variant: "default" as const },
      href: "/planning",
      actionLabel: "Voir le planning",
      color: "bg-indigo-600"
    },
    {
      title: "Formateurs",
      description: "Gestion des intervenants",
      icon: Users,
      stats: 18,
      secondaryStat: { count: 2, label: "Indisponibles", variant: "destructive" as const },
      href: "/formateurs",
      actionLabel: "Gérer les formateurs",
      color: "bg-purple-600"
    },
    {
      title: "Appels d'offres",
      description: "Gestion des prestataires",
      icon: Building,
      stats: 12,
      secondaryStat: { count: 4, label: "En attente", variant: "secondary" as const },
      href: "/appels-offre",
      actionLabel: "Voir les appels d'offres",
      color: "bg-amber-600"
    },
    {
      title: "Budget & ROI",
      description: "Suivi financier des formations",
      icon: BarChart3,
      stats: 3250000,
      secondaryStat: { count: 15, label: "% du budget", variant: "success" as const },
      href: "/budget",
      actionLabel: "Consulter le budget",
      color: "bg-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground">
            Aperçu général de la plateforme de gestion des formations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Derniers 30 jours
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardData.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alertes HSE</CardTitle>
            <CardDescription>Vérifications de documents et conformité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">5 documents expirés</p>
                    <p className="text-sm text-muted-foreground">Sous-traitants avec certifications périmées</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/hse/verification-documents">Vérifier</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">8 certifications à renouveler</p>
                    <p className="text-sm text-muted-foreground">Expiration dans les 30 prochains jours</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/hse/verification-documents">Consulter</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">42 employés à jour</p>
                    <p className="text-sm text-muted-foreground">Certifications HSE valides</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/participants">Détails</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appels d'offres récents</CardTitle>
            <CardDescription>Derniers appels d'offres lancés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 font-medium bg-muted/50">
                  <div>Référence</div>
                  <div>Date de clôture</div>
                  <div>Statut</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-3 gap-4 p-4 items-center">
                    <div className="font-medium">AO-2025-04-001</div>
                    <div>25/04/2025</div>
                    <Badge>En préparation</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 items-center">
                    <div className="font-medium">AO-2025-04-002</div>
                    <div>30/04/2025</div>
                    <Badge variant="secondary">Publié</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 items-center">
                    <div className="font-medium">AO-2025-03-015</div>
                    <div>15/04/2025</div>
                    <Badge variant="success">Attribué</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/appels-offre">
                  Voir tous les appels d'offres
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
