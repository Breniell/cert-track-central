
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formateurService } from "@/services/formateurService";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Phone,
  Award,
  Clock,
  Calendar,
  BarChart3,
  Star,
} from "lucide-react";
import { FormateurPerformanceChart } from "@/components/formateurs/FormateurPerformanceChart";
import { FormateurAvailabilityCalendar } from "@/components/formateurs/FormateurAvailabilityCalendar";
import { FormateurSessionsList } from "@/components/formateurs/FormateurSessionsList";

export default function FormateurProfile() {
  const { id } = useParams<{ id: string }>();
  const formateurId = parseInt(id || "0");

  const { data: formateur, isLoading, error } = useQuery({
    queryKey: ["formateur", formateurId],
    queryFn: () => formateurService.getFormateurById(formateurId),
    enabled: !!formateurId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-lg">Chargement du profil formateur...</span>
        </div>
      </Layout>
    );
  }

  if (error || !formateur) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <span className="text-lg text-red-500">
            Erreur lors du chargement du profil formateur
          </span>
          <Button asChild>
            <Link to="/formateurs">Retour à la liste des formateurs</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const averageScore =
    formateur.evaluations && formateur.evaluations.length > 0
      ? formateur.evaluations.reduce(
          (sum, evaluation) => sum + evaluation.score,
          0
        ) / formateur.evaluations.length
      : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link to="/formateurs" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Modifier
            </Button>
            <Button size="sm">Programmer une formation</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {formateur.prenom} {formateur.nom}
                  </CardTitle>
                  <CardDescription>Formateur</CardDescription>
                </div>
                {averageScore > 0 && (
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-green-500 text-green-500" />
                    <span className="font-medium">
                      {averageScore.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {formateur.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {formateur.telephone}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Spécialités</h3>
                <div className="flex flex-wrap gap-2">
                  {formateur.specialites.map((specialite, index) => (
                    <Badge key={index} variant="secondary">
                      {specialite}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {formateur.certifications.map((certification, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      {certification}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tarification</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Taux horaire</span>
                    <span className="font-semibold">
                      {formateur.tauxHoraire.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="performance">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="disponibilite">Disponibilité</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Évaluations et Feedback
                    </CardTitle>
                    <CardDescription>
                      Performance basée sur les retours des participants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormateurPerformanceChart formateur={formateur} />
                  </CardContent>
                </Card>

                {formateur.evaluations && formateur.evaluations.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Commentaires récents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formateur.evaluations.map((evaluation, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-md"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-medium">
                                  {evaluation.score.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                Formation #{evaluation.formation}
                              </span>
                            </div>
                            <p className="text-sm">{evaluation.commentaire}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="disponibilite" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Calendrier de disponibilité
                    </CardTitle>
                    <CardDescription>
                      Périodes durant lesquelles le formateur est disponible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormateurAvailabilityCalendar formateur={formateur} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Périodes disponibles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formateur.disponibilites &&
                    formateur.disponibilites.length > 0 ? (
                      <div className="space-y-2">
                        {formateur.disponibilites.map((dispo, index) => {
                          const debut = new Date(dispo.debut);
                          const fin = new Date(dispo.fin);
                          return (
                            <div
                              key={index}
                              className="flex items-center p-2 border rounded-md"
                            >
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <div className="font-medium">
                                  {debut.toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {debut.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {fin.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        Aucune disponibilité enregistrée
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sessions" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Sessions de formation
                    </CardTitle>
                    <CardDescription>
                      Historique et planification des sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormateurSessionsList formateurId={formateurId} />
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
