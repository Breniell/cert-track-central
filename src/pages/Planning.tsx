
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plus,
  Filter,
  Search,
  Download,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Formation {
  id: number;
  titre: string;
  type: 'HSE' | 'Métier';
  date: string;
  duree: string;
  lieu: string;
  participants: number;
  maxParticipants: number;
  formateur: string;
}

const planningData: Formation[] = [
  {
    id: 1,
    titre: "Sécurité en hauteur",
    type: "HSE",
    date: "2024-03-15",
    duree: "8h",
    lieu: "Site A - Salle 102",
    participants: 8,
    maxParticipants: 12,
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
    formateur: "Pierre Dubois"
  }
];

export default function Planning() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

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

  const filteredFormations = planningData.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Tous' || formation.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Planning des Formations</h1>
            <p className="text-gray-500 mt-1">
              {planningData.length} formations planifiées
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Formation
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
              onValueChange={setSelectedType}
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

        {/* Planning */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 space-y-6">
            {filteredFormations.map((formation) => (
              <div
                key={formation.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        formation.type === 'HSE' 
                          ? 'bg-ctc-hse-light text-ctc-hse' 
                          : 'bg-ctc-metier-light text-ctc-metier'
                      }`}>
                        {formation.type}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{formation.titre}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Formateur: {formation.formateur}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {formation.participants}/{formation.maxParticipants} participants
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                      <Button variant="ghost" size="sm">
                        Modifier
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
