
import React, { useState } from 'react';
import { CalendarClock, Users, Plus, FileEdit, Trash2 } from 'lucide-react';
import { useFormations, useCurrentUser } from '../hooks/useMoodle';
import { Formation } from '../types';

const TrainerDashboard: React.FC = () => {
  const { data: formations = [], isLoading } = useFormations();
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'attendance'>('upcoming');
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  // Filter formations for the current trainer
  const trainerFormations = formations.filter(
    f => f.trainerId === currentUser?.id
  );

  const upcomingFormations = trainerFormations.filter(
    f => f.status === 'upcoming'
  );

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
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Formateur</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            <Plus size={18} />
            <span>Nouvelle formation</span>
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              <div className="flex items-center gap-2">
                <CalendarClock size={18} />
                <span>Mes formations</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {upcomingFormations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingFormations.map(formation => (
                  <div key={formation.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{formation.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{formation.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarClock className="w-4 h-4 mr-2" />
                          {new Date(formation.startDate).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {formation.participants.length}/{formation.maxParticipants} participants
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Lieu:</strong> {formation.location}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          formation.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {formation.status === 'upcoming' ? 'À venir' : formation.status}
                        </span>
                        
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Users size={16} />
                          </button>
                          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-md transition-colors">
                            <FileEdit size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Vous n'avez aucune formation à venir.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors mx-auto">
                  <Plus size={18} />
                  <span>Créer une formation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
