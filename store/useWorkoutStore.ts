import { create } from 'zustand';
import { supabase } from '@/utils/supabase';
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
    if (state.restTimeRemaining > 0) {
      return { restTimeRemaining: state.restTimeRemaining - 1 };
    } else {
      return { isResting: false, restTimeRemaining: 0 };
    }
  }),


  fetchWorkouts: async () => {
    set({ isLoading: true });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar treinos:', error);
    } else {
      set({ workouts: data as Workout[] });
    }
    
    set({ isLoading: false });
  },

  addWorkout: async (workout) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    set((state) => ({ workouts: [workout, ...state.workouts] }));

    const { error } = await supabase.from('workouts').insert({
      id: workout.id,
      user_id: user.id,
      title: workout.title,
      exercises: workout.exercises,
    });

    if (error) console.error('Erro ao salvar no banco:', error);
  },

  updateWorkout: async (id, updatedWorkout) => {
    set((state) => ({
      workouts: state.workouts.map((w) => (w.id === id ? updatedWorkout : w)),
      activeWorkout: state.activeWorkout?.id === id ? updatedWorkout : state.activeWorkout
    }));

    const { error } = await supabase.from('workouts').update({
      title: updatedWorkout.title,
      exercises: updatedWorkout.exercises
    }).eq('id', id);

    if (error) console.error('Erro ao atualizar no banco:', error);
  },

  deleteWorkout: async (id) => {
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
      activeWorkout: state.activeWorkout?.id === id ? null : state.activeWorkout
    }));

    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) console.error('Erro ao deletar no banco:', error);
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