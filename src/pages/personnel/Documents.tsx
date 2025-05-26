
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Documents = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    toast({
      title: "Document envoyé",
      description: "Votre document a été envoyé et est en attente de vérification.",
    });
    setIsUploading(false);
  };

  const documents = [
    {
      id: 1,
      nom: "Certificat de travail en hauteur",
      dateExpiration: "15/04/2025",
      statut: "Valide",
      dateEnvoi: "15/04/2024",
    },
    {
      id: 2,
      nom: "Attestation de formation produits chimiques",
      dateExpiration: "18/06/2024",
      statut: "Bientôt expiré",
      dateEnvoi: "18/03/2023",
    },
    {
      id: 3,
      nom: "Habilitation électrique",
      dateExpiration: "01/01/2024",
      statut: "Expiré",
      dateEnvoi: "01/01/2023",
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Mes Documents
            </h1>
            <p className="text-muted-foreground">
              Gérez vos documents obligatoires et certifications
            </p>
          </div>
          <Button onClick={() => setIsUploading(true)}>
            <UploadCloud className="h-4 w-4 mr-2" />
            Envoyer un document
          </Button>
        </div>

        {isUploading ? (
          <Card>
            <CardHeader>
              <CardTitle>Envoyer un document</CardTitle>
              <CardDescription>
                Envoyez un nouveau document ou une certification mise à jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type de document</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Certificat de formation</option>
                    <option>Habilitation</option>
                    <option>Attestation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fichier</label>
                  <input 
                    type="file" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpload}>Envoyer</Button>
                  <Button variant="outline" onClick={() => setIsUploading(false)}>Annuler</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((document) => (
              <Card key={document.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{document.nom}</CardTitle>
                    <Badge
                      variant={
                        document.statut === "Valide"
                          ? "default"
                          : document.statut === "Bientôt expiré"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {document.statut}
                    </Badge>
                  </div>
                  <CardDescription>Envoyé le {document.dateEnvoi}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Date d'expiration</p>
                      <p className="text-sm">{document.dateExpiration}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Mettre à jour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Documents;
