import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useEditWorkout } from './useEditWorkout';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import type { Workout } from '@/types';

// Mock do router (Next.js App Router)
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock do store (Zustand)
jest.mock('@/store/useWorkoutStore');

const mockedUseRouter = useRouter as jest.Mock;
const mockedUseWorkoutStore = (useWorkoutStore as unknown) as jest.Mock;

describe('useEditWorkout', () => {
  const workoutId = 'workout-1';
  const existingWorkout: Workout = {
    id: workoutId,
    title: 'Treino A',
    exercises: [],
  };

  const updateWorkout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push: mockPush });
    mockedUseWorkoutStore.mockReturnValue({
      workouts: [existingWorkout],
      updateWorkout,
    });
  });

  it('deve retornar o workout correspondente ao workoutId', () => {
    const { result } = renderHook(() => useEditWorkout(workoutId));

    expect(result.current.workoutToEdit).toEqual(existingWorkout);
    expect(typeof result.current.saveWorkout).toBe('function');
    expect(typeof result.current.goBack).toBe('function');
  });

  it('deve retornar undefined se o workoutId não existir no store', () => {
    mockedUseWorkoutStore.mockReturnValue({
      workouts: [existingWorkout],
      updateWorkout,
    });

    const { result } = renderHook(() => useEditWorkout('unknown-id'));

    expect(result.current.workoutToEdit).toBeUndefined();
  });

  it('saveWorkout deve chamar updateWorkout com o id sobrescrito e redirecionar para "/"', async () => {
    const { result } = renderHook(() => useEditWorkout(workoutId));

    const payload: Workout = {
      // Propositalmente diferente para validar que o hook sobrescreve
      id: 'different-id',
      title: 'Treino A (editado)',
      exercises: [],
    };

    updateWorkout.mockResolvedValue(undefined);

    act(() => {
      result.current.saveWorkout(payload);
    });

    expect(updateWorkout).toHaveBeenCalledTimes(1);
    expect(updateWorkout).toHaveBeenCalledWith(workoutId, {
      ...payload,
      id: workoutId,
    });
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('saveWorkout deve redirecionar mesmo se workoutToEdit estiver undefined', () => {
    mockedUseWorkoutStore.mockReturnValue({
      workouts: [],
      updateWorkout,
    });

    const { result } = renderHook(() => useEditWorkout(workoutId));

    expect(result.current.workoutToEdit).toBeUndefined();

    const payload: Workout = {
      id: 'other-id',
      title: 'Sem workout no store',
      exercises: [],
    };

    updateWorkout.mockResolvedValue(undefined);

    act(() => {
      result.current.saveWorkout(payload);
    });

    expect(updateWorkout).toHaveBeenCalledWith(workoutId, {
      ...payload,
      id: workoutId,
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('goBack deve redirecionar para "/"', () => {
    const { result } = renderHook(() => useEditWorkout(workoutId));

    act(() => {
      result.current.goBack();
    });

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});

