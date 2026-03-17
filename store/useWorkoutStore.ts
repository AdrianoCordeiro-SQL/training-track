import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workout, Set } from '@/types';
import { mockWorkout } from '@/utils/mockData';

interface WorkoutState {
  workouts: Workout[]; // Nova lista de treinos
  activeWorkout: Workout | null;
  isResting: boolean;
  restTimeRemaining: number;
  
  // Ações
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updatedWorkout: Workout) => void;
  deleteWorkout: (id: string) => void;
  startWorkout: (workout: Workout) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<Set>) => void;
  toggleRestTimer: (seconds: number) => void;
  tickTimer: () => void;
  finishWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      // Inicializamos a lista com o nosso mock para não começar vazia
      workouts: [mockWorkout], 
      activeWorkout: null,
      isResting: false,
      restTimeRemaining: 0,

      // Adiciona um novo treino à lista
      addWorkout: (workout) => set((state) => ({ 
        workouts: [...state.workouts, workout] 
      })),

      updateWorkout: (id, updatedWorkout) => set((state) => ({
        workouts: state.workouts.map((w) => (w.id === id ? updatedWorkout : w)),
        activeWorkout: state.activeWorkout?.id === id ? updatedWorkout : state.activeWorkout
      })),

      // Elimina o treino e, se for o treino ativo, limpa o estado ativo
      deleteWorkout: (id) => set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id),
        activeWorkout: state.activeWorkout?.id === id ? null : state.activeWorkout
      })),

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

      toggleRestTimer: (seconds) => set({ isResting: true, restTimeRemaining: seconds }),

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
      name: 'training-track-storage',
    }
  )
);