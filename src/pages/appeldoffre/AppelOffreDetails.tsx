
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AppelOffre, appelOffreService } from "@/services/appelOffreService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, DollarSign, Users, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formateurService } from "@/services/formateurService";
import { useAuth } from "@/contexts/AuthContext";

export default function AppelOffreDetails() {
  const { id } = useParams<{ id: string }>();
  const [appelOffre, setAppelOffre] = useState<AppelOffre | null>(null);
  const [loading, setLoading] = useState(true);
  const [prestataires, setPrestataires] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const data = await appelOffreService.getAppelOffreById(parseInt(id));
          if (data) {
            setAppelOffre(data);
            
            // Récupérer les infos complètes des prestataires
            if (data.prestataires && data.prestataires.length > 0) {
              const prestataireDetailsPromises = data.prestataires.map(p => 
                appelOffreService.getPrestataireById(p.id)
              );
              const prestataireDetails = await Promise.all(prestataireDetailsPromises);
              setPrestataires(prestataireDetails.filter(p => p !== undefined));
            }
          } else {
            toast({
              title: "Erreur",
              description: "Appel d'offre non trouvé",
              variant: "destructive",
            });
            navigate("/appels-offre");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'appel d'offre",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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

  const getPrestataireStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'Invité':
        return 'outline';
      case 'A répondu':
        return 'secondary';
      case 'Sélectionné':
        return 'success';
      case 'Rejeté':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handlePublier = async () => {
    if (!appelOffre) return;
    
    try {
      const updated = await appelOffreService.publierAppelOffre(appelOffre.id);
      if (updated) {
        setAppelOffre(updated);
        toast({
          title: "Succès",
          description: "L'appel d'offre a été publié avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'appel d'offre",
        variant: "destructive",
      });
    }
  };

  const handleCloturer = async () => {
    if (!appelOffre) return;
    
    try {
      const updated = await appelOffreService.cloturerAppelOffre(appelOffre.id);
      if (updated) {
        setAppelOffre(updated);
        toast({
          title: "Succès",
          description: "L'appel d'offre a été clôturé avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la clôture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de clôturer l'appel d'offre",
        variant: "destructive",
      });
    }
  };

  const handleAttribuer = async (prestataireId: number) => {
    if (!appelOffre) return;
    
    try {
      const updated = await appelOffreService.attribuerAppelOffre(appelOffre.id, prestataireId);
      if (updated) {
        setAppelOffre(updated);
        toast({
          title: "Succès",
          description: "L'appel d'offre a été attribué avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'attribution:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer l'appel d'offre",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-pulse text-center">
            <p className="text-lg">Chargement en cours...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!appelOffre) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Appel d'offre non trouvé</h2>
          <p className="text-muted-foreground mb-4">L'appel d'offre que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate("/appels-offre")}>Retour à la liste</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{appelOffre.titre}</h1>
              <Badge variant={getStatutBadgeVariant(appelOffre.statut) as any}>{appelOffre.statut}</Badge>
            </div>
            <p className="text-muted-foreground">Référence: {appelOffre.reference}</p>
          </div>
          <div className="flex gap-2">
            {appelOffre.statut === 'En préparation' && (
              <Button onClick={handlePublier}>Publier</Button>
            )}
            {appelOffre.statut === 'Publié' && (
              <Button onClick={handleCloturer}>Clôturer</Button>
            )}
            <Button variant="outline" onClick={() => navigate("/appels-offre")}>Retour</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Date de publication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appelOffre.datePublication}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Date de clôture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appelOffre.dateCloture}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-primary" />
                Budget maximum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appelOffre.budgetMaximum?.toLocaleString('fr-FR') || 'Non spécifié'} FCFA</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Demandeur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appelOffre.departementDemandeur}</p>
              <p className="text-sm text-muted-foreground">Responsable: {appelOffre.responsableDemande}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="prestataires">Prestataires</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{appelOffre.description}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Critères</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Expérience minimale</h3>
                    <p>{appelOffre.criteres.experience} ans</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Qualifications requises</h3>
                    <ul className="list-disc pl-5">
                      {appelOffre.criteres.qualification.map((q, index) => (
                        <li key={index}>{q}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Délai d'exécution</h3>
                    <p>{appelOffre.criteres.delai}</p>
                  </div>
                  
                  {appelOffre.criteres.autres && appelOffre.criteres.autres.length > 0 && (
                    <div>
                      <h3 className="font-medium">Autres critères</h3>
                      <ul className="list-disc pl-5">
                        {appelOffre.criteres.autres.map((a, index) => (
                          <li key={index}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prestataires">
            <Card>
              <CardHeader>
                <CardTitle>Prestataires</CardTitle>
                <CardDescription>
                  {appelOffre.prestataires?.length || 0} prestataire(s) concerné(s) par cet appel d'offre
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appelOffre.prestataires && appelOffre.prestataires.length > 0 ? (
                  <div className="space-y-4">
                    {appelOffre.prestataires.map((prestataire) => {
                      const prestataireDetail = prestataires.find(p => p?.id === prestataire.id);
                      
                      return (
                        <Card key={prestataire.id} className="border border-muted">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle>{prestataire.nom}</CardTitle>
                              <Badge variant={getPrestataireStatutBadgeVariant(prestataire.statut) as any}>
                                {prestataire.statut}
                              </Badge>
                            </div>
                            {prestataireDetail && (
                              <CardDescription>
                                {prestataireDetail.specialite.join(", ")}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {prestataire.dateReponse && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">Date de réponse</div>
                                  <div className="text-sm">{prestataire.dateReponse}</div>
                                </div>
                              )}
                              
                              {prestataire.offreTechnique !== undefined && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">Note technique</div>
                                  <div className="text-sm">{prestataire.offreTechnique}/100</div>
                                </div>
                              )}
                              
                              {prestataire.offreFinanciere !== undefined && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">Note financière</div>
                                  <div className="text-sm">{prestataire.offreFinanciere}/100</div>
                                </div>
                              )}
                              
                              {prestataire.montantPropose !== undefined && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">Montant proposé</div>
                                  <div className="text-sm font-medium">{prestataire.montantPropose.toLocaleString('fr-FR')} FCFA</div>
                                </div>
                              )}
                              
                              {appelOffre.statut === 'Clôturé' && prestataire.statut === 'A répondu' && (
                                <div className="mt-4">
                                  <Button 
                                    onClick={() => handleAttribuer(prestataire.id)}
                                    className="w-full"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Sélectionner ce prestataire
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun prestataire n'a encore été invité pour cet appel d'offre.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents requis</CardTitle>
                <CardDescription>
                  Documents à fournir par les prestataires
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appelOffre.documents && appelOffre.documents.length > 0 ? (
                  <div className="space-y-4">
                    {appelOffre.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{doc.nom}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.obligatoire ? 'Obligatoire' : 'Facultatif'}
                            </p>
                          </div>
                        </div>
                        {doc.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">Télécharger</a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun document requis pour cet appel d'offre.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
