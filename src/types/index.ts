
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'trainer' | 'learner' | 'hr';
  department?: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  modality: 'online' | 'in-person';
  maxParticipants: number;
  trainerId: string;
  trainerName: string;
  participants: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface TrainerAvailability {
  id: string;
  trainerId: string;
  date: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
}

export interface Attendance {
  formationId: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
}

export interface StatisticsData {
  formationsPerMonth: { month: string; count: number }[];
  attendanceRates: { formation: string; rate: number }[];
  formationsByDepartment: { department: string; count: number }[];
  trainerPerformance: { trainer: string; averageRating: number; averageAttendance: number }[];
}
