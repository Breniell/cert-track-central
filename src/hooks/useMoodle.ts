
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodleService } from '../services/moodle';
import type { Formation, User, Attendance, TrainerAvailability } from '../types';

// Formation hooks
export const useFormations = () => {
  return useQuery({
    queryKey: ['formations'],
    queryFn: () => moodleService.formations.getAll(),
  });
};

export const useFormation = (id: string) => {
  return useQuery({
    queryKey: ['formations', id],
    queryFn: () => moodleService.formations.getById(id),
  });
};

export const useCreateFormation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formation: Omit<Formation, 'id'>) => 
      moodleService.formations.create(formation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
    },
  });
};

export const useUpdateFormation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...formation }: { id: string } & Partial<Formation>) =>
      moodleService.formations.update(id, formation),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['formations', variables.id] });
    },
  });
};

export const useDeleteFormation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => moodleService.formations.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
    },
  });
};

// Attendance hooks
export const useFormationAttendance = (formationId: string) => {
  return useQuery({
    queryKey: ['attendance', formationId],
    queryFn: () => moodleService.attendance.getByFormation(formationId),
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formationId, userId, status }: { 
      formationId: string; 
      userId: string; 
      status: 'present' | 'absent' | 'late';
    }) => moodleService.attendance.mark(formationId, userId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['attendance', variables.formationId] 
      });
    },
  });
};

// Availability hooks
export const useTrainerAvailability = (trainerId: string) => {
  return useQuery({
    queryKey: ['availability', trainerId],
    queryFn: () => moodleService.availability.getByTrainer(trainerId),
  });
};

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (availability: Omit<TrainerAvailability, 'id'>) =>
      moodleService.availability.create(availability),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['availability', variables.trainerId] 
      });
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => moodleService.availability.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};

// User hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => moodleService.users.getCurrentUser(),
  });
};

export const useFormationUsers = (formationId: string) => {
  return useQuery({
    queryKey: ['users', formationId],
    queryFn: () => moodleService.users.getByFormation(formationId),
  });
};

// Registration hooks
export const useRegisterForFormation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formationId, userId }: { formationId: string; userId: string }) =>
      moodleService.registration.register(formationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ 
        queryKey: ['users', variables.formationId] 
      });
    },
  });
};

export const useUnregisterFromFormation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formationId, userId }: { formationId: string; userId: string }) =>
      moodleService.registration.unregister(formationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ 
        queryKey: ['users', variables.formationId] 
      });
    },
  });
};
