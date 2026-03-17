import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workout, Set } from '@/types';

interface WorkoutState {
  activeWorkout: Workout | null;
  isResting: boolean;
  restTimeRemaining: number;
  
  // Ações
  startWorkout: (workout: Workout) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<Set>) => void;
  toggleRestTimer: (seconds: number) => void;
  tickTimer: () => void;
  finishWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeWorkout: null,
      isResting: false,
      restTimeRemaining: 0,

      startWorkout: (workout) => set({ activeWorkout: workout }),

      updateSet: (exerciseId, setId, data) => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;

        const updatedExercises = activeWorkout.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...data } : s)),
          };
        });

        set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });
      },

      toggleRestTimer: (seconds) => {
        set({ isResting: true, restTimeRemaining: seconds });
      },

      tickTimer: () => {
        const { restTimeRemaining } = get();
        if (restTimeRemaining > 0) {
          set({ restTimeRemaining: restTimeRemaining - 1 });
        } else {
          set({ isResting: false });
        }
      },

      finishWorkout: () => set({ activeWorkout: null, isResting: false }),
    }),
    {
      name: 'iron-track-storage', 
    }
  )
);