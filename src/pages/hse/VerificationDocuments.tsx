
import Layout from "@/components/layout/Layout";
import { DocumentsVerification } from "@/components/documents/DocumentsVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, FileCheck } from "lucide-react";

export default function VerificationDocuments() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vérification des Documents HSE</h1>
          <p className="text-gray-500 mt-1">
            Vérifiez et validez les documents requis pour les sous-traitants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                À Vérifier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <CardDescription>documents en attente</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                Validés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <CardDescription>documents validés</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                Rejetés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <CardDescription>documents refusés</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-blue-500" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <CardDescription>documents au total</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="verification">
          <TabsList>
            <TabsTrigger value="verification">Vérification Documents</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verification">
            <DocumentsVerification />
          </TabsContent>
          
          <TabsContent value="historique">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-500 text-center py-12">
                Le journal des vérifications sera affiché ici.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="statistiques">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-500 text-center py-12">
                Les statistiques de vérification seront affichées ici.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
