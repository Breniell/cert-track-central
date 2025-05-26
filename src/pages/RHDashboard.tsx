
import React, { useState } from 'react';
import { BarChart3, Users, Calendar, Filter, Download } from 'lucide-react';
import { useFormations } from '../hooks/useMoodle';
import { Button } from '@/components/ui/button';
import MoodleFormationCard from '../components/moodle/MoodleFormationCard';
import SearchFilter from '../components/moodle/SearchFilter';
import { toast } from 'react-toastify';

const RHDashboard: React.FC = () => {
  const { data: formations = [], isLoading } = useFormations();
  const [activeTab, setActiveTab] = useState<'overview' | 'formations'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Apply filters
  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.trainerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || formation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formationsByStatus = {
    upcoming: formations.filter(f => f.status === 'upcoming').length,
    ongoing: formations.filter(f => f.status === 'ongoing').length,
    completed: formations.filter(f => f.status === 'completed').length,
    cancelled: formations.filter(f => f.status === 'cancelled').length,
  };

  const handleExport = () => {
    const csvData = filteredFormations.map(f => ({
      Titre: f.title,
      Formateur: f.trainerName,
      Date: f.startDate,
      Lieu: f.location,
      Participants: `${f.participants.length}/${f.maxParticipants}`,
      Statut: f.status
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(csvData[0]).join(",") + "\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "formations_rh.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export réalisé avec succès");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord RH</h1>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                <span>Vue d'ensemble</span>
              </div>
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'formations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('formations')}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Toutes les formations</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Formations à venir</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{formationsByStatus.upcoming}</p>
                      </div>
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Formations en cours</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{formationsByStatus.ongoing}</p>
                      </div>
                      <Users className="text-green-600" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Formations terminées</p>
                        <p className="text-3xl font-bold text-gray-700 mt-1">{formationsByStatus.completed}</p>
                      </div>
                      <BarChart3 className="text-gray-700" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Formations annulées</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{formationsByStatus.cancelled}</p>
                      </div>
                      <Calendar className="text-red-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'formations' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <SearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Rechercher par titre, lieu ou formateur..."
                  />
                  
                  <div className="flex gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="upcoming">À venir</option>
                      <option value="ongoing">En cours</option>
                      <option value="completed">Terminées</option>
                      <option value="cancelled">Annulées</option>
                    </select>
                    
                    <Button
                      onClick={handleExport}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Exporter
                    </Button>
                  </div>
                </div>
                
                {filteredFormations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFormations.map(formation => (
                      <MoodleFormationCard
                        key={formation.id}
                        formation={formation}
                        showActions={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucune formation correspondant aux critères.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHDashboard;
