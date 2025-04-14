
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  Star,
  Calendar,
  Mail,
  Phone,
  Award,
  BarChart2,
  FileCheck,
  ChevronDown,
  Filter,
  Download
} from "lucide-react";

interface Formateur {
  id: number;
  nom: string;
  photo: string;
  specialites: string[];
  email: string;
  telephone: string;
  certifications: string[];
  evaluationMoyenne: number;
  formationsDispensees: number;
  heuresFormation: number;
  disponibilite: 'Disponible' | 'En formation' | 'Indisponible';
  prochaineFormation?: string;
}

const formateursData: Formateur[] = [
  {
    id: 1,
    nom: "Jean Dupont",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    specialites: ["Sécurité en hauteur", "Premiers secours"],
    email: "jean.dupont@example.com",
    telephone: "+237 691234567",
    certifications: ["Formateur HSE Niveau 3", "SST"],
    evaluationMoyenne: 4.8,
    formationsDispensees: 156,
    heuresFormation: 1248,
    disponibilite: "Disponible",
    prochaineFormation: "15 Mars 2024"
  },
  {
    id: 2,
    nom: "Marie Martin",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    specialites: ["Risques chimiques", "Protection environnementale"],
    email: "marie.martin@example.com",
    telephone: "+237 697654321",
    certifications: ["IOSH", "NEBOSH"],
    evaluationMoyenne: 4.9,
    formationsDispensees: 98,
    heuresFormation: 784,
    disponibilite: "En formation"
  },
  {
    id: 3,
    nom: "Pierre Dubois",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    specialites: ["Maintenance industrielle", "Sécurité machines"],
    email: "pierre.dubois@example.com",
    telephone: "+237 694567890",
    certifications: ["Formateur Technique Niveau 2"],
    evaluationMoyenne: 4.7,
    formationsDispensees: 72,
    heuresFormation: 576,
    disponibilite: "Disponible",
    prochaineFormation: "20 Mars 2024"
  },
  {
    id: 4,
    nom: "Sophie Leroux",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    specialites: ["Sécurité incendie", "Évacuation d'urgence"],
    email: "sophie.leroux@example.com",
    telephone: "+237 698765432",
    certifications: ["Formatrice HSE", "Sécurité incendie Niveau 3"],
    evaluationMoyenne: 4.6,
    formationsDispensees: 65,
    heuresFormation: 520,
    disponibilite: "Disponible",
    prochaineFormation: "25 Mars 2024"
  },
  {
    id: 5,
    nom: "Michel Bernard",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    specialites: ["Procédés de fabrication", "Contrôle qualité"],
    email: "michel.bernard@example.com",
    telephone: "+237 699876543",
    certifications: ["Génie industriel", "Six Sigma"],
    evaluationMoyenne: 4.5,
    formationsDispensees: 48,
    heuresFormation: 384,
    disponibilite: "Indisponible"
  }
];

export default function Formateurs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialite, setSelectedSpecialite] = useState('Toutes');
  const [selectedDisponibilite, setSelectedDisponibilite] = useState('Toutes');

  const filteredFormateurs = formateursData.filter(formateur => {
    const matchesSearch = formateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formateur.specialites.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialite = selectedSpecialite === 'Toutes' || formateur.specialites.includes(selectedSpecialite);
    const matchesDisponibilite = selectedDisponibilite === 'Toutes' || formateur.disponibilite === selectedDisponibilite;
    return matchesSearch && matchesSpecialite && matchesDisponibilite;
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Liste de toutes les spécialités uniques
  const specialites = Array.from(
    new Set(formateursData.flatMap(formateur => formateur.specialites))
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Formateurs</h1>
            <p className="text-gray-500 mt-1">
              {formateursData.length} formateurs actifs
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Formateur
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
              placeholder="Rechercher un formateur..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={selectedSpecialite}
              onValueChange={setSelectedSpecialite}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Toutes les spécialités" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Toutes">Toutes les spécialités</SelectItem>
                  {specialites.map((specialite) => (
                    <SelectItem key={specialite} value={specialite}>
                      {specialite}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Select
            value={selectedDisponibilite}
            onValueChange={setSelectedDisponibilite}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toutes les disponibilités" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Toutes">Toutes les disponibilités</SelectItem>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="En formation">En formation</SelectItem>
                <SelectItem value="Indisponible">Indisponible</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Formations ce mois</h3>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Taux de satisfaction</h3>
                <p className="text-2xl font-semibold text-gray-900">96%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Heures dispensées</h3>
                <p className="text-2xl font-semibold text-gray-900">2,608</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des formateurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormateurs.map((formateur) => (
            <div
              key={formateur.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <img
                      src={formateur.photo}
                      alt={formateur.nom}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{formateur.nom}</h3>
                      <div className="flex items-center mt-1">
                        {renderStars(formateur.evaluationMoyenne)}
                        <span className="ml-2 text-sm text-gray-500">
                          {formateur.evaluationMoyenne}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      formateur.disponibilite === 'Disponible'
                        ? 'bg-green-100 text-green-700'
                        : formateur.disponibilite === 'En formation'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {formateur.disponibilite}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {formateur.specialites.map((specialite, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                      >
                        {specialite}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {formateur.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {formateur.telephone}
                  </div>
                  {formateur.prochaineFormation && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Prochaine formation: {formateur.prochaineFormation}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formateur.formationsDispensees}
                      </p>
                      <p className="text-xs text-gray-500">Formations</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formateur.heuresFormation}
                      </p>
                      <p className="text-xs text-gray-500">Heures</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formateur.certifications.length}
                      </p>
                      <p className="text-xs text-gray-500">Certifications</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                    Voir profil
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
