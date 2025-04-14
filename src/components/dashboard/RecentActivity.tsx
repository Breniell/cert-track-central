
import { Calendar, Clock, Users2, FileCheck, MapPin } from "lucide-react";

interface Activity {
  id: number;
  type: "formation" | "certification" | "inscription" | "formateur";
  title: string;
  date: string;
  details?: string;
  user?: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: "formation",
    title: "Nouvelle formation HSE ajoutée",
    date: "Il y a 30 minutes",
    details: "Sécurité en hauteur - 15 Mars 2024",
    user: "Marie Martin"
  },
  {
    id: 2,
    type: "inscription",
    title: "Inscriptions ouvertes",
    date: "Il y a 1 heure",
    details: "Manipulation des produits chimiques - 8 places disponibles",
    user: "Jean Dupont"
  },
  {
    id: 3,
    type: "certification",
    title: "Certifications à renouveler",
    date: "Il y a 3 heures",
    details: "5 employés ont des certifications qui expirent dans 30 jours"
  },
  {
    id: 4,
    type: "formateur",
    title: "Nouveau formateur ajouté",
    date: "Il y a 1 jour",
    details: "Paul Robert - Spécialiste en sécurité incendie",
    user: "Admin"
  },
  {
    id: 5,
    type: "formation",
    title: "Formation complétée",
    date: "Il y a 2 jours",
    details: "Maintenance préventive - 12 participants",
    user: "Pierre Dubois"
  }
];

function ActivityIcon({ type }: { type: Activity["type"] }) {
  switch (type) {
    case "formation":
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case "certification":
      return <FileCheck className="h-5 w-5 text-green-500" />;
    case "inscription":
      return <Users2 className="h-5 w-5 text-purple-500" />;
    case "formateur":
      return <MapPin className="h-5 w-5 text-amber-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
}

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">Activités récentes</h2>
      </div>
      <div className="px-6 py-4">
        <ul className="space-y-6">
          {activities.map((activity) => (
            <li key={activity.id} className="relative pl-6">
              <div className="absolute left-0 top-1">
                <ActivityIcon type={activity.type} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                {activity.details && (
                  <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
                )}
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>{activity.date}</span>
                  {activity.user && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                      <span>par {activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 px-6 py-3">
        <a href="#" className="text-sm font-medium text-primary hover:text-primary/90">
          Voir toutes les activités
        </a>
      </div>
    </div>
  );
}
