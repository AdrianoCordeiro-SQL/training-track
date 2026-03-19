
import { renderHook } from '@testing-library/react';
import { useActiveWorkout } from './useActiveWorkout';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { Workout } from '@/types';

// Mock do store Zustand
jest.mock('@/store/useWorkoutStore');

const mockedUseWorkoutStore = useWorkoutStore as jest.Mock;
const mockSetActiveWorkout = jest.fn();

const mockWorkouts: Workout[] = [
  { id: '1', name: 'Treino A', exercises: [] },
  { id: '2', name: 'Treino B', exercises: [] },
];

describe('useActiveWorkout', () => {
  beforeEach(() => {
    mockSetActiveWorkout.mockClear();
  });

  it('deve chamar setActiveWorkout se não houver treino ativo', () => {
    mockedUseWorkoutStore.mockReturnValue({
      activeWorkout: null,
      workouts: mockWorkouts,
      setActiveWorkout: mockSetActiveWorkout,
    });

    renderHook(() => useActiveWorkout('1'));

    expect(mockSetActiveWorkout).toHaveBeenCalledWith(mockWorkouts[0]);
    expect(mockSetActiveWorkout).toHaveBeenCalledTimes(1);
  });

  it('deve chamar setActiveWorkout se o ID do treino ativo for diferente do ID do URL', () => {
    mockedUseWorkoutStore.mockReturnValue({
      activeWorkout: mockWorkouts[1], // Treino B está ativo
      workouts: mockWorkouts,
      setActiveWorkout: mockSetActiveWorkout,
    });

    renderHook(() => useActiveWorkout('1')); // URL aponta para o Treino A

    expect(mockSetActiveWorkout).toHaveBeenCalledWith(mockWorkouts[0]);
    expect(mockSetActiveWorkout).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar setActiveWorkout se o treino ativo já for o correto', () => {
    mockedUseWorkoutStore.mockReturnValue({
      activeWorkout: mockWorkouts[0], // Treino A já está ativo
      workouts: mockWorkouts,
      setActiveWorkout: mockSetActiveWorkout,
    });

    renderHook(() => useActiveWorkout('1')); // URL aponta para o Treino A

    expect(mockSetActiveWorkout).not.toHaveBeenCalled();
  });

  it('não deve fazer nada se o ID do treino não for encontrado na lista de treinos', () => {
    mockedUseWorkoutStore.mockReturnValue({
      activeWorkout: null,
      workouts: mockWorkouts,
      setActiveWorkout: mockSetActiveWorkout,
    });

    renderHook(() => useActiveWorkout('3')); // ID não existente

    expect(mockSetActiveWorkout).not.toHaveBeenCalled();
  });

  it('deve retornar o treino ativo do store', () => {
    mockedUseWorkoutStore.mockReturnValue({
      activeWorkout: mockWorkouts[0],
      workouts: mockWorkouts,
      setActiveWorkout: mockSetActiveWorkout,
    });

    const { result } = renderHook(() => useActiveWorkout('1'));

    expect(result.current.activeWorkout).toEqual(mockWorkouts[0]);
  });
});
