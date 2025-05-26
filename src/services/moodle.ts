
import { Formation, User, Attendance, TrainerAvailability } from '../types';
import { mockFormations, mockUsers, mockAttendances, mockAvailabilities } from '../data/mockData';

// Base URL will be injected by Moodle
const MOODLE_BASE_URL = window.M?.cfg?.wwwroot || '';
const MOODLE_TOKEN = window.M?.cfg?.sesskey || '';

interface MoodleResponse<T> {
  data: T;
  warnings?: Array<{
    warningcode: string;
    message: string;
  }>;
}

const moodleApi = {
  async get<T>(endpoint: string): Promise<T> {
    // En mode développement, retourner les données mock
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simuler latence
      return mockData[endpoint as keyof typeof mockData] as T;
    }

    const response = await fetch(`${MOODLE_BASE_URL}/webservice/rest/server.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        wstoken: MOODLE_TOKEN,
        moodlewsrestformat: 'json',
        wsfunction: endpoint,
      }),
    });

    if (!response.ok) {
      throw new Error('Moodle API request failed');
    }

    const data: MoodleResponse<T> = await response.json();

    if (data.warnings?.length) {
      console.warn('Moodle API warnings:', data.warnings);
    }

    return data.data;
  },

  async post<T>(endpoint: string, params: Record<string, any>): Promise<T> {
    // En mode développement, simuler les mutations
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock API call:', endpoint, params);
      return {} as T;
    }

    const response = await fetch(`${MOODLE_BASE_URL}/webservice/rest/server.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        wstoken: MOODLE_TOKEN,
        moodlewsrestformat: 'json',
        wsfunction: endpoint,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error('Moodle API request failed');
    }

    const data: MoodleResponse<T> = await response.json();

    if (data.warnings?.length) {
      console.warn('Moodle API warnings:', data.warnings);
    }

    return data.data;
  },
};

// Mock data mapping pour le développement
const mockData = {
  'local_cimencamplus_get_formations': mockFormations,
  'local_cimencamplus_get_current_user': mockUsers[0], // Premier utilisateur comme utilisateur courant
  'local_cimencamplus_get_attendances': mockAttendances,
  'local_cimencamplus_get_availabilities': mockAvailabilities,
};

export const moodleService = {
  formations: {
    getAll: () => moodleApi.get<Formation[]>('local_cimencamplus_get_formations'),
    getById: (id: string) => moodleApi.get<Formation>(`local_cimencamplus_get_formation&formationid=${id}`),
    create: (formation: Omit<Formation, 'id'>) => 
      moodleApi.post<Formation>('local_cimencamplus_create_formation', formation),
    update: (id: string, formation: Partial<Formation>) =>
      moodleApi.post<Formation>('local_cimencamplus_update_formation', { id, ...formation }),
    delete: (id: string) =>
      moodleApi.post<void>('local_cimencamplus_delete_formation', { id }),
  },

  attendance: {
    getByFormation: (formationId: string) =>
      moodleApi.get<Attendance[]>(`local_cimencamplus_get_attendances&formationid=${formationId}`),
    mark: (formationId: string, userId: string, status: 'present' | 'absent' | 'late') =>
      moodleApi.post<void>('local_cimencamplus_mark_attendance', { formationId, userId, status }),
  },

  availability: {
    getByTrainer: (trainerId: string) =>
      moodleApi.get<TrainerAvailability[]>(`local_cimencamplus_get_availabilities&trainerid=${trainerId}`),
    create: (availability: Omit<TrainerAvailability, 'id'>) =>
      moodleApi.post<TrainerAvailability>('local_cimencamplus_create_availability', availability),
    delete: (id: string) =>
      moodleApi.post<void>('local_cimencamplus_delete_availability', { id }),
  },

  users: {
    getCurrentUser: () => moodleApi.get<User>('local_cimencamplus_get_current_user'),
    getByFormation: (formationId: string) =>
      moodleApi.get<User[]>(`local_cimencamplus_get_formation_users&formationid=${formationId}`),
  },

  registration: {
    register: (formationId: string, userId: string) =>
      moodleApi.post<void>('local_cimencamplus_register_user', { formationId, userId }),
    unregister: (formationId: string, userId: string) =>
      moodleApi.post<void>('local_cimencamplus_unregister_user', { formationId, userId }),
  },
};
