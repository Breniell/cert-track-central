
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  FileText,
  Filter,
  Download,
  Users,
  Calendar,
  CheckCircle2,
  History,
  Mail,
  Phone,
  Building
} from "lucide-react";

interface Participant {
  id: number;
  nom: string;
  poste: string;
  departement: string;
  telephone: string;
  email: string;
  formationsTerminees: number;
  formationsEnCours: number;
  certifications: number;
  prochaineCertificationExpiration?: string;
  statut: 'Actif' | 'En formation' | 'En attente';
  type: 'Employé' | 'Sous-traitant';
  photo: string;
}

const participantsData: Participant[] = [
  {
    id: 1,
    nom: "Thomas Lefèvre",
    poste: "Opérateur de production",
    departement: "Production",
    telephone: "+237 691234567",
    email: "thomas.lefevre@example.com",
    formationsTerminees: 8,
    formationsEnCours: 1,
    certifications: 5,
    prochaineCertificationExpiration: "15 Juin 2024",
    statut: "Actif",
    type: "Employé",
    photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 2,
    nom: "Amélie Dufour",
    poste: "Technicienne HSE",
    departement: "HSE",
    telephone: "+237 692345678",
    email: "amelie.dufour@example.com",
    formationsTerminees: 12,
    formationsEnCours: 2,
    certifications: 8,
    prochaineCertificationExpiration: "28 Mai 2024",
    statut: "En formation",
    type: "Employé",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    nom: "Marc Dubois",
    poste: "Électricien",
    departement: "Maintenance",
    telephone: "+237 693456789",
    email: "marc.dubois@example.com",
    formationsTerminees: 6,
    formationsEnCours: 0,
    certifications: 4,
    prochaineCertificationExpiration: "10 Juillet 2024",
    statut: "Actif",
    type: "Sous-traitant",
    photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 4,
    nom: "Sophie Moreau",
    poste: "Responsable Production",
    departement: "Production",
    telephone: "+237 694567890",
    email: "sophie.moreau@example.com",
    formationsTerminees: 15,
    formationsEnCours: 1,
    certifications: 10,
    prochaineCertificationExpiration: "5 Août 2024",
    statut: "Actif",
    type: "Employé",
    photo: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 5,
    nom: "Paul Richard",
    poste: "Technicien de maintenance",
    departement: "Maintenance",
    telephone: "+237 695678901",
    email: "paul.richard@example.com",
    formationsTerminees: 9,
    formationsEnCours: 2,
    certifications: 7,
    prochaineCertificationExpiration: "22 Juin 2024",
    statut: "En formation",
    type: "Employé",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 6,
    nom: "Claire Lambert",
    poste: "Ingénieure Qualité",
    departement: "Qualité",
    telephone: "+237 696789012",
    email: "claire.lambert@example.com",
    formationsTerminees: 14,
    formationsEnCours: 0,
    certifications: 11,
    prochaineCertificationExpiration: "18 Juillet 2024",
    statut: "Actif",
    type: "Employé",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

export default function Participants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartement, setSelectedDepartement] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Tous');

  const filteredParticipants = participantsData.filter(participant => {
    const matchesSearch = participant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          participant.poste.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartement = selectedDepartement === 'Tous' || participant.departement === selectedDepartement;
    const matchesType = selectedType === 'Tous' || participant.type === selectedType;
    return matchesSearch && matchesDepartement && matchesType;
  });

  // Liste des départements uniques
  const departements = Array.from(
    new Set(participantsData.map(participant => participant.departement))
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Participants</h1>
            <p className="text-gray-500 mt-1">
              {participantsData.length} participants actifs
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Participant
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Rechercher un participant..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={selectedDepartement}
              onValueChange={setSelectedDepartement}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Tous">Tous les départements</SelectItem>
                  {departements.map((departement) => (
                    <SelectItem key={departement} value={departement}>
                      {departement}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Tous">Tous les types</SelectItem>
                <SelectItem value="Employé">Employé</SelectItem>
                <SelectItem value="Sous-traitant">Sous-traitant</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Participants</h3>
                <p className="text-2xl font-semibold text-gray-900">{participantsData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Certifications valides</h3>
                <p className="text-2xl font-semibold text-gray-900">45</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg">
                <History className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">À renouveler</h3>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des participants */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 grid grid-cols-1 gap-6">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start md:w-1/3">
                    <img
                      src={participant.photo}
                      alt={participant.nom}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{participant.nom}</h3>
                        <span 
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            participant.type === 'Employé'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {participant.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{participant.poste}</p>
                      <span
                        className={`inline-flex mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                          participant.statut === 'Actif'
                            ? 'bg-green-100 text-green-700'
                            : participant.statut === 'En formation'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {participant.statut}
                      </span>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      {participant.departement}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {participant.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {participant.telephone}
                    </div>
                  </div>
                  
                  <div className="md:w-1/3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <p className="text-xl font-semibold text-blue-700">
                          {participant.formationsTerminees}
                        </p>
                        <p className="text-xs text-blue-600">Terminées</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-50">
                        <p className="text-xl font-semibold text-purple-700">
                          {participant.formationsEnCours}
                        </p>
                        <p className="text-xs text-purple-600">En cours</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50">
                        <p className="text-xl font-semibold text-green-700">
                          {participant.certifications}
                        </p>
                        <p className="text-xs text-green-600">Certif.</p>
                      </div>
                    </div>
                    
                    {participant.prochaineCertificationExpiration && (
                      <div className="mt-3 flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Prochain renouvellement: <span className="font-medium">{participant.prochaineCertificationExpiration}</span>
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-between">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                        Voir profil
                      </Button>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Certificats
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
