
import React, { useState } from 'react';
import { CalendarDays, BookOpen, AlertCircle } from 'lucide-react';
import { useFormations, useCurrentUser } from '../hooks/useMoodle';
import { Formation } from '../types';

const LearnerDashboard: React.FC = () => {
  const { data: formations = [], isLoading } = useFormations();
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'registered' | 'available'>('registered');
  
  // Find formations where the current user is a participant
  const registeredFormations = formations.filter(
    formation => formation.participants.includes(currentUser?.id || '')
  );
  
  // Find available formations where the user is not registered yet
  const availableFormations = formations.filter(
    formation => 
      !formation.participants.includes(currentUser?.id || '') && 
      formation.status === 'upcoming' &&
      formation.participants.length < formation.maxParticipants
  );

  const upcomingSessions = registeredFormations.filter(f => f.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  const nextSession = upcomingSessions[0];

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
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Apprenant</h1>
        </header>

        {nextSession && (
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-600">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Prochaine session</h3>
                  <p className="text-lg font-medium text-gray-900 mt-1">{nextSession.title}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-gray-600">
                      <CalendarDays size={16} className="mr-1" />
                      <span>{new Date(nextSession.startDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>Formateur: {nextSession.trainerName}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                {nextSession.modality === 'online' && (
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm">
                    Lien de connexion
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'registered'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('registered')}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <span>Mes formations</span>
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {registeredFormations.length}
                </span>
              </div>
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'available'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('available')}
            >
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                <span>Formations disponibles</span>
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {availableFormations.length}
                </span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'registered' && (
              <>
                {registeredFormations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredFormations.map(formation => (
                      <div key={formation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{formation.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{formation.description}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarDays className="w-4 h-4 mr-2" />
                              {new Date(formation.startDate).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Lieu:</strong> {formation.location}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              formation.status === 'upcoming' 
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {formation.status === 'upcoming' ? 'À venir' : formation.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Vous n'êtes inscrit(e) à aucune formation.</p>
                    <button 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                      onClick={() => setActiveTab('available')}
                    >
                      Voir les formations disponibles
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'available' && (
              <>
                {availableFormations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableFormations.map(formation => (
                      <div key={formation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{formation.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{formation.description}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarDays className="w-4 h-4 mr-2" />
                              {new Date(formation.startDate).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Lieu:</strong> {formation.location}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm">
                              S'inscrire
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucune formation disponible pour le moment.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
