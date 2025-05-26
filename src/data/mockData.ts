
import { Formation, TrainerAvailability, User, Attendance } from '../types';
import { addDays, format } from 'date-fns';

// Helper to create dates relative to today
const dateFrom = (daysOffset: number) => format(addDays(new Date(), daysOffset), 'yyyy-MM-dd');
const timeStr = (hours: number, minutes: number = 0) => 
  `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Jean Dupont', email: 'jean.dupont@cimencam.com', role: 'trainer', department: 'Production' },
  { id: 'user-2', name: 'Marie Leclerc', email: 'marie.leclerc@cimencam.com', role: 'trainer', department: 'RH' },
  { id: 'user-3', name: 'Ahmed Bello', email: 'ahmed.bello@cimencam.com', role: 'learner', department: 'Maintenance' },
  { id: 'user-4', name: 'Fatima Nkosi', email: 'fatima.nkosi@cimencam.com', role: 'learner', department: 'Administration' },
  { id: 'user-5', name: 'Pierre Kombe', email: 'pierre.kombe@cimencam.com', role: 'hr', department: 'RH' },
];

export const mockFormations: Formation[] = [
  {
    id: 'formation-1',
    title: 'Sécurité sur site industriel',
    description: 'Formation obligatoire sur les règles de sécurité à suivre sur les sites de production.',
    startDate: dateFrom(5),
    endDate: dateFrom(5),
    location: 'Salle de conférence A, Usine Douala',
    modality: 'in-person',
    maxParticipants: 20,
    trainerId: 'user-1',
    trainerName: 'Jean Dupont',
    participants: ['user-3', 'user-4'],
    status: 'upcoming'
  },
  {
    id: 'formation-2',
    title: 'Maintenance préventive des équipements',
    description: 'Techniques de maintenance préventive pour prolonger la durée de vie des équipements industriels.',
    startDate: dateFrom(10),
    endDate: dateFrom(11),
    location: 'Atelier technique, Usine Yaoundé',
    modality: 'in-person',
    maxParticipants: 15,
    trainerId: 'user-1',
    trainerName: 'Jean Dupont',
    participants: ['user-3'],
    status: 'upcoming'
  },
  {
    id: 'formation-3',
    title: 'Communication efficace en entreprise',
    description: 'Améliorer la communication interne et externe au sein de l\'entreprise.',
    startDate: dateFrom(-2),
    endDate: dateFrom(-2),
    location: 'Plateforme Zoom',
    modality: 'online',
    maxParticipants: 30,
    trainerId: 'user-2',
    trainerName: 'Marie Leclerc',
    participants: ['user-3', 'user-4'],
    status: 'completed'
  },
  {
    id: 'formation-4',
    title: 'Gestion de projet industriel',
    description: 'Méthodologies et outils pour gérer efficacement les projets industriels.',
    startDate: dateFrom(15),
    endDate: dateFrom(16),
    location: 'Salle de formation B, Siège social',
    modality: 'in-person',
    maxParticipants: 12,
    trainerId: 'user-2',
    trainerName: 'Marie Leclerc',
    participants: [],
    status: 'upcoming'
  }
];

export const mockAvailabilities: TrainerAvailability[] = [
  {
    id: 'availability-1',
    trainerId: 'user-1',
    date: dateFrom(5),
    startTime: timeStr(9),
    endTime: timeStr(17),
    recurring: false
  },
  {
    id: 'availability-2',
    trainerId: 'user-1',
    date: dateFrom(10),
    startTime: timeStr(9),
    endTime: timeStr(17),
    recurring: false
  },
  {
    id: 'availability-3',
    trainerId: 'user-1',
    date: dateFrom(11),
    startTime: timeStr(9),
    endTime: timeStr(17),
    recurring: false
  },
  {
    id: 'availability-4',
    trainerId: 'user-2',
    date: dateFrom(-2),
    startTime: timeStr(13),
    endTime: timeStr(16),
    recurring: false
  },
  {
    id: 'availability-5',
    trainerId: 'user-2',
    date: dateFrom(15),
    startTime: timeStr(9),
    endTime: timeStr(17),
    recurring: false
  },
  {
    id: 'availability-6',
    trainerId: 'user-2',
    date: dateFrom(16),
    startTime: timeStr(9),
    endTime: timeStr(17),
    recurring: false
  }
];

export const mockAttendances: Attendance[] = [
  {
    formationId: 'formation-3',
    userId: 'user-3',
    date: dateFrom(-2),
    status: 'present',
    checkInTime: timeStr(13, 5)
  },
  {
    formationId: 'formation-3',
    userId: 'user-4',
    date: dateFrom(-2),
    status: 'present',
    checkInTime: timeStr(13, 10)
  }
];

export const mockStatisticsData = {
  formationsPerMonth: [
    { month: 'Jan', count: 3 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 4 },
    { month: 'Apr', count: 6 },
    { month: 'May', count: 3 },
    { month: 'Jun', count: 2 }
  ],
  attendanceRates: [
    { formation: 'Sécurité sur site', rate: 85 },
    { formation: 'Maintenance préventive', rate: 90 },
    { formation: 'Communication efficace', rate: 100 },
    { formation: 'Gestion de projet', rate: 75 }
  ],
  formationsByDepartment: [
    { department: 'Production', count: 5 },
    { department: 'Maintenance', count: 4 },
    { department: 'Administration', count: 3 },
    { department: 'Qualité', count: 2 },
    { department: 'Logistique', count: 1 }
  ],
  trainerPerformance: [
    { trainer: 'Jean Dupont', averageRating: 4.5, averageAttendance: 92 },
    { trainer: 'Marie Leclerc', averageRating: 4.8, averageAttendance: 95 },
    { trainer: 'Robert Mbaye', averageRating: 4.2, averageAttendance: 88 }
  ]
};
