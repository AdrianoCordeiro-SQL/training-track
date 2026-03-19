import { create } from 'zustand';
import { workoutService } from '@/store/workoutService';
import { Workout } from '@/types';

interface WorkoutState {
  workouts: Workout[];
  activeWorkout: Workout | null;
  isLoading: boolean;
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Workout) => Promise<void>;
  updateWorkout: (id: string, updatedWorkout: Workout) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  setActiveWorkout: (workout: Workout | null) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<{ completed: boolean; weight: number | string; reps: number | string }>) => void;
  isResting: boolean;
  restTimeRemaining: number;
  setRestTimeRemaining: (time: number) => void;
  tickTimer: () => void;
  activeExerciseId: string | null;
  activeSetId: string | null;
  toggleRestTimer: (time: number, exerciseId?: string | null, setId?: string | null) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  activeWorkout: null,
  isLoading: false,

  isResting: false,
  restTimeRemaining: 0,

  activeExerciseId: null,
  activeSetId: null,
  toggleRestTimer: (time, exerciseId = null, setId = null) => set({
    isResting: time > 0,
    restTimeRemaining: time,
    activeExerciseId: exerciseId,
    activeSetId: setId,
  }),

  setRestTimeRemaining: (time) => set({ restTimeRemaining: time }),

  tickTimer: () => set((state) => {
    const nextTime = state.restTimeRemaining - 1;
    
    if (nextTime <= 0) {
      return { restTimeRemaining: 0, isResting: false };
    }
    
    return { restTimeRemaining: nextTime };
  }),


  fetchWorkouts: async () => {
    set({ isLoading: true });
    try {
      const workouts = await workoutService.fetchWorkouts();
      set({ workouts });
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addWorkout: async (workout) => {
    // 1. Atualizamos a UI imediatamente (Optimistic Update)
    set((state) => ({ workouts: [workout, ...state.workouts] }));
    
    // 2. Depois tentamos salvar no banco
    try {
      await workoutService.addWorkout(workout);
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
      // Opcional no futuro: Reverter o estado se a API falhar
    }
  },

  updateWorkout: async (id, updatedWorkout) => {
    set((state) => ({
      workouts: state.workouts.map((w) => (w.id === id ? updatedWorkout : w)),
      activeWorkout: state.activeWorkout?.id === id ? updatedWorkout : state.activeWorkout
    }));
    
    try {
      await workoutService.updateWorkout(id, updatedWorkout);
    } catch (error) {
      console.error('Erro ao atualizar no banco:', error);
    }
  },

  deleteWorkout: async (id) => {
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
      activeWorkout: state.activeWorkout?.id === id ? null : state.activeWorkout
    }));
    
    try {
      await workoutService.deleteWorkout(id);
    } catch (error) {
      console.error('Erro ao deletar no banco:', error);
    }
  },

  setActiveWorkout: (workout) => set({ activeWorkout: workout }),

  updateSet: (exerciseId, setId, updates) => set((state) => {
    if (!state.activeWorkout) return {};

    const updatedExercises = state.activeWorkout.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
        };
      }
      return exercise;
    });

    return {
      activeWorkout: { ...state.activeWorkout, exercises: updatedExercises } as Workout,
    };
  }),
}));