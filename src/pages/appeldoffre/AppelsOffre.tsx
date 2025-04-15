
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus,
  CalendarClock,
  Building,
  Building2,
  Users,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  ArrowUpRight
} from "lucide-react";
import { AppelOffre, appelOffreService } from "@/services/appelOffreService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AppelsOffre() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appelsOffre, setAppelsOffre] = useState<AppelOffre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("Tous");

  useEffect(() => {
    const fetchAppelsOffre = async () => {
      try {
        const data = await appelOffreService.getAllAppelsOffre();
        setAppelsOffre(data);
      } catch (error) {
        console.error("Erreur lors du chargement des appels d'offre:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppelsOffre();
  }, []);

  const filteredAppelsOffre = appelsOffre.filter(ao => {
    const matchesSearch = ao.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ao.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ao.departementDemandeur.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "Tous" || ao.typeFormation === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getStatutBadge = (statut: AppelOffre["statut"]) => {
    const variants = {
      "En préparation": { color: "bg-blue-100 text-blue-700", icon: Clock },
      "Publié": { color: "bg-amber-100 text-amber-700", icon: FileCheck },
      "Clôturé": { color: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
      "Attribué": { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
      "Annulé": { color: "bg-red-100 text-red-700", icon: XCircle }
    };
    
    const variant = variants[statut] || variants["En préparation"];
    
    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded ${variant.color}`}>
        <variant.icon className="h-4 w-4" />
        <span className="text-xs font-medium">{statut}</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Appels d'Offre</h1>
            <p className="text-gray-500 mt-1">
              Gérez les appels d'offre pour les formations externes
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvel Appel d'Offre
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                En préparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appelsOffre.filter(ao => ao.statut === "En préparation").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-amber-500" />
                Publiés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appelsOffre.filter(ao => ao.statut === "Publié").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                Attribués
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appelsOffre.filter(ao => ao.statut === "Attribué").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-purple-500" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appelsOffre.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Rechercher un appel d'offre..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les types</SelectItem>
              <SelectItem value="HSE">HSE</SelectItem>
              <SelectItem value="Métier">Métier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="preparation">En préparation</TabsTrigger>
            <TabsTrigger value="published">Publiés</TabsTrigger>
            <TabsTrigger value="closed">Clôturés / Attribués</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des appels d'offre...</p>
              </div>
            ) : filteredAppelsOffre.length > 0 ? (
              <div className="space-y-4">
                {filteredAppelsOffre.map((ao) => (
                  <Card key={ao.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-normal">
                              {ao.reference}
                            </Badge>
                            <Badge
                              variant={ao.typeFormation === "HSE" ? "default" : "secondary"}
                            >
                              {ao.typeFormation}
                            </Badge>
                          </div>
                          <CardTitle className="mt-2">{ao.titre}</CardTitle>
                          <CardDescription>{ao.description}</CardDescription>
                        </div>
                        {getStatutBadge(ao.statut)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Publication</div>
                            <div className="text-gray-500">{ao.datePublication || "Non publié"}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Clôture</div>
                            <div className="text-gray-500">{ao.dateCloture || "Non défini"}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Département</div>
                            <div className="text-gray-500">{ao.departementDemandeur}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Prestataires</div>
                            <div className="text-gray-500">
                              {ao.prestataires ? `${ao.prestataires.length} invité(s)` : "Aucun invité"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end bg-gray-50">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/appels-offre/${ao.id}`} className="flex items-center gap-1">
                          Voir les détails
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun appel d'offre ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Les autres onglets auraient un contenu similaire mais filtré */}
          <TabsContent value="preparation">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Filtrage par statut "En préparation".</p>
            </div>
          </TabsContent>
          
          <TabsContent value="published">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Filtrage par statut "Publié".</p>
            </div>
          </TabsContent>
          
          <TabsContent value="closed">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Filtrage par statut "Clôturé" ou "Attribué".</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
