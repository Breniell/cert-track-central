
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  BarChart3,
  Bell,
  Calendar,
  Check,
  ClipboardList,
  Cog,
  Database,
  FileText,
  HardDrive,
  Lock,
  LucideIcon,
  MessageSquare,
  PieChart,
  Play,
  Save,
  Search,
  Settings,
  Shield,
  Sliders,
  Sparkles,
  UploadCloud,
  User,
  Users
} from "lucide-react";

// Types pour les modules et statistiques
interface AdminModule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  route: string;
  status: "active" | "maintenance" | "développement";
}

interface SystemStat {
  name: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status: "success" | "warning" | "error" | "info";
}

const AdminConsole = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Données de démonstration pour les modules administrateur
  const adminModules: AdminModule[] = [
    {
      id: "planning",
      name: "Planification des formations",
      description: "Gérer le calendrier et la programmation des formations HSE et métiers",
      icon: Calendar,
      route: "/planning",
      status: "active"
    },
    {
      id: "formateurs",
      name: "Gestion des formateurs",
      description: "Profils, disponibilités et évaluation des formateurs",
      icon: Users,
      route: "/formateurs",
      status: "active"
    },
    {
      id: "participants",
      name: "Gestion des participants",
      description: "Inscriptions, présences et suivi des participants",
      icon: User,
      route: "/participants",
      status: "active"
    },
    {
      id: "verification",
      name: "Vérification des documents",
      description: "Contrôle des documents administratifs des sous-traitants",
      icon: ClipboardList,
      route: "/hse/verification-documents",
      status: "active"
    },
    {
      id: "budget",
      name: "Gestion budgétaire",
      description: "Suivi des coûts et analyse ROI des formations",
      icon: BarChart3,
      route: "/budget",
      status: "active"
    },
    {
      id: "collaboration",
      name: "Espace collaboratif",
      description: "Forum, messagerie et centre documentaire",
      icon: MessageSquare,
      route: "/collaboration",
      status: "active"
    },
    {
      id: "appelsoffre",
      name: "Appels d'offres",
      description: "Gestion des appels d'offres pour formations externes",
      icon: FileText,
      route: "/appels-offre",
      status: "active"
    },
    {
      id: "evaluation",
      name: "Évaluations et tests",
      description: "Création et gestion des évaluations de formation",
      icon: ClipboardList,
      route: "/evaluations",
      status: "développement"
    },
    {
      id: "pointage",
      name: "Système de pointage",
      description: "Gestion des présences par QR code et badges",
      icon: Check,
      route: "/pointage",
      status: "maintenance"
    }
  ];
  
  // Données pour les statistiques système
  const systemStats: SystemStat[] = [
    { name: "Utilisateurs actifs", value: 127, icon: Users, status: "success" },
    { name: "Sessions formation", value: 42, icon: Calendar, status: "success" },
    { name: "Espace stockage", value: "71.2", unit: "GB", icon: HardDrive, status: "warning" },
    { name: "Dernière sauvegarde", value: "2h36", icon: Save, status: "success" },
    { name: "Incidents sécurité", value: 0, icon: Shield, status: "success" },
    { name: "Temps réponse moyen", value: "1.8", unit: "s", icon: Sparkles, status: "success" }
  ];
  
  // Filtrage des modules en fonction de la recherche
  const filteredModules = adminModules.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleModuleClick = (route: string) => {
    navigate(route);
  };
  
  const handleBackupSystem = () => {
    toast({
      title: "Sauvegarde initiée",
      description: "La sauvegarde complète du système a été lancée et sera disponible dans quelques minutes."
    });
  };
  
  const handleMaintenanceMode = () => {
    toast({
      title: "Mode maintenance activé",
      description: "Le système est maintenant en mode maintenance. Seuls les administrateurs peuvent s'y connecter."
    });
  };
  
  const handleCacheRefresh = () => {
    toast({
      title: "Cache rafraîchi",
      description: "Le cache système a été vidé et rechargé avec succès."
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Console d'administration</h1>
            <p className="text-gray-500">Contrôle central de la plateforme de gestion des formations</p>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button variant="outline" size="sm" onClick={handleCacheRefresh}>
              <Sparkles className="mr-2 h-4 w-4" />
              Rafraîchir cache
            </Button>
            <Button variant="outline" size="sm" className="text-yellow-600" onClick={handleMaintenanceMode}>
              <Cog className="mr-2 h-4 w-4" />
              Mode maintenance
            </Button>
            <Button size="sm" onClick={handleBackupSystem}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="parametres">Paramètres</TabsTrigger>
          </TabsList>
          
          {/* Tableau de bord */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Statistiques système */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      État du système
                    </CardTitle>
                    <CardDescription>
                      Performances et statistiques en temps réel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {systemStats.map((stat, index) => (
                        <div key={index} className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{stat.name}</span>
                            <stat.icon className={`h-5 w-5 ${
                              stat.status === 'success' ? 'text-green-500' : 
                              stat.status === 'warning' ? 'text-amber-500' : 
                              stat.status === 'error' ? 'text-red-500' : 'text-blue-500'
                            }`} />
                          </div>
                          <div className="flex items-end">
                            <span className="text-2xl font-semibold">{stat.value}</span>
                            {stat.unit && <span className="ml-1 text-sm text-gray-500">{stat.unit}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Accès rapides */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Accès rapides
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" onClick={() => navigate("/planning")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Planning des formations
                    </Button>
                    <Button className="w-full justify-start" onClick={() => navigate("/hse/verification-documents")}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Vérification documents
                    </Button>
                    <Button className="w-full justify-start" onClick={() => navigate("/collaboration")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Espace collaboratif
                    </Button>
                    <Button className="w-full justify-start" onClick={() => navigate("/appels-offre")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Appels d'offres
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Alertes et notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Alertes et notifications
                </CardTitle>
                <CardDescription>
                  Événements récents nécessitant votre attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
                  <Bell className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">Recyclage de formation requis</h4>
                    <p className="text-sm text-amber-700">8 sous-traitants ont des formations HSE qui expirent dans moins de 30 jours.</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate("/participants")}>
                      Voir les détails
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                  <HardDrive className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Espace de stockage limité</h4>
                    <p className="text-sm text-blue-700">L'espace de stockage disponible est inférieur à 30%. Envisagez de nettoyer les anciens fichiers.</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveTab("parametres")}>
                      Gérer le stockage
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <PieChart className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800">Rapports mensuels disponibles</h4>
                    <p className="text-sm text-green-700">Les rapports d'activité pour le mois précédent sont prêts à être consultés.</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Télécharger les rapports
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Modules */}
          <TabsContent value="modules" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Rechercher un module..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredModules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base flex items-center">
                        <module.icon className="mr-2 h-5 w-5" />
                        {module.name}
                      </CardTitle>
                      <Badge variant={
                        module.status === "active" ? "default" :
                        module.status === "maintenance" ? "outline" : "secondary"
                      }>
                        {module.status === "active" ? "Actif" :
                         module.status === "maintenance" ? "Maintenance" : "En développement"}
                      </Badge>
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full"
                      disabled={module.status !== "active"}
                      onClick={() => handleModuleClick(module.route)}
                    >
                      {module.status === "active" ? "Accéder" : 
                       module.status === "maintenance" ? "En maintenance" : "Bientôt disponible"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Paramètres */}
          <TabsContent value="parametres" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Paramètres système */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Paramètres système
                  </CardTitle>
                  <CardDescription>
                    Configuration générale de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Mode maintenance</h4>
                      <p className="text-xs text-gray-500">Restreint l'accès aux administrateurs uniquement</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Notifications par email</h4>
                      <p className="text-xs text-gray-500">Envoyer des alertes par email aux utilisateurs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Notifications SMS</h4>
                      <p className="text-xs text-gray-500">Envoyer des alertes par SMS pour les formations urgentes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Journal d'audit</h4>
                      <p className="text-xs text-gray-500">Enregistrer toutes les actions des administrateurs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Fréquence des sauvegardes</h4>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Rétention des données</h4>
                    <Select defaultValue="3years">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 an</SelectItem>
                        <SelectItem value="3years">3 ans</SelectItem>
                        <SelectItem value="5years">5 ans</SelectItem>
                        <SelectItem value="indefinite">Indéfinie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              {/* Paramètres de sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Paramètres de sécurité
                  </CardTitle>
                  <CardDescription>
                    Sécurité et contrôle d'accès
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Authentification à 2 facteurs</h4>
                      <p className="text-xs text-gray-500">Exiger l'authentification à deux facteurs pour tous les administrateurs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Déconnexion automatique</h4>
                      <p className="text-xs text-gray-500">Déconnecter automatiquement après une période d'inactivité</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Délai de déconnexion</h4>
                    <Select defaultValue="30min">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un délai" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15min">15 minutes</SelectItem>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="60min">1 heure</SelectItem>
                        <SelectItem value="120min">2 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Complexité des mots de passe</h4>
                    <Select defaultValue="strong">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medium">Moyenne (8 caractères min.)</SelectItem>
                        <SelectItem value="strong">Élevée (10 car. avec chiffres et symboles)</SelectItem>
                        <SelectItem value="very-strong">Très élevée (12 car. avec majuscules, chiffres et symboles)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Lancer un audit de sécurité
                    </Button>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full" variant="outline">
                      <User className="mr-2 h-4 w-4" />
                      Gérer les permissions utilisateurs
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Intégrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Intégrations
                  </CardTitle>
                  <CardDescription>
                    Connexions avec les systèmes externes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">API RESTful</h4>
                      <p className="text-xs text-gray-500">Activer l'API pour l'intégration avec d'autres systèmes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Synchronisation ERP</h4>
                      <p className="text-xs text-gray-500">Synchroniser les données avec le système ERP</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Authentification SSO</h4>
                      <p className="text-xs text-gray-500">Utiliser l'authentification unique pour tous les services</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Fréquence de synchronisation</h4>
                    <Select defaultValue="hourly">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Temps réel</SelectItem>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" variant="outline">
                      <Play className="mr-2 h-4 w-4" />
                      Tester les connexions
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Optimisation performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Sliders className="mr-2 h-5 w-5" />
                    Optimisation performance
                  </CardTitle>
                  <CardDescription>
                    Paramètres affectant les performances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Mise en cache</h4>
                      <p className="text-xs text-gray-500">Activer la mise en cache pour améliorer les performances</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Compression des données</h4>
                      <p className="text-xs text-gray-500">Compresser les données pour réduire la bande passante</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Durée du cache</h4>
                    <Select defaultValue="1hour">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15min">15 minutes</SelectItem>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hour">1 heure</SelectItem>
                        <SelectItem value="24hours">24 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Limites d'utilisation API</h4>
                    <Select defaultValue="1000">
                      <SelectTrigger>
                        <SelectValue placeholder="Requêtes par heure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500 requêtes/heure</SelectItem>
                        <SelectItem value="1000">1000 requêtes/heure</SelectItem>
                        <SelectItem value="5000">5000 requêtes/heure</SelectItem>
                        <SelectItem value="unlimited">Illimité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" variant="outline" onClick={handleCacheRefresh}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Vider le cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Annuler les modifications</Button>
              <Button onClick={() => {
                toast({
                  title: "Paramètres sauvegardés",
                  description: "Les modifications ont été enregistrées avec succès."
                });
              }}>
                Enregistrer les paramètres
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminConsole;
