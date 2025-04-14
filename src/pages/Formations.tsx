
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Plus,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Formation {
  id: number;
  titre: string;
  type: 'HSE' | 'Métier';
  date: string;
  duree: string;
  lieu: string;
  participants: number;
  maxParticipants: number;
  statut: 'À venir' | 'En cours' | 'Terminée';
  formateur: string;
}

const formationsData: Formation[] = [
  {
    id: 1,
    titre: "Sécurité en hauteur",
    type: "HSE",
    date: "2024-03-15",
    duree: "8h",
    lieu: "Site A - Salle 102",
    participants: 8,
    maxParticipants: 12,
    statut: "À venir",
    formateur: "Jean Dupont"
  },
  {
    id: 2,
    titre: "Manipulation des produits chimiques",
    type: "HSE",
    date: "2024-03-18",
    duree: "4h",
    lieu: "Laboratoire principal",
    participants: 6,
    maxParticipants: 8,
    statut: "À venir",
    formateur: "Marie Martin"
  },
  {
    id: 3,
    titre: "Maintenance préventive",
    type: "Métier",
    date: "2024-03-20",
    duree: "16h",
    lieu: "Atelier technique",
    participants: 12,
    maxParticipants: 15,
    statut: "À venir",
    formateur: "Pierre Dubois"
  },
  {
    id: 4,
    titre: "Sécurité incendie",
    type: "HSE",
    date: "2024-03-25",
    duree: "6h",
    lieu: "Site B - Salle de conférence",
    participants: 20,
    maxParticipants: 25,
    statut: "À venir",
    formateur: "Sophie Leroux"
  },
  {
    id: 5,
    titre: "Procédés de fabrication avancés",
    type: "Métier",
    date: "2024-03-28",
    duree: "24h",
    lieu: "Usine centrale - Salle de formation",
    participants: 10,
    maxParticipants: 12,
    statut: "À venir",
    formateur: "Michel Bernard"
  }
];

export default function Formations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'Tous' | 'HSE' | 'Métier'>('Tous');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const filteredFormations = formationsData.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Tous' || formation.type === selectedType;
    return matchesSearch && matchesType;
  });

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const nextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Formations</h1>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle Formation
          </Button>
        </div>

        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Rechercher une formation..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as 'Tous' | 'HSE' | 'Métier')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Tous">Tous les types</SelectItem>
                  <SelectItem value="HSE">HSE</SelectItem>
                  <SelectItem value="Métier">Métier</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-gray-300">
            <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 gap-4 p-6">
            {filteredFormations.map((formation) => (
              <div
                key={formation.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        formation.type === 'HSE' 
                          ? 'bg-ctc-hse-light text-ctc-hse' 
                          : 'bg-ctc-metier-light text-ctc-metier'
                      }`}>
                        {formation.type}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{formation.titre}</h3>
                    </div>
                    <p className="text-sm text-gray-500">Formateur: {formation.formateur}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    formation.statut === 'À venir' 
                      ? 'bg-blue-100 text-blue-700'
                      : formation.statut === 'En cours'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {formation.statut}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(formation.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {formation.duree}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {formation.lieu}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    {formation.participants}/{formation.maxParticipants} participants
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                        Détails
                      </Button>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        Modifier
                      </Button>
                    </div>
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, formation.participants))].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                        >
                          P{i + 1}
                        </div>
                      ))}
                      {formation.participants > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{formation.participants - 3}
                        </div>
                      )}
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
