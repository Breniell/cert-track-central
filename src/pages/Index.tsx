
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, BookOpenIcon, CalendarIcon, UsersIcon, ClipboardListIcon, BarChart3Icon, ShieldIcon } from "lucide-react";
import { Link } from "react-router-dom";

const welcomeMessages = {
  administrateur: "Bienvenue sur le tableau de bord administrateur de CertTrackCentral.",
  formateur: "Bienvenue sur votre espace formateur.",
  personnel: "Bienvenue sur votre espace personnel.",
  "sous-traitant": "Bienvenue sur votre espace sous-traitant.",
  hse: "Bienvenue sur l'espace HSE de CertTrackCentral.",
  rh: "Bienvenue sur l'espace RH de CertTrackCentral."
};

const descriptions = {
  administrateur: "Gérez l'ensemble des formations, formateurs, et participants en un seul endroit.",
  formateur: "Consultez vos sessions de formation et gérez les évaluations de vos participants.",
  personnel: "Explorez les formations disponibles et consultez votre historique de formations.",
  "sous-traitant": "Accédez aux informations sur vos formations obligatoires et vérifiez vos documents.",
  hse: "Vérifiez les documents des sous-traitants et gérez les formations HSE.",
  rh: "Gérez les formations, les participants et le budget de formation en un seul endroit."
};

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const welcomeMessage = welcomeMessages[user.role] || "Bienvenue sur CertTrackCentral";
  const description = descriptions[user.role] || "Plateforme centralisée de gestion des formations.";

  const getFeatureCards = () => {
    const commonFeatures = [
      {
        title: "Formations",
        description: "Consultez et gérez les formations disponibles.",
        icon: BookOpenIcon,
        href: user.role === "formateur" ? "/formateur/formations" : "/formations",
        color: "bg-blue-50 text-blue-600"
      },
      {
        title: "Planning",
        description: "Accédez au calendrier des formations.",
        icon: CalendarIcon,
        href: user.role === "formateur" ? "/formateur/planning" : "/planning",
        color: "bg-indigo-50 text-indigo-600"
      }
    ];

    // Fonctionnalités spécifiques selon le rôle
    switch (user.role) {
      case "administrateur":
        return [
          ...commonFeatures,
          {
            title: "Formateurs",
            description: "Gérez les profils et les disponibilités des formateurs.",
            icon: UsersIcon,
            href: "/formateurs",
            color: "bg-purple-50 text-purple-600"
          },
          {
            title: "Participants",
            description: "Consultez et gérez les inscrits aux formations.",
            icon: ClipboardListIcon,
            href: "/participants",
            color: "bg-green-50 text-green-600"
          },
          {
            title: "Budget",
            description: "Suivez les coûts et le ROI de vos formations.",
            icon: BarChart3Icon,
            href: "/budget",
            color: "bg-amber-50 text-amber-600"
          },
          {
            title: "HSE",
            description: "Vérifiez les documents et gérez les urgences HSE.",
            icon: ShieldIcon,
            href: "/hse/verification-documents",
            color: "bg-red-50 text-red-600"
          },
        ];
      case "formateur":
        return [
          ...commonFeatures,
          {
            title: "Évaluations",
            description: "Gérez les évaluations de vos participants.",
            icon: ClipboardListIcon,
            href: "/formateur/evaluations",
            color: "bg-green-50 text-green-600"
          }
        ];
      case "hse":
        return [
          ...commonFeatures,
          {
            title: "Vérification Documents",
            description: "Vérifiez les documents obligatoires des sous-traitants.",
            icon: ClipboardListIcon,
            href: "/hse/verification-documents",
            color: "bg-amber-50 text-amber-600"
          },
          {
            title: "Formations HSE",
            description: "Gérez les formations spécifiques HSE.",
            icon: ShieldIcon,
            href: "/formations/hse",
            color: "bg-red-50 text-red-600"
          }
        ];
      case "rh":
        return [
          ...commonFeatures,
          {
            title: "Participants",
            description: "Gérez les profils et les inscriptions des participants.",
            icon: UsersIcon,
            href: "/participants",
            color: "bg-purple-50 text-purple-600"
          },
          {
            title: "Budget",
            description: "Suivez les coûts et le ROI de vos formations.",
            icon: BarChart3Icon,
            href: "/budget",
            color: "bg-amber-50 text-amber-600"
          }
        ];
      case "personnel":
      case "sous-traitant":
        return [
          {
            title: "Formations",
            description: "Consultez les formations disponibles.",
            icon: BookOpenIcon,
            href: "/personnel/formations",
            color: "bg-blue-50 text-blue-600"
          },
          {
            title: "Historique",
            description: "Consultez votre historique de formations.",
            icon: ClipboardListIcon,
            href: "/personnel/historique",
            color: "bg-green-50 text-green-600"
          },
          user.role === "sous-traitant" ? 
          {
            title: "Documents",
            description: "Gérez vos documents obligatoires.",
            icon: ShieldIcon,
            href: "/personnel/documents",
            color: "bg-red-50 text-red-600"
          } : null
        ].filter(Boolean);
      default:
        return commonFeatures;
    }
  };

  const features = getFeatureCards();

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="border-none shadow-md bg-gradient-to-r from-blue-100 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800">{welcomeMessage}</CardTitle>
            <CardDescription className="text-blue-700">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Notre plateforme vous permet de gérer efficacement toutes les formations HSE et métiers, 
              le suivi des participants, et la vérification des documents obligatoires.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link to={user.role === "formateur" ? "/formateur/formations" : 
                         user.role === "personnel" || user.role === "sous-traitant" ? 
                         "/personnel/formations" : "/formations"}>
                  Explorer les formations <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mt-8 mb-4">Fonctionnalités principales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={feature.href}>
                    Accéder <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
