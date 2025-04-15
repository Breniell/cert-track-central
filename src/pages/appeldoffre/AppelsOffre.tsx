
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AppelOffre, appelOffreService } from "@/services/appelOffreService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  BarChart, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function AppelsOffre() {
  const [appelsOffre, setAppelsOffre] = useState<AppelOffre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await appelOffreService.getAllAppelsOffre();
        setAppelsOffre(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des appels d'offre:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les appels d'offre",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCountByStatus = (status: AppelOffre['statut']) => {
    return appelsOffre.filter(ao => ao.statut === status).length;
  };

  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'En préparation':
        return 'outline';
      case 'Publié':
        return 'secondary';
      case 'Clôturé':
        return 'default';
      case 'Attribué':
        return 'success';
      case 'Annulé':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleNouvelAppelOffre = () => {
    navigate("/appels-offre/nouveau");
  };

  const handleViewDetails = (id: number) => {
    navigate(`/appels-offre/${id}`);
  };

  // Filtrer les appels d'offre par statut (pour les onglets) et terme de recherche
  const filteredAppelsOffre = (statut?: AppelOffre['statut']) => {
    return appelsOffre
      .filter(ao => !statut || ao.statut === statut)
      .filter(ao => 
        ao.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ao.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ao.typeFormation.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Appels d'Offre
            </h1>
            <p className="text-muted-foreground">
              Gestion des appels d'offre pour les formations externes
            </p>
          </div>
          <Button onClick={handleNouvelAppelOffre}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel appel d'offre
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                En préparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCountByStatus('En préparation')}</div>
              <CardDescription>appels d'offre</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Publiés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCountByStatus('Publié')}</div>
              <CardDescription>appels d'offre</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Attribués
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCountByStatus('Attribué')}</div>
              <CardDescription>appels d'offre</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-purple-500" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appelsOffre.length}</div>
              <CardDescription>appels d'offre</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un appel d'offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="tous">
          <TabsList>
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="en-preparation">En préparation</TabsTrigger>
            <TabsTrigger value="publié">Publiés</TabsTrigger>
            <TabsTrigger value="clôturé">Clôturés</TabsTrigger>
            <TabsTrigger value="attribué">Attribués</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tous">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse text-center">
                  <p className="text-lg">Chargement des appels d'offre...</p>
                </div>
              </div>
            ) : filteredAppelsOffre().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAppelsOffre().map((ao) => (
                  <Card key={ao.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(ao.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ao.titre}</CardTitle>
                        <Badge variant={getStatutBadgeVariant(ao.statut) as any}>{ao.statut}</Badge>
                      </div>
                      <CardDescription>{ao.reference}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ao.description}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Type:</div>
                        <div className="font-medium">{ao.typeFormation}</div>
                        
                        <div className="text-muted-foreground">Publication:</div>
                        <div className="font-medium">{ao.datePublication}</div>
                        
                        <div className="text-muted-foreground">Clôture:</div>
                        <div className="font-medium">{ao.dateCloture}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(ao.id);
                      }}>
                        Voir les détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">Aucun appel d'offre ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="en-preparation">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse text-center">
                  <p className="text-lg">Chargement des appels d'offre...</p>
                </div>
              </div>
            ) : filteredAppelsOffre('En préparation').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAppelsOffre('En préparation').map((ao) => (
                  <Card key={ao.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(ao.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ao.titre}</CardTitle>
                        <Badge variant="outline">{ao.statut}</Badge>
                      </div>
                      <CardDescription>{ao.reference}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ao.description}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Type:</div>
                        <div className="font-medium">{ao.typeFormation}</div>
                        
                        <div className="text-muted-foreground">Département:</div>
                        <div className="font-medium">{ao.departementDemandeur}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(ao.id);
                      }}>
                        Voir les détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">Aucun appel d'offre en préparation ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="publié">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse text-center">
                  <p className="text-lg">Chargement des appels d'offre...</p>
                </div>
              </div>
            ) : filteredAppelsOffre('Publié').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAppelsOffre('Publié').map((ao) => (
                  <Card key={ao.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(ao.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ao.titre}</CardTitle>
                        <Badge variant="secondary">{ao.statut}</Badge>
                      </div>
                      <CardDescription>{ao.reference}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ao.description}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Publication:</div>
                        <div className="font-medium">{ao.datePublication}</div>
                        
                        <div className="text-muted-foreground">Clôture:</div>
                        <div className="font-medium">{ao.dateCloture}</div>
                        
                        <div className="text-muted-foreground">Prestataires:</div>
                        <div className="font-medium">{ao.prestataires?.length || 0}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(ao.id);
                      }}>
                        Voir les détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">Aucun appel d'offre publié ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="clôturé">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse text-center">
                  <p className="text-lg">Chargement des appels d'offre...</p>
                </div>
              </div>
            ) : filteredAppelsOffre('Clôturé').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAppelsOffre('Clôturé').map((ao) => (
                  <Card key={ao.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(ao.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ao.titre}</CardTitle>
                        <Badge>{ao.statut}</Badge>
                      </div>
                      <CardDescription>{ao.reference}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Clôture:</div>
                        <div className="font-medium">{ao.dateCloture}</div>
                        
                        <div className="text-muted-foreground">Prestataires:</div>
                        <div className="font-medium">{ao.prestataires?.filter(p => p.statut === 'A répondu' || p.statut === 'Sélectionné').length || 0}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(ao.id);
                      }}>
                        Voir les détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">Aucun appel d'offre clôturé ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="attribué">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse text-center">
                  <p className="text-lg">Chargement des appels d'offre...</p>
                </div>
              </div>
            ) : filteredAppelsOffre('Attribué').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAppelsOffre('Attribué').map((ao) => (
                  <Card key={ao.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(ao.id)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ao.titre}</CardTitle>
                        <Badge variant="success">{ao.statut}</Badge>
                      </div>
                      <CardDescription>{ao.reference}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Clôture:</div>
                        <div className="font-medium">{ao.dateCloture}</div>
                        
                        <div className="text-muted-foreground">Prestataire:</div>
                        <div className="font-medium">
                          {ao.prestataires?.find(p => p.id === ao.prestataireSeletionne)?.nom || 'Non spécifié'}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(ao.id);
                      }}>
                        Voir les détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">Aucun appel d'offre attribué ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
