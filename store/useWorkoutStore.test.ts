import { useWorkoutStore } from './useWorkoutStore';
import { workoutService } from '@/store/workoutService';
import { Workout } from '@/types';

// Mock do workoutService
jest.mock('@/store/workoutService', () => ({
  workoutService: {
    fetchWorkouts: jest.fn(),
    addWorkout: jest.fn(),
    updateWorkout: jest.fn(),
    deleteWorkout: jest.fn(),
  },
}));

// Mock para os dados de treino
const mockWorkouts: Workout[] = [
  { id: '1', title: 'Treino A', exercises: [] },
  { id: '2', title: 'Treino B', exercises: [] },
];

describe('useWorkoutStore', () => {
  beforeEach(() => {
    // Reseta o estado da store e os mocks antes de cada teste
    useWorkoutStore.setState({
      workouts: [],
      activeWorkout: null,
      isLoading: false,
      isResting: false,
      restTimeRemaining: 0,
      activeExerciseId: null,
      activeSetId: null,
    });
    jest.clearAllMocks();
  });

  it('deve buscar e definir os treinos', async () => {
    (workoutService.fetchWorkouts as jest.Mock).mockResolvedValue(mockWorkouts);

    await useWorkoutStore.getState().fetchWorkouts();

    expect(useWorkoutStore.getState().isLoading).toBe(false);
    expect(useWorkoutStore.getState().workouts).toEqual(mockWorkouts);
    expect(workoutService.fetchWorkouts).toHaveBeenCalledTimes(1);
  });

  it('deve adicionar um treino (otimista)', async () => {
    const newWorkout: Workout = { id: '3', title: 'Treino C', exercises: [] };
    (workoutService.addWorkout as jest.Mock).mockResolvedValue(undefined);

    await useWorkoutStore.getState().addWorkout(newWorkout);

    expect(useWorkoutStore.getState().workouts).toContainEqual(newWorkout);
    expect(workoutService.addWorkout).toHaveBeenCalledWith(newWorkout);
  });

  it('deve atualizar um treino', async () => {
    useWorkoutStore.setState({ workouts: mockWorkouts });
    const updatedWorkout: Workout = { id: '1', title: 'Treino A Modificado', exercises: [] };
    (workoutService.updateWorkout as jest.Mock).mockResolvedValue(undefined);

    await useWorkoutStore.getState().updateWorkout('1', updatedWorkout);

    const updatedWorkouts = useWorkoutStore.getState().workouts;
    const workout = updatedWorkouts.find(w => w.id === '1');
    expect(workout?.title).toBe('Treino A Modificado');
    expect(workoutService.updateWorkout).toHaveBeenCalledWith('1', updatedWorkout);
  });

  it('deve deletar um treino', async () => {
    useWorkoutStore.setState({ workouts: mockWorkouts });
    (workoutService.deleteWorkout as jest.Mock).mockResolvedValue(undefined);

    await useWorkoutStore.getState().deleteWorkout('1');

    expect(useWorkoutStore.getState().workouts.some(w => w.id === '1')).toBe(false);
    expect(workoutService.deleteWorkout).toHaveBeenCalledWith('1');
  });

  it('deve definir o treino ativo', () => {
    useWorkoutStore.getState().setActiveWorkout(mockWorkouts[0]);
    expect(useWorkoutStore.getState().activeWorkout).toEqual(mockWorkouts[0]);
  });

  it('deve atualizar uma série de um exercício no treino ativo', () => {
    const activeWorkout: Workout = {
      id: '1',
      title: 'Treino Ativo',
      exercises: [
        { id: 'ex1', name: 'Ex A', sets: [{ id: 'set1', completed: false, weight: 10, reps: 10 }] },
      ],
    };
    useWorkoutStore.setState({ activeWorkout });

    useWorkoutStore.getState().updateSet('ex1', 'set1', { completed: true, weight: 12 });

    const updatedActiveWorkout = useWorkoutStore.getState().activeWorkout;
    const updatedSet = updatedActiveWorkout?.exercises[0].sets[0];
    expect(updatedSet?.completed).toBe(true);
    expect(updatedSet?.weight).toBe(12);
  });

  it('deve alternar o estado de descanso', () => {
    useWorkoutStore.getState().toggleRestTimer(60, 'ex1', 'set1');
    const state = useWorkoutStore.getState();
    expect(state.isResting).toBe(true);
    expect(state.restTimeRemaining).toBe(60);
    expect(state.activeExerciseId).toBe('ex1');
    expect(state.activeSetId).toBe('set1');

    useWorkoutStore.getState().toggleRestTimer(0);
    expect(useWorkoutStore.getState().isResting).toBe(false);
  });

  it('deve decrementar o timer', () => {
    useWorkoutStore.setState({ restTimeRemaining: 60, isResting: true });
    useWorkoutStore.getState().tickTimer();
    expect(useWorkoutStore.getState().restTimeRemaining).toBe(59);
  });

  it('deve parar o descanso quando o timer chegar a 0', () => {
    useWorkoutStore.setState({ restTimeRemaining: 1, isResting: true });
    useWorkoutStore.getState().tickTimer(); // 1 -> 0
    expect(useWorkoutStore.getState().restTimeRemaining).toBe(0);
    expect(useWorkoutStore.getState().isResting).toBe(false);
  });
});
