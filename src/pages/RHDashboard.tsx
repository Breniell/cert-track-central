
import React, { useState } from 'react';
import { BarChart3, Users, Calendar, CheckSquare } from 'lucide-react';
import { useFormations } from '../hooks/useMoodle';

const RHDashboard: React.FC = () => {
  const { data: formations = [], isLoading } = useFormations();
  const [activeTab, setActiveTab] = useState<'overview' | 'formations'>('overview');
  
  const formationsByStatus = {
    upcoming: formations.filter(f => f.status === 'upcoming').length,
    completed: formations.filter(f => f.status === 'completed').length,
    cancelled: formations.filter(f => f.status === 'cancelled').length,
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <p className="text-gray-600 text-sm">Formations terminées</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{formationsByStatus.completed}</p>
                      </div>
                      <CheckSquare className="text-green-600" size={24} />
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
                
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques globales</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total des formations</p>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-900">{formations.length}</span>
                        <span className="text-sm text-blue-600 ml-2 mb-1">+12% vs mois précédent</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Taux de participation moyen</p>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-900">87%</span>
                        <span className="text-sm text-red-600 ml-2 mb-1">-3% vs mois précédent</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Satisfaction moyenne</p>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-900">4.2/5</span>
                        <span className="text-sm text-blue-600 ml-2 mb-1">+0.3 vs mois précédent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'formations' && (
              <div className="space-y-6">
                {formations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formations.map(formation => (
                      <div key={formation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{formation.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{formation.description}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(formation.startDate).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              {formation.participants.length}/{formation.maxParticipants} participants
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Formateur:</strong> {formation.trainerName}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              formation.status === 'upcoming' 
                                ? 'bg-blue-100 text-blue-700'
                                : formation.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {formation.status === 'upcoming' ? 'À venir' : 
                               formation.status === 'completed' ? 'Terminée' : formation.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucune formation disponible.</p>
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
