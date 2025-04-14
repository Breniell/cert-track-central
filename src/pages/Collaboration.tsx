
import Layout from "@/components/layout/Layout";
import CollaborationModule from "@/components/collaborative/CollaborationModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Bell, Calendar, UserPlus } from "lucide-react";

export default function Collaboration() {
  // Données de démonstration pour les utilisateurs actifs
  const activeUsers = [
    { id: 1, name: "Jean Dupont", role: "Formateur", avatar: "/placeholder.svg", status: "online" },
    { id: 2, name: "Marie Martin", role: "Responsable HSE", avatar: "/placeholder.svg", status: "online" },
    { id: 3, name: "Sophie Leroux", role: "Formatrice", avatar: "/placeholder.svg", status: "offline" },
    { id: 4, name: "Michel Bernard", role: "Responsable RH", avatar: "/placeholder.svg", status: "offline" },
    { id: 5, name: "Pierre Dubois", role: "Formateur", avatar: "/placeholder.svg", status: "online" }
  ];
  
  // Données de démonstration pour les événements à venir
  const upcomingEvents = [
    { 
      id: 1, 
      title: "Formation Sécurité en hauteur", 
      date: "2024-03-15", 
      time: "09:00 - 17:00", 
      location: "Site A - Salle 102",
      participants: 8
    },
    { 
      id: 2, 
      title: "Réunion préparatoire - Manipulation produits chimiques", 
      date: "2024-03-12", 
      time: "14:00 - 15:30", 
      location: "Salle de conférence",
      participants: 4
    },
    { 
      id: 3, 
      title: "Webinaire - Nouvelles normes HSE", 
      date: "2024-03-20", 
      time: "10:00 - 11:30", 
      location: "En ligne",
      participants: 15
    }
  ];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Espace collaboratif</h1>
            <p className="text-gray-500">
              Communiquez, partagez des documents et restez informé
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Inviter
            </Button>
            <Button className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Nouvelle discussion
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CollaborationModule />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4" />
                  Utilisateurs actifs
                </CardTitle>
                <CardDescription>
                  Connectez-vous avec vos collègues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4" />
                  Événements à venir
                </CardTitle>
                <CardDescription>
                  Prochaines formations et réunions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="space-y-2 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>{event.time}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{event.participants}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
