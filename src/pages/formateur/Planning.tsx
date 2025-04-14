
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export default function FormateurPlanning() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mon Planning</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sessions à venir</h2>
          <div className="space-y-4">
            {/* Liste des sessions programmées */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Sécurité en hauteur</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    15 Mars 2024
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    8h - 17h
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
