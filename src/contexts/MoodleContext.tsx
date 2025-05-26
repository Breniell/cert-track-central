
import React, { createContext, useContext } from 'react';
import { useCurrentUser } from '../hooks/useMoodle';

interface MoodleUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  capabilities: string[];
}

interface MoodleContextType {
  user: MoodleUser | null;
  isLoading: boolean;
  isTrainer: boolean;
  isLearner: boolean;
  isRH: boolean;
}

const MoodleContext = createContext<MoodleContextType | undefined>(undefined);

export const MoodleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();

  const isTrainer = user?.roles?.includes('trainer') || false;
  const isLearner = user?.roles?.includes('student') || false;
  const isRH = user?.roles?.includes('manager') || user?.roles?.includes('hr') || false;

  const value = {
    user: user ? {
      id: user.id,
      username: user.name,
      firstname: user.name.split(' ')[0] || '',
      lastname: user.name.split(' ')[1] || '',
      email: user.email,
      roles: [user.role],
      capabilities: []
    } : null,
    isLoading,
    isTrainer,
    isLearner,
    isRH
  };

  return (
    <MoodleContext.Provider value={value}>
      {children}
    </MoodleContext.Provider>
  );
};

export const useMoodle = () => {
  const context = useContext(MoodleContext);
  if (context === undefined) {
    throw new Error('useMoodle must be used within a MoodleProvider');
  }
  return context;
};
