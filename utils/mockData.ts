import { Workout } from '@/types';

export const mockWorkout: Workout = {
  id: 'treino-a-001',
  title: 'Treino A - Peito e Tríceps',
  exercises: [
    {
      id: 'ex-001',
      name: 'Supino Reto com Barra',
      restTime: 120, // 2 minutos para exercícios compostos pesados
      observations: 'Focar na fase excêntrica (descida em 3 segundos)',
      sets: [
        { id: 'set-1', reps: 10, weight: 60, completed: false },
        { id: 'set-2', reps: 8, weight: 65, completed: false },
        { id: 'set-3', reps: 6, weight: 70, completed: false },
        { id: 'set-4', reps: 6, weight: 70, completed: false },
      ],
    },
    {
      id: 'ex-002',
      name: 'Supino Inclinado com Halteres',
      restTime: 90,
      sets: [
        { id: 'set-5', reps: 10, weight: 26, completed: false },
        { id: 'set-6', reps: 10, weight: 26, completed: false },
        { id: 'set-7', reps: 8, weight: 28, completed: false },
      ],
    },
    {
      id: 'ex-003',
      name: 'Tríceps Pulley (Corda)',
      restTime: 60, // Menos descanso para isolados
      observations: 'Ponto zero embaixo por 1 segundo',
      sets: [
        { id: 'set-8', reps: 12, weight: 45, completed: false },
        { id: 'set-9', reps: 12, weight: 45, completed: false },
        { id: 'set-10', reps: 10, weight: 50, completed: false },
        { id: 'set-11', reps: 10, weight: 50, completed: false },
      ],
    },
  ],
};