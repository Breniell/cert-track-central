
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, DocumentStatus } from "@/types/Formation";
import { documentService } from "@/services/documentService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { FileCheck, FileX, FileClock, FileQuestion, Eye } from "lucide-react";

interface DocumentVerificationProps {
  participantId: number;
}

export default function DocumentVerification({ participantId }: DocumentVerificationProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<DocumentStatus>("Validé");
  const [commentaire, setCommentaire] = useState("");

  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents", participantId],
    queryFn: () => documentService.getDocumentsByParticipant(participantId)
  });

  const verifyDocumentMutation = useMutation({
    mutationFn: ({ documentId, status, comment }: { documentId: number; status: DocumentStatus; comment?: string }) => 
      documentService.verifyDocument(documentId, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", participantId] });
      toast({
        title: "Document vérifié",
        description: "Le statut du document a été mis à jour avec succès."
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du document.",
        variant: "destructive"
      });
    }
  });

  const handleVerify = () => {
    if (!selectedDocument) return;
    
    verifyDocumentMutation.mutate({
      documentId: selectedDocument.id,
      status: verificationStatus,
      comment: commentaire
    });
  };

  const openVerificationDialog = (document: Document) => {
    setSelectedDocument(document);
    setVerificationStatus(document.statut);
    setCommentaire(document.commentaire || "");
    setIsDialogOpen(true);
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "Validé":
        return <FileCheck className="w-6 h-6 text-green-500" />;
      case "Rejeté":
        return <FileX className="w-6 h-6 text-red-500" />;
      case "À vérifier":
        return <FileClock className="w-6 h-6 text-amber-500" />;
      default:
        return <FileQuestion className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "Validé":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Validé</Badge>;
      case "Rejeté":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeté</Badge>;
      case "À vérifier":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">À vérifier</Badge>;
      default:
        return <Badge variant="outline">Non requis</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des documents...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Erreur lors du chargement des documents.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Documents du participant</h2>
        <Button variant="outline" size="sm">Ajouter un document</Button>
      </div>
      
      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-md">{document.nom}</CardTitle>
                  <CardDescription>Type: {document.type}</CardDescription>
                </div>
                {getStatusIcon(document.statut)}
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Statut:</span>
                    {getStatusBadge(document.statut)}
                  </div>
                  
                  {document.dateVerification && (
                    <div className="text-sm text-gray-600">
                      Vérifié le: {document.dateVerification}
                    </div>
                  )}
                  
                  {document.dateExpiration && (
                    <div className="text-sm text-gray-600">
                      Expire le: {document.dateExpiration}
                    </div>
                  )}
                  
                  {document.commentaire && (
                    <div className="text-sm text-gray-600 mt-2">
                      <p className="font-medium">Commentaire:</p>
                      <p className="italic">{document.commentaire}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => openVerificationDialog(document)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Vérifier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Aucun document à vérifier pour ce participant.</p>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Vérification de document</DialogTitle>
            <DialogDescription>
              Vérifiez le document et mettez à jour son statut.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Document
                </Label>
                <div className="col-span-3">
                  <p className="font-medium">{selectedDocument.nom}</p>
                  <p className="text-sm text-gray-500">{selectedDocument.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Statut
                </Label>
                <Select 
                  value={verificationStatus} 
                  onValueChange={(value) => setVerificationStatus(value as DocumentStatus)}
                  className="col-span-3"
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Validé">Validé</SelectItem>
                    <SelectItem value="Rejeté">Rejeté</SelectItem>
                    <SelectItem value="À vérifier">À vérifier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiration" className="text-right">
                  Date d'expiration
                </Label>
                <Input 
                  id="expiration" 
                  type="date" 
                  defaultValue={selectedDocument.dateExpiration} 
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="comment" className="text-right pt-2">
                  Commentaire
                </Label>
                <Textarea 
                  id="comment" 
                  placeholder="Ajoutez un commentaire (optionnel)" 
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleVerify}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
