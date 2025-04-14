
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FileText, Plus, Search, Filter, Upload, Building, Calendar, PenSquare, Clock, Check, X, ChevronRight, Eye } from "lucide-react";

// Types pour les appels d'offres
interface AppelOffre {
  id: number;
  titre: string;
  reference: string;
  departement: string;
  datePublication: string;
  dateCloture: string;
  statut: 'En préparation' | 'Publié' | 'Clôturé' | 'Attribué';
  prestatairesRepondus: number;
  prestaireSelectionne?: string;
  budget: number;
  description: string;
}

// Données de démonstration
const appelsOffreData: AppelOffre[] = [
  {
    id: 1,
    titre: "Formation en gestion de projet industriel",
    reference: "AO-FORM-2024-001",
    departement: "Production",
    datePublication: "2024-02-15",
    dateCloture: "2024-03-01",
    statut: "Attribué",
    prestatairesRepondus: 5,
    prestaireSelectionne: "FormaPro Consulting",
    budget: 3500000,
    description: "Formation avancée en gestion de projet pour 15 chefs d'équipe du département production."
  },
  {
    id: 2,
    titre: "Formation technique en soudure TIG",
    reference: "AO-FORM-2024-002",
    departement: "Maintenance",
    datePublication: "2024-03-01",
    dateCloture: "2024-03-20",
    statut: "Clôturé",
    prestatairesRepondus: 3,
    budget: 2800000,
    description: "Formation spécialisée en techniques de soudure TIG pour 8 techniciens de maintenance."
  },
  {
    id: 3,
    titre: "Formation en excellence opérationnelle",
    reference: "AO-FORM-2024-003",
    departement: "Qualité",
    datePublication: "2024-03-10",
    dateCloture: "2024-04-05",
    statut: "Publié",
    prestatairesRepondus: 2,
    budget: 4200000,
    description: "Formation sur les méthodologies Lean et Six Sigma pour 12 cadres du département qualité."
  },
  {
    id: 4,
    titre: "Formation en techniques de vente B2B",
    reference: "AO-FORM-2024-004",
    departement: "Commercial",
    datePublication: "",
    dateCloture: "",
    statut: "En préparation",
    prestatairesRepondus: 0,
    budget: 1800000,
    description: "Formation aux méthodes de vente B2B pour l'équipe commerciale (8 personnes)."
  }
];

export default function AppelsOffre() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [selectedAppelOffre, setSelectedAppelOffre] = useState<AppelOffre | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  
  const filteredAppelsOffre = appelsOffreData.filter(appel => {
    const matchesSearch = 
      appel.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appel.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appel.departement.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "Tous" || appel.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewDetails = (appel: AppelOffre) => {
    setSelectedAppelOffre(appel);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En préparation":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En préparation</Badge>;
      case "Publié":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Publié</Badge>;
      case "Clôturé":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Clôturé</Badge>;
      case "Attribué":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Attribué</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(montant) + " FCFA";
  };
  
  const handleCreateAppelOffre = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appel d'offre créé",
      description: "Le nouvel appel d'offre a été créé avec succès."
    });
    setIsNewDialogOpen(false);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Appels d'Offres</h1>
          <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel appel d'offres
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleCreateAppelOffre}>
                <DialogHeader>
                  <DialogTitle>Créer un nouvel appel d'offres</DialogTitle>
                  <DialogDescription>
                    Définissez les détails de l'appel d'offres pour votre formation externe.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="titre" className="text-right">
                      Titre
                    </Label>
                    <Input
                      id="titre"
                      placeholder="Titre de l'appel d'offres"
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="departement" className="text-right">
                      Département
                    </Label>
                    <Select>
                      <SelectTrigger id="departement" className="col-span-3">
                        <SelectValue placeholder="Sélectionnez un département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="qualite">Qualité</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="rh">Ressources Humaines</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget" className="text-right">
                      Budget
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Budget en FCFA"
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateCloture" className="text-right">
                      Date de clôture
                    </Label>
                    <Input
                      id="dateCloture"
                      type="date"
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez les besoins et exigences de la formation"
                      className="col-span-3"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Documents
                    </Label>
                    <div className="col-span-3">
                      <Button type="button" variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Téléverser un cahier des charges
                      </Button>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer l'appel d'offres</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un appel d'offres..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="En préparation">En préparation</SelectItem>
                <SelectItem value="Publié">Publié</SelectItem>
                <SelectItem value="Clôturé">Clôturé</SelectItem>
                <SelectItem value="Attribué">Attribué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="liste" className="w-full">
          <TabsList>
            <TabsTrigger value="liste">Liste des appels d'offres</TabsTrigger>
            {selectedAppelOffre && (
              <TabsTrigger value="details">Détails de l'appel d'offres</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="liste">
            <div className="space-y-4">
              {filteredAppelsOffre.length > 0 ? (
                filteredAppelsOffre.map((appel) => (
                  <Card key={appel.id} className="hover:border-primary hover:shadow-sm transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{appel.titre}</CardTitle>
                          <CardDescription>Réf: {appel.reference}</CardDescription>
                        </div>
                        {getStatusBadge(appel.statut)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{appel.departement}</span>
                        </div>
                        
                        {appel.datePublication && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Pub: {new Date(appel.datePublication).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        
                        {appel.dateCloture && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Clôture: {new Date(appel.dateCloture).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center font-medium">
                          <span>{formatMontant(appel.budget)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        <p className="text-gray-600 line-clamp-2">{appel.description}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-gray-500">
                        {appel.prestatairesRepondus} prestataire(s) {appel.statut === 'Clôturé' || appel.statut === 'Attribué' ? 'ont répondu' : 'ont répondu pour l\'instant'}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(appel)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-40">
                    <p className="text-gray-500">Aucun appel d'offres ne correspond à vos critères.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            {selectedAppelOffre && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{selectedAppelOffre.titre}</CardTitle>
                        <CardDescription>Référence: {selectedAppelOffre.reference}</CardDescription>
                      </div>
                      {getStatusBadge(selectedAppelOffre.statut)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Département</p>
                        <p className="font-medium">{selectedAppelOffre.departement}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-medium">{formatMontant(selectedAppelOffre.budget)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Prestataires</p>
                        <p className="font-medium">{selectedAppelOffre.prestatairesRepondus} réponses</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Date de publication</p>
                        <p className="font-medium">
                          {selectedAppelOffre.datePublication 
                            ? new Date(selectedAppelOffre.datePublication).toLocaleDateString('fr-FR') 
                            : "Non publié"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Date de clôture</p>
                        <p className="font-medium">
                          {selectedAppelOffre.dateCloture 
                            ? new Date(selectedAppelOffre.dateCloture).toLocaleDateString('fr-FR') 
                            : "Non définie"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Description</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{selectedAppelOffre.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Documents associés</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-gray-400" />
                          <span className="text-sm">cahier_des_charges_{selectedAppelOffre.reference}.pdf</span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {selectedAppelOffre.statut === 'Attribué' && selectedAppelOffre.prestaireSelectionne && (
                      <div className="bg-green-50 p-4 rounded-md">
                        <div className="flex items-center">
                          <Check className="w-5 h-5 mr-2 text-green-600" />
                          <div>
                            <p className="font-medium">Appel d'offres attribué à:</p>
                            <p className="text-green-800">{selectedAppelOffre.prestaireSelectionne}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedAppelOffre(null)}>
                      Retour à la liste
                    </Button>
                    
                    <div className="flex gap-2">
                      {selectedAppelOffre.statut === 'En préparation' && (
                        <>
                          <Button variant="outline">
                            <PenSquare className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                          <Button>
                            Publier
                          </Button>
                        </>
                      )}
                      
                      {selectedAppelOffre.statut === 'Publié' && (
                        <Button>
                          Clôturer
                        </Button>
                      )}
                      
                      {selectedAppelOffre.statut === 'Clôturé' && (
                        <Button>
                          Attribuer
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
                
                {(selectedAppelOffre.statut === 'Clôturé' || selectedAppelOffre.statut === 'Attribué') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prestataires ayant répondu</CardTitle>
                      <CardDescription>
                        Liste des prestataires et leurs propositions pour cet appel d'offres
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prestataire</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de réponse</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* Données de démonstration */}
                            <tr className={selectedAppelOffre.prestaireSelectionne === "FormaPro Consulting" ? "bg-green-50" : ""}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">FormaPro Consulting</div>
                                <div className="text-sm text-gray-500">contact@formapro.com</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                2024-02-20
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                3.200.000 FCFA
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {selectedAppelOffre.prestaireSelectionne === "FormaPro Consulting" ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Check className="w-3 h-3 mr-1" /> Sélectionné
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Répondu</Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-3 h-3 mr-1" /> Voir
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">SkillDev Centre</div>
                                <div className="text-sm text-gray-500">info@skilldev.com</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                2024-02-22
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                3.500.000 FCFA
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">Répondu</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-3 h-3 mr-1" /> Voir
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
