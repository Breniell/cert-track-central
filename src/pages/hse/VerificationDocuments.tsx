
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Search, Filter, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { authService } from "@/services/authService";
import DocumentVerification from "@/components/documents/DocumentVerification";

export default function VerificationDocuments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);

  // Récupération des utilisateurs sous-traitants
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["sous-traitants"],
    queryFn: async () => {
      const allUsers = await authService.getAllUsers();
      return allUsers.filter(u => u.role === "sous-traitant");
    }
  });

  const handleUserSelect = (userId: number) => {
    setSelectedParticipantId(userId);
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.entreprise && user.entreprise.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Pour le filtre par statut, nous aurions besoin de récupérer l'état de vérification des documents
    // Ceci est simplifié pour la démonstration
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vérification des documents sous-traitants</h1>
          <Button>Exporter les résultats</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un sous-traitant..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="Validé">Validés</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Rejeté">Rejetés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Liste des sous-traitants</TabsTrigger>
            {selectedParticipantId && (
              <TabsTrigger value="details">Détails des documents</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="list">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isLoading ? (
                <p className="text-gray-500">Chargement des sous-traitants...</p>
              ) : error ? (
                <p className="text-red-500">Erreur lors du chargement des sous-traitants.</p>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sous-traitant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => {
                        // Statut simulé pour la démonstration
                        const status = ["Validé", "En attente", "Rejeté"][Math.floor(Math.random() * 3)];
                        
                        return (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.nom} {user.prenom}</div>
                                  <div className="text-sm text-gray-500">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.entreprise}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.telephone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {status === "Validé" ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  <CheckCircle className="w-4 h-4 mr-1" /> Validé
                                </span>
                              ) : status === "En attente" ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  <AlertTriangle className="w-4 h-4 mr-1" /> En attente
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Rejeté
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUserSelect(user.id)}
                              >
                                Vérifier les documents
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Aucun sous-traitant ne correspond à vos critères.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            {selectedParticipantId && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedParticipantId(null)}
                  >
                    Retour à la liste
                  </Button>
                </div>
                
                <DocumentVerification participantId={selectedParticipantId} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
