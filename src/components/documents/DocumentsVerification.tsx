
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, AlertTriangle, Clock, FileCheck, Search, User, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Document, DocumentStatus } from "@/types/Formation";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SoustraitantDocument {
  id: number;
  nom: string;
  prenom: string;
  entreprise: string;
  documents: Document[];
  status: "À vérifier" | "Validé" | "Rejeté" | "Incomplet";
}

// Données pour l'exemple
const soustraitantsData: SoustraitantDocument[] = [
  {
    id: 1,
    nom: "Leroy",
    prenom: "Thomas",
    entreprise: "ExternalTech SA",
    status: "À vérifier",
    documents: [
      { id: 1, nom: "Certificat médical", type: "pdf", statut: "À vérifier", dateExpiration: "2024-12-31" },
      { id: 2, nom: "Attestation CNPS", type: "pdf", statut: "À vérifier" },
      { id: 3, nom: "Carte d'identité", type: "jpg", statut: "Validé", dateVerification: "2024-02-15", verifiePar: "Claire Moreau" }
    ]
  },
  {
    id: 2,
    nom: "Garcia",
    prenom: "Maria",
    entreprise: "ConsultPro",
    status: "Incomplet",
    documents: [
      { id: 4, nom: "Certificat médical", type: "pdf", statut: "Rejeté", dateVerification: "2024-02-20", verifiePar: "Claire Moreau", commentaire: "Document expiré" },
      { id: 5, nom: "Attestation CNPS", type: "pdf", statut: "À vérifier" }
    ]
  },
  {
    id: 3,
    nom: "Johnson",
    prenom: "Jack",
    entreprise: "GlobalService",
    status: "Validé",
    documents: [
      { id: 6, nom: "Certificat médical", type: "pdf", statut: "Validé", dateVerification: "2024-03-01", verifiePar: "Claire Moreau", dateExpiration: "2024-10-15" },
      { id: 7, nom: "Attestation CNPS", type: "pdf", statut: "Validé", dateVerification: "2024-03-01", verifiePar: "Claire Moreau" },
      { id: 8, nom: "Carte d'identité", type: "jpg", statut: "Validé", dateVerification: "2024-03-01", verifiePar: "Claire Moreau" }
    ]
  }
];

export function DocumentsVerification() {
  const [soustraitants, setSoustraitants] = useState<SoustraitantDocument[]>(soustraitantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [comment, setComment] = useState("");
  const [viewingSoustraitant, setViewingSoustraitant] = useState<SoustraitantDocument | null>(null);
  const { toast } = useToast();

  const filteredSoustraitants = soustraitants.filter(st => 
    st.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    st.prenom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    st.entreprise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case "Validé": return "bg-green-100 text-green-800";
      case "Rejeté": return "bg-red-100 text-red-800";
      case "À vérifier": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "Validé": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Rejeté": return <XCircle className="h-4 w-4 text-red-500" />;
      case "À vérifier": return <Clock className="h-4 w-4 text-amber-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleVerifyDocument = (status: DocumentStatus) => {
    if (!selectedDocument || !viewingSoustraitant) return;

    // Mise à jour du document
    const updatedDocument = {
      ...selectedDocument,
      statut: status,
      dateVerification: new Date().toISOString().split('T')[0],
      verifiePar: "Claire Moreau",
      commentaire: comment || undefined
    };

    // Mise à jour du soustraitant
    const updatedSoustraitants = soustraitants.map(st => {
      if (st.id === viewingSoustraitant.id) {
        const updatedDocuments = st.documents.map(doc => 
          doc.id === selectedDocument.id ? updatedDocument : doc
        );
        
        // Calcul du nouveau statut global
        let newStatus: SoustraitantDocument["status"] = "Validé";
        if (updatedDocuments.some(doc => doc.statut === "Rejeté")) {
          newStatus = "Rejeté";
        } else if (updatedDocuments.some(doc => doc.statut === "À vérifier")) {
          newStatus = "Incomplet";
        }
        
        return { ...st, documents: updatedDocuments, status: newStatus };
      }
      return st;
    });

    setSoustraitants(updatedSoustraitants);
    setSelectedDocument(updatedDocument);
    
    toast({
      title: `Document ${status.toLowerCase()}`,
      description: `Le document a été marqué comme ${status.toLowerCase()}.`,
      variant: status === "Validé" ? "default" : status === "Rejeté" ? "destructive" : "default"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Vérification des Documents</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un sous-traitant..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="pending">À vérifier</TabsTrigger>
          <TabsTrigger value="validated">Validés</TabsTrigger>
          <TabsTrigger value="rejected">Rejetés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredSoustraitants.length > 0 ? (
            filteredSoustraitants.map((st) => (
              <Card key={st.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{st.prenom} {st.nom}</CardTitle>
                        <CardDescription>{st.entreprise}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        st.status === "Validé" ? "default" : 
                        st.status === "Rejeté" ? "destructive" : 
                        st.status === "Incomplet" ? "outline" : "secondary"
                      }
                    >
                      {st.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {st.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 flex items-start space-x-3 ${
                          selectedDocument?.id === doc.id && viewingSoustraitant?.id === st.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => {
                          setSelectedDocument(doc);
                          setViewingSoustraitant(st);
                          setComment(doc.commentaire || "");
                        }}
                      >
                        <FileCheck className="h-5 w-5 mt-0.5 text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{doc.nom}</div>
                          <div className="text-xs text-gray-500">Format: {doc.type.toUpperCase()}</div>
                          <div className="mt-1 flex items-center space-x-1">
                            {getStatusIcon(doc.statut)}
                            <span className={`text-xs ${getStatusColor(doc.statut)}`}>
                              {doc.statut}
                            </span>
                          </div>
                          {doc.dateExpiration && (
                            <div className="mt-1 flex items-center space-x-1 text-xs text-gray-500">
                              <CalendarClock className="h-3 w-3" />
                              <span>Expire: {doc.dateExpiration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun sous-traitant ne correspond à votre recherche.</p>
            </div>
          )}
        </TabsContent>

        {/* Les autres onglets utiliseraient un contenu similaire avec des filtres différents */}
        <TabsContent value="pending" className="space-y-4">
          {/* Contenu similaire filtré pour les documents en attente */}
        </TabsContent>
        <TabsContent value="validated" className="space-y-4">
          {/* Contenu similaire filtré pour les documents validés */}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          {/* Contenu similaire filtré pour les documents rejetés */}
        </TabsContent>
      </Tabs>

      {selectedDocument && viewingSoustraitant && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vérification du document</CardTitle>
            <CardDescription>
              {selectedDocument.nom} - {viewingSoustraitant.prenom} {viewingSoustraitant.nom} ({viewingSoustraitant.entreprise})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-md flex items-center justify-center border">
              <div className="text-center">
                <FileCheck className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                <div className="text-sm text-gray-500">Aperçu du document</div>
                <Button variant="outline" size="sm" className="mt-2">
                  Ouvrir le document
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Commentaire (optionnel)</label>
              <Textarea 
                placeholder="Ajoutez un commentaire sur ce document..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <div className="flex items-center p-3 bg-amber-50 text-amber-700 rounded-md space-x-2 text-sm">
              <AlertTriangle className="h-5 w-5" />
              <p>Vérifiez attentivement la validité et l'authenticité du document avant de valider.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => {
              setSelectedDocument(null);
              setViewingSoustraitant(null);
              setComment("");
            }}>
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleVerifyDocument("Rejeté")}
            >
              Rejeter
            </Button>
            <Button 
              variant="default"
              onClick={() => handleVerifyDocument("Validé")}
            >
              Valider
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
