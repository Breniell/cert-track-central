
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Calendar, AlertTriangle, FileText } from 'lucide-react';

export default function Index() {
  // Formations qui expirent bientôt
  const formationsExpirant = [
    { nom: "Sécurité en hauteur", type: "HSE", participants: 12, expiration: "15 mai 2024" },
    { nom: "Manipulation des produits chimiques", type: "HSE", participants: 8, expiration: "2 juin 2024" },
    { nom: "Premiers secours", type: "HSE", participants: 15, expiration: "10 juin 2024" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground">Vue d'ensemble de la plateforme de formation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendrier</span>
            </Button>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Rapport</span>
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activité récente */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Formations expirant bientôt */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-medium text-gray-900">Formations expirant bientôt</h2>
            </div>
            <div className="px-6 py-4">
              <ul className="divide-y divide-gray-200">
                {formationsExpirant.map((formation, index) => (
                  <li key={index} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{formation.nom}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            formation.type === 'HSE' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {formation.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formation.participants} participants
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-red-500 font-medium">
                        Expire le {formation.expiration}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-200 px-6 py-3">
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/90">
                Voir toutes les formations à renouveler
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
