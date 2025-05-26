
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, TrendingUp, Users, Calendar, CheckCircle } from "lucide-react";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";
import FormationCard from "@/components/formations/FormationCard";
import FormationDetails from "@/components/formations/FormationDetails";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RHDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedFormateur, setSelectedFormateur] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const { data: formations, isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: () => formationService.getAllFormations()
  });

  // Simuler les services
  const services = ["IT", "RH", "Production", "Qualité", "Maintenance", "Commercial"];
  
  // Extraire les formateurs uniques
  const formateurs = [...new Set(formations?.map(f => f.formateur) || [])];

  // Filtrer les formations
  const filteredFormations = formations?.filter(formation => {
    const matchSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchService = !selectedService || formation.type === selectedService; // Adaptation pour les données existantes
    const matchFormateur = !selectedFormateur || formation.formateur === selectedFormateur;
    return matchSearch && matchService && matchFormateur;
  });

  // Statistiques
  const totalFormations = formations?.length || 0;
  const activeFormations = formations?.filter(f => f.statut === 'À venir' || f.statut === 'En cours').length || 0;
  const totalParticipants = formations?.reduce((acc, f) => acc + f.participants, 0) || 0;
  const completedFormations = formations?.filter(f => f.statut === 'Terminée').length || 0;

  const handleViewDetails = (id: number) => {
    const formation = formations?.find(f => f.id === id);
    if (formation) {
      setSelectedFormation(formation);
      setIsDetailsOpen(true);
    }
  };

  const handleValidateFormation = (formationId: number) => {
    const formation = formations?.find(f => f.id === formationId);
    if (formation) {
      toast({
        title: "Formation validée",
        description: `La formation "${formation.titre}" a été marquée comme validée`
      });
    }
  };

  const handleExportGlobal = () => {
    if (!formations) return;
    
    const csvContent = [
      "Formation,Formateur,Date,Lieu,Type,Participants,Max Participants,Statut",
      ...formations.map(f => 
        `"${f.titre}","${f.formateur}","${f.date}","${f.lieu}","${f.type}","${f.participants}","${f.maxParticipants}","${f.statut}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formations_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export réussi",
      description: "Le rapport des formations a été téléchargé"
    });
  };

  const handleExportPresences = () => {
    // Simuler un export des présences
    const csvContent = [
      "Formation,Participant,Email,Présence,Date",
      "Sécurité en hauteur,John Doe,john@cimencam.cm,Présent,2024-03-15",
      "Sécurité en hauteur,Jane Smith,jane@cimencam.cm,Présent,2024-03-15",
      "Manipulation produits chimiques,Alice Brown,alice@cimencam.cm,Absent,2024-03-18"
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presences_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export réussi",
      description: "Le rapport des présences a été téléchargé"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cimencam-gray">Tableau de bord RH</h1>
            <p className="text-gray-600 mt-1">
              Vue d'ensemble et gestion des formations de l'entreprise
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportPresences}
              className="text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Présences
            </Button>
            <Button 
              onClick={handleExportGlobal}
              className="bg-cimencam-green hover:bg-green-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Global
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-cimencam-green" />
                Total Formations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">{totalFormations}</div>
              <p className="text-sm text-gray-600">Toutes périodes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-cimencam-green" />
                Formations actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">{activeFormations}</div>
              <p className="text-sm text-gray-600">En cours et à venir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray flex items-center">
                <Users className="w-5 h-5 mr-2 text-cimencam-green" />
                Total Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">{totalParticipants}</div>
              <p className="text-sm text-gray-600">Toutes formations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-cimencam-gray flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-cimencam-green" />
                Formations terminées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cimencam-green">{completedFormations}</div>
              <p className="text-sm text-gray-600">Validées</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cimencam-gray">
              <Filter className="w-5 h-5 mr-2" />
              Filtres et recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les services</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFormateur} onValueChange={setSelectedFormateur}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par formateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les formateurs</SelectItem>
                  {formateurs.map(formateur => (
                    <SelectItem key={formateur} value={formateur}>{formateur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des formations */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toutes les formations</TabsTrigger>
            <TabsTrigger value="active">Formations actives</TabsTrigger>
            <TabsTrigger value="completed">Formations terminées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500">Chargement...</p>
              ) : filteredFormations && filteredFormations.length > 0 ? (
                filteredFormations.map(formation => (
                  <div key={formation.id} className="relative">
                    <FormationCard
                      formation={formation}
                      onViewDetails={handleViewDetails}
                    />
                    {formation.statut === 'Terminée' && (
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleValidateFormation(formation.id)}
                          className="text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Valider
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune formation trouvée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              {formations?.filter(f => f.statut === 'À venir' || f.statut === 'En cours').map(formation => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {formations?.filter(f => f.statut === 'Terminée').map(formation => (
                <div key={formation.id} className="relative">
                  <FormationCard
                    formation={formation}
                    onViewDetails={handleViewDetails}
                  />
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleValidateFormation(formation.id)}
                      className="text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Valider
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FormationDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
      />
    </Layout>
  );
}
