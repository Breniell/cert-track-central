
import React, { createContext, useContext, useEffect, useState } from 'react';
import { moodleApi, MoodleUser } from '@/services/moodleApi';

interface MoodleContextType {
  user: MoodleUser | null;
  isLoading: boolean;
  hasCapability: (capability: string) => boolean;
  isTrainer: boolean;
  isRH: boolean;
  isLearner: boolean;
}

const MoodleContext = createContext<MoodleContextType | undefined>(undefined);

export const MoodleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MoodleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur depuis Moodle
    const moodleUser = moodleApi.getCurrentUser();
    setUser(moodleUser);
    setIsLoading(false);
  }, []);

  const hasCapability = (capability: string): boolean => {
    return moodleApi.hasCapability(capability);
  };

  const isTrainer = user?.roles?.includes('trainer') || hasCapability('local/cimencamplus:manage_formations');
  const isRH = user?.roles?.includes('manager') || hasCapability('local/cimencamplus:view_all_formations');
  const isLearner = user?.roles?.includes('student') || hasCapability('local/cimencamplus:enroll_formations');

  return (
    <MoodleContext.Provider
      value={{
        user,
        isLoading,
        hasCapability,
        isTrainer,
        isRH,
        isLearner,
      }}
    >
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
