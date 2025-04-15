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
    // Changed 'eval' to 'evaluation' to avoid reserved word errors
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
