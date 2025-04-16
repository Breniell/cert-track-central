
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, DollarSign, Star, Users, FileCheck, Briefcase, Award } from "lucide-react";
import { formateurService } from "@/services/formateurService";
import { Formateur } from "@/types/Formation";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function FormateurProfile() {
  const { id } = useParams<{ id: string }>();
  const formateurId = parseInt(id || "0");
  
  const { data: formateur, isLoading, error } = useQuery({
    queryKey: ['formateur', formateurId],
    queryFn: () => formateurService.getFormateurById(formateurId),
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Formateur>>({});

  useEffect(() => {
    if (formateur) {
      setEditedData(formateur);
    }
  }, [formateur]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialiteChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!editedData.specialites) return;
    
    const newSpecialites = [...editedData.specialites];
    newSpecialites[index] = e.target.value;
    
    setEditedData(prev => ({
      ...prev,
      specialites: newSpecialites,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formateur) {
        await formateurService.updateFormateur(formateur.id, editedData);
        toast({
          title: "Profil mis à jour",
          description: "Les informations du formateur ont été mises à jour avec succès."
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive"
      });
    }
  };

  // Helper function to calculate average score
  const calculateAverageScore = (evaluations: any[] | undefined) => {
    if (!evaluations || evaluations.length === 0) return "N/A";
    // Changed 'eval' to 'evaluation' to avoid reserved word
    const sum = evaluations.reduce((total, evaluation) => total + evaluation.score, 0);
    return (sum / evaluations.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center">
            <p>Chargement du profil formateur...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !formateur) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center">
            <p>Erreur lors du chargement du profil formateur.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const averageScore = calculateAverageScore(formateur.evaluations);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Profil du Formateur</h1>
            <p className="text-muted-foreground">
              Gestion des informations et performances du formateur
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
              <Button onClick={handleSubmit}>Enregistrer</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={`${formateur.prenom} ${formateur.nom}`} />
                <AvatarFallback>{formateur.prenom[0]}{formateur.nom[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{formateur.prenom} {formateur.nom}</CardTitle>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {formateur.specialites.slice(0, 3).map((specialite, index) => (
                  <Badge key={index} variant="secondary">{specialite}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span>Taux horaire: {formateur.tauxHoraire.toLocaleString()} FCFA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>Formations assurées: {formateur.evaluations?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Évaluation moyenne: {averageScore}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                <TabsTrigger value="remuneration">Rémunération</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du formateur</CardTitle>
                    <CardDescription>
                      Détails personnels et professionnels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="prenom">Prénom</Label>
                            <Input 
                              id="prenom" 
                              name="prenom" 
                              value={editedData.prenom || ""} 
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="nom">Nom</Label>
                            <Input 
                              id="nom" 
                              name="nom" 
                              value={editedData.nom || ""} 
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              value={editedData.email || ""} 
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="telephone">Téléphone</Label>
                            <Input 
                              id="telephone" 
                              name="telephone" 
                              value={editedData.telephone || ""} 
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="tauxHoraire">Taux horaire (FCFA)</Label>
                            <Input 
                              id="tauxHoraire" 
                              name="tauxHoraire" 
                              type="number" 
                              value={editedData.tauxHoraire || 0} 
                              onChange={handleInputChange} 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Spécialités</Label>
                          {editedData.specialites?.map((specialite, index) => (
                            <div key={index} className="flex items-center gap-2 mt-2">
                              <Input 
                                value={specialite} 
                                onChange={(e) => handleSpecialiteChange(e, index)} 
                              />
                            </div>
                          ))}
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Prénom</h3>
                            <p>{formateur.prenom}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Nom</h3>
                            <p>{formateur.nom}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                            <p>{formateur.email}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Téléphone</h3>
                            <p>{formateur.telephone || "Non renseigné"}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Taux horaire</h3>
                            <p>{formateur.tauxHoraire.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Spécialités</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formateur.specialites.map((specialite, index) => (
                              <Badge key={index} variant="outline">{specialite}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                    <CardDescription>
                      Qualifications et accréditations du formateur
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formateur.certifications.map((certification, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
                          <Award className="h-5 w-5 text-blue-500 mt-1" />
                          <div>
                            <p className="font-medium">{certification}</p>
                            <p className="text-sm text-muted-foreground">Valide jusqu'au: 31/12/2025</p>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Ajouter une certification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="planning">
                <Card>
                  <CardHeader>
                    <CardTitle>Planning & Disponibilités</CardTitle>
                    <CardDescription>
                      Calendrier de disponibilité du formateur
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-medium">Prochaines formations</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-md">
                          <div className="flex justify-between">
                            <p className="font-medium">Sécurité en hauteur</p>
                            <Badge>À venir</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>15/05/2025</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>08:00 - 16:00</span>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-md">
                          <div className="flex justify-between">
                            <p className="font-medium">Manipulation des produits chimiques</p>
                            <Badge variant="outline">Planifié</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>22/05/2025</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>13:00 - 17:00</span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-medium pt-2">Disponibilités déclarées</h3>
                      {formateur.disponibilites ? (
                        <div className="space-y-2">
                          {formateur.disponibilites.map((dispo, index) => {
                            const dateDebut = new Date(dispo.debut);
                            const dateFin = new Date(dispo.fin);
                            return (
                              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <Calendar className="h-4 w-4 text-green-500" />
                                <span>
                                  {dateDebut.toLocaleDateString('fr-FR')} de {dateDebut.getHours()}h à {dateFin.getHours()}h
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucune disponibilité déclarée</p>
                      )}
                      
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Gérer les disponibilités
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="evaluations">
                <Card>
                  <CardHeader>
                    <CardTitle>Évaluations et Performance</CardTitle>
                    <CardDescription>
                      Retours des participants et statistiques de performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex justify-center items-center p-6 bg-gray-50 rounded-md">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">
                            {averageScore}
                          </div>
                          <div className="flex justify-center my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-5 w-5 ${
                                  formateur.evaluations && 
                                  parseFloat(averageScore as string) >= star 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-gray-300"
                                }`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Basé sur {formateur.evaluations?.length || 0} évaluations
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Commentaires récents</h3>
                        {formateur.evaluations && formateur.evaluations.length > 0 ? (
                          <div className="space-y-4">
                            {formateur.evaluations.map((evaluation, index) => (
                              <div key={index} className="p-3 border rounded-md">
                                <div className="flex justify-between mb-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star 
                                        key={star} 
                                        className={`h-4 w-4 ${
                                          evaluation.score >= star 
                                            ? "text-yellow-400 fill-yellow-400" 
                                            : "text-gray-300"
                                        }`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    Formation #{evaluation.formation}
                                  </span>
                                </div>
                                <p className="text-sm">{evaluation.commentaire}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Aucune évaluation disponible</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="remuneration">
                <Card>
                  <CardHeader>
                    <CardTitle>Rémunération</CardTitle>
                    <CardDescription>
                      Suivi des heures et calcul de rémunération
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">Heures ce mois</p>
                          <p className="text-2xl font-bold">24h</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">Rémunération prévue</p>
                          <p className="text-2xl font-bold">{(24 * formateur.tauxHoraire).toLocaleString()} FCFA</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">Prochaine paiement</p>
                          <p className="text-2xl font-bold">30/04/2025</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Détail des heures</h3>
                        <div className="border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heures</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">Sécurité en hauteur</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">15/03/2025</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">8h</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">{(8 * formateur.tauxHoraire).toLocaleString()} FCFA</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="success">Payé</Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">Manipulation produits chimiques</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">18/03/2025</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">4h</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">{(4 * formateur.tauxHoraire).toLocaleString()} FCFA</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="success">Payé</Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">Maintenance préventive</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">22/03/2025</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">12h</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">{(12 * formateur.tauxHoraire).toLocaleString()} FCFA</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="outline">En attente</Badge>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline">Historique complet</Button>
                        <Button>Exporter rapport</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
