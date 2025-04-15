
import Layout from "@/components/layout/Layout";
import PointageFormateur from "@/components/pointage/PointageFormateur";
import { useAuth } from "@/contexts/AuthContext";

export default function GestionPointage() {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion du Pointage</h1>
          <p className="text-gray-500 mt-1">
            Suivez la présence des participants à vos formations
          </p>
        </div>
        
        <PointageFormateur formateurId={user?.id || 0} />
      </div>
    </Layout>
  );
}
