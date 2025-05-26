
import React, { useState } from 'react';
import { CalendarClock, Users, Plus, FileEdit } from 'lucide-react';
import { useFormations, useCurrentUser } from '../hooks/useMoodle';
import { Formation } from '../types';
import MoodleFormationCard from '../components/moodle/MoodleFormationCard';
import PresenceManager from '../components/moodle/PresenceManager';
import FormationForm from '../components/moodle/FormationForm';
import AvailabilityForm from '../components/moodle/AvailabilityForm';
import { useMoodle } from '../contexts/MoodleContext';
import { toast } from 'react-toastify';

const TrainerDashboard: React.FC = () => {
  const { data: formations = [], isLoading, refetch } = useFormations();
  const { data: currentUser } = useCurrentUser();
  const { user } = useMoodle();
  const [activeTab, setActiveTab] = useState<'formations' | 'attendance' | 'availability'>('formations');
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);

  // Filter formations for the current trainer
  const trainerFormations = formations.filter(
    f => f.trainerId === user?.id
  );

  const upcomingFormations = trainerFormations.filter(
    f => f.status === 'upcoming'
  );

  const handleEditFormation = (formation: Formation) => {
    setEditingFormation(formation);
    setShowFormationForm(true);
  };

  const handleViewAttendance = (formation: Formation) => {
    setSelectedFormation(formation);
    setActiveTab('attendance');
  };

  const handleFormationSuccess = () => {
    refetch();
    toast.success("Formation sauvegardée avec succès");
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
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Formateur</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAvailabilityForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <CalendarClock size={18} />
              <span>Ajouter disponibilité</span>
            </button>
            <button 
              onClick={() => {
                setEditingFormation(null);
                setShowFormationForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Plus size={18} />
              <span>Nouvelle formation</span>
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'formations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('formations')}
            >
              <div className="flex items-center gap-2">
                <CalendarClock size={18} />
                <span>Mes formations</span>
              </div>
            </button>
            
            {selectedFormation && (
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'attendance'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('attendance')}
              >
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Présences - {selectedFormation.title}</span>
                </div>
              </button>
            )}
          </div>

          <div className="p-6">
            {activeTab === 'formations' && (
              <>
                {upcomingFormations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingFormations.map(formation => (
                      <MoodleFormationCard
                        key={formation.id}
                        formation={formation}
                        onEdit={() => handleEditFormation(formation)}
                        onViewDetails={() => handleViewAttendance(formation)}
                        showActions={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Vous n'avez aucune formation à venir.</p>
                    <button 
                      onClick={() => {
                        setEditingFormation(null);
                        setShowFormationForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors mx-auto"
                    >
                      <Plus size={18} />
                      <span>Créer une formation</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'attendance' && selectedFormation && (
              <PresenceManager 
                formationId={selectedFormation.id}
                isTrainerView={true}
              />
            )}
          </div>
        </div>
      </div>

      {showFormationForm && (
        <FormationForm
          formation={editingFormation || undefined}
          onClose={() => {
            setShowFormationForm(false);
            setEditingFormation(null);
          }}
          onSuccess={handleFormationSuccess}
        />
      )}

      {showAvailabilityForm && (
        <AvailabilityForm
          onClose={() => setShowAvailabilityForm(false)}
          onSuccess={() => {
            toast.success("Disponibilité ajoutée avec succès");
          }}
        />
      )}
    </div>
  );
};

export default TrainerDashboard;
