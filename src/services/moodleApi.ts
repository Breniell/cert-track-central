
// Service pour communiquer avec l'API Moodle
// Ces endpoints seront fournis par le plugin local_cimencamplus

export interface MoodleUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  capabilities: string[];
}

export interface MoodleFormation {
  id: number;
  name: string;
  summary: string;
  startdate: number;
  enddate: number;
  location: string;
  capacity: number;
  enrolled: number;
  trainer_id: number;
  trainer_name: string;
  modality: 'online' | 'presential';
  category: string;
}

export interface MoodleEnrollment {
  user_id: number;
  course_id: number;
  timeenrolled: number;
  status: 'active' | 'suspended';
}

export interface MoodleAttendance {
  user_id: number;
  session_id: number;
  status: 'present' | 'absent' | 'late';
  timestamp: number;
}

class MoodleApiService {
  private baseUrl: string;
  private sessionKey: string;

  constructor() {
    // Ces valeurs seront injectées par Moodle via window.M
    this.baseUrl = window.M?.cfg?.wwwroot || '';
    this.sessionKey = window.M?.cfg?.sesskey || '';
  }

  private async makeRequest(endpoint: string, data: any = {}) {
    const url = `${this.baseUrl}/local/cimencamplus/ajax/${endpoint}.php`;
    
    const formData = new FormData();
    formData.append('sesskey', this.sessionKey);
    
    Object.keys(data).forEach(key => {
      formData.append(key, JSON.stringify(data[key]));
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Moodle API Error:', error);
      throw error;
    }
  }

  // Gestion des formations
  async getFormations(filters?: {
    trainer_id?: number;
    category?: string;
    date_from?: string;
    date_to?: string;
  }) {
    return this.makeRequest('get_formations', { filters });
  }

  async createFormation(formation: Omit<MoodleFormation, 'id' | 'enrolled'>) {
    return this.makeRequest('create_formation', { formation });
  }

  async updateFormation(id: number, updates: Partial<MoodleFormation>) {
    return this.makeRequest('update_formation', { id, updates });
  }

  async deleteFormation(id: number) {
    return this.makeRequest('delete_formation', { id });
  }

  // Gestion des inscriptions
  async getEnrollments(formation_id: number) {
    return this.makeRequest('get_enrollments', { formation_id });
  }

  async enrollUser(user_id: number, formation_id: number) {
    return this.makeRequest('enroll_user', { user_id, formation_id });
  }

  async unenrollUser(user_id: number, formation_id: number) {
    return this.makeRequest('unenroll_user', { user_id, formation_id });
  }

  // Gestion des présences
  async createAttendanceSession(formation_id: number, session_data: {
    date: string;
    start_time: string;
    end_time: string;
    pin_code?: string;
  }) {
    return this.makeRequest('create_attendance_session', { formation_id, session_data });
  }

  async markAttendance(session_id: number, user_id: number, status: 'present' | 'absent' | 'late', pin_code?: string) {
    return this.makeRequest('mark_attendance', { session_id, user_id, status, pin_code });
  }

  async getAttendanceReport(formation_id: number) {
    return this.makeRequest('get_attendance_report', { formation_id });
  }

  // Gestion des disponibilités formateur
  async getTrainerAvailability(trainer_id: number, date_from: string, date_to: string) {
    return this.makeRequest('get_trainer_availability', { trainer_id, date_from, date_to });
  }

  async setTrainerAvailability(trainer_id: number, availability: {
    date: string;
    start_time: string;
    end_time: string;
    status: 'available' | 'busy' | 'unavailable';
  }[]) {
    return this.makeRequest('set_trainer_availability', { trainer_id, availability });
  }

  // Statistiques et reporting
  async getStatistics(filters?: {
    date_from?: string;
    date_to?: string;
    department?: string;
    trainer_id?: number;
  }) {
    return this.makeRequest('get_statistics', { filters });
  }

  async exportData(type: 'formations' | 'presences' | 'statistics', filters: any) {
    return this.makeRequest('export_data', { type, filters });
  }

  // Utilisateur courant (fourni par Moodle)
  getCurrentUser(): MoodleUser | null {
    return window.M?.user || null;
  }

  // Vérification des capacités utilisateur
  hasCapability(capability: string): boolean {
    const user = this.getCurrentUser();
    return user?.capabilities?.includes(capability) || false;
  }
}

export const moodleApi = new MoodleApiService();
