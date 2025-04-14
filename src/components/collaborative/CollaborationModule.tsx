
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send, Paperclip, FileText, UserPlus, MoveRight, Bell, CalendarDays, Users } from "lucide-react";

interface CollaborationModuleProps {
  formationId?: number;
}

export default function CollaborationModule({ formationId }: CollaborationModuleProps) {
  const [activeTab, setActiveTab] = useState("discussions");
  const [messageText, setMessageText] = useState("");
  
  // Données de démonstration pour les messages
  const messagesData = [
    {
      id: 1,
      user: {
        id: 1,
        name: "Jean Dupont",
        role: "Formateur",
        avatar: "/placeholder.svg"
      },
      message: "Bonjour à tous, j'aimerais partager avec vous le planning détaillé de la formation 'Sécurité en hauteur' qui aura lieu la semaine prochaine.",
      date: "2024-03-10T09:15:00Z",
      attachments: [
        { name: "planning_securite_hauteur.pdf", type: "pdf", size: "245 KB" }
      ]
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "Marie Martin",
        role: "Responsable HSE",
        avatar: "/placeholder.svg"
      },
      message: "Merci Jean pour ces informations. Je voudrais rappeler à tous les participants qu'ils doivent apporter leurs EPI actuels pour une vérification pendant la formation.",
      date: "2024-03-10T10:25:00Z",
      attachments: []
    },
    {
      id: 3,
      user: {
        id: 3,
        name: "Sophie Leroux",
        role: "Participante",
        avatar: "/placeholder.svg"
      },
      message: "Est-ce que le matériel de démonstration sera fourni sur place ou devons-nous apporter quelque chose de spécifique?",
      date: "2024-03-10T11:35:00Z",
      attachments: []
    }
  ];
  
  // Données de démonstration pour les documents
  const documentsData = [
    {
      id: 1,
      name: "Guide de sécurité en hauteur.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadedBy: "Jean Dupont",
      uploadedAt: "2024-03-05T14:20:00Z",
      category: "Support de formation"
    },
    {
      id: 2,
      name: "Procédure de travail en hauteur.docx",
      type: "docx",
      size: "450 KB",
      uploadedBy: "Marie Martin",
      uploadedAt: "2024-03-07T09:30:00Z",
      category: "Procédure"
    },
    {
      id: 3,
      name: "Présentation des techniques.pptx",
      type: "pptx",
      size: "2.8 MB",
      uploadedBy: "Jean Dupont",
      uploadedAt: "2024-03-08T11:15:00Z",
      category: "Support de formation"
    },
    {
      id: 4,
      name: "Checklist de sécurité.pdf",
      type: "pdf",
      size: "320 KB",
      uploadedBy: "Marie Martin",
      uploadedAt: "2024-03-09T16:45:00Z",
      category: "Liste de contrôle"
    }
  ];
  
  // Données de démonstration pour les notifications
  const notificationsData = [
    {
      id: 1,
      title: "Nouvelle formation disponible",
      message: "Une nouvelle formation 'Manipulation des produits chimiques' est disponible pour inscription.",
      date: "2024-03-10T08:00:00Z",
      read: false,
      type: "info"
    },
    {
      id: 2,
      title: "Rappel: Formation à venir",
      message: "Rappel: Votre formation 'Sécurité en hauteur' aura lieu demain à 9h00.",
      date: "2024-03-09T14:30:00Z",
      read: true,
      type: "reminder"
    },
    {
      id: 3,
      title: "Document ajouté",
      message: "Un nouveau document 'Guide de sécurité en hauteur' a été ajouté à la bibliothèque.",
      date: "2024-03-05T14:25:00Z",
      read: true,
      type: "document"
    }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès."
    });
    
    setMessageText("");
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "docx":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "pptx":
        return <FileText className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="discussions" className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {formationId ? "Discussion de la formation" : "Forum de discussion"}
              </CardTitle>
              <CardDescription>
                Échangez avec les formateurs et les autres participants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {messagesData.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                        <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{msg.user.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">{msg.user.role}</Badge>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(msg.date)}</span>
                        </div>
                        <p className="mt-1 text-sm">{msg.message}</p>
                        
                        {msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.attachments.map((attachment, idx) => (
                              <div key={idx} className="flex items-center p-2 bg-gray-50 rounded-md text-sm">
                                <FileText className="w-4 h-4 mr-2 text-blue-500" />
                                <span>{attachment.name}</span>
                                <span className="ml-2 text-gray-500 text-xs">({attachment.size})</span>
                                <Button variant="ghost" size="sm" className="ml-auto h-7 px-2">
                                  Télécharger
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-2">
                <Textarea 
                  placeholder="Écrivez votre message ici..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-20"
                />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bibliothèque de documents</CardTitle>
              <CardDescription>
                Accédez aux documents liés à la formation et aux ressources HSE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-80">
                  <Input placeholder="Rechercher un document..." />
                </div>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Téléverser un document
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ajouté par</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documentsData.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getFileIcon(doc.type)}
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="text-xs text-gray-500">{doc.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{doc.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{doc.uploadedBy}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{formatDate(doc.uploadedAt)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            Télécharger
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Centre de notifications</CardTitle>
              <CardDescription>
                Consultez les mises à jour et rappels importants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationsData.map((notification) => {
                let Icon;
                let iconColor;
                
                switch (notification.type) {
                  case "info":
                    Icon = Users;
                    iconColor = "text-blue-500";
                    break;
                  case "reminder":
                    Icon = CalendarDays;
                    iconColor = "text-amber-500";
                    break;
                  case "document":
                    Icon = FileText;
                    iconColor = "text-green-500";
                    break;
                  default:
                    Icon = Bell;
                    iconColor = "text-gray-500";
                }
                
                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`${iconColor} p-2 bg-white rounded-full shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                        
                        <div className="mt-2 flex justify-end">
                          {!notification.read && (
                            <Button variant="ghost" size="sm">
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="ghost" size="sm">
                Tout marquer comme lu
              </Button>
              <Button variant="outline" size="sm">
                Voir toutes les notifications
                <MoveRight className="w-4 h-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
