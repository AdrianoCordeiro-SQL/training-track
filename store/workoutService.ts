import { supabase } from '@/utils/supabase';
import { Workout } from '@/types';

export const workoutService = {
  async fetchWorkouts(): Promise<Workout[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Workout[];
  },

  async addWorkout(workout: Workout): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase.from('workouts').insert({
      id: workout.id,
      user_id: user.id,
      title: workout.title,
      exercises: workout.exercises,
    });

    if (error) throw error;
  },

  async updateWorkout(id: string, updatedWorkout: Workout): Promise<void> {
    const { error } = await supabase.from('workouts').update({
      title: updatedWorkout.title,
      exercises: updatedWorkout.exercises,
    }).eq('id', id);

    if (error) throw error;
  },

  async deleteWorkout(id: string): Promise<void> {
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) throw error;
  }
};