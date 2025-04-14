
import {
  Calendar,
  Users,
  FileCheck,
  Award,
  BarChart2,
  Clock
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  percentage?: {
    value: number;
    trend: 'up' | 'down';
  };
}

function StatCard({ title, value, icon: Icon, colorClass, percentage }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-3 ${colorClass} rounded-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {percentage && (
                <span className={`text-sm ${percentage.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {percentage.trend === 'up' ? '+' : '-'}{percentage.value}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const stats: StatCardProps[] = [
    {
      title: "Formations ce mois",
      value: 24,
      icon: Calendar,
      colorClass: "bg-blue-100 text-blue-600",
      percentage: { value: 12, trend: 'up' }
    },
    {
      title: "Participants actifs",
      value: 156,
      icon: Users,
      colorClass: "bg-purple-100 text-purple-600",
      percentage: { value: 8, trend: 'up' }
    },
    {
      title: "Certifications validées",
      value: 87,
      icon: FileCheck,
      colorClass: "bg-green-100 text-green-600",
      percentage: { value: 15, trend: 'up' }
    },
    {
      title: "Taux de satisfaction",
      value: "96%",
      icon: Award,
      colorClass: "bg-amber-100 text-amber-600"
    },
    {
      title: "Heures dispensées",
      value: 2608,
      icon: Clock,
      colorClass: "bg-indigo-100 text-indigo-600",
      percentage: { value: 5, trend: 'up' }
    },
    {
      title: "Progression formation annuelle",
      value: "68%",
      icon: BarChart2,
      colorClass: "bg-rose-100 text-rose-600",
      percentage: { value: 3, trend: 'up' }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
