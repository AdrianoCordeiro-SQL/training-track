
import { renderHook, act } from '@testing-library/react';
import { useCreateWorkout } from './useCreateWorkout';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { generateId } from '@/utils/generateId';
import { useRouter } from 'next/navigation';
import { Workout } from '@/types';

// Mock de 'next/navigation'
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mockedUseRouter = useRouter as jest.Mock;

// Mock do store Zustand
jest.mock('@/store/useWorkoutStore');
const mockedUseWorkoutStore = (useWorkoutStore as unknown) as jest.Mock;
const mockAddWorkout = jest.fn();

// Mock do gerador de ID
jest.mock('@/utils/generateId');
const mockedGenerateId = generateId as jest.Mock;

describe('useCreateWorkout', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    mockPush.mockClear();
    mockAddWorkout.mockClear();
    mockedGenerateId.mockClear();
    
    // Define os retornos padrão dos mocks
    mockedUseRouter.mockReturnValue({ push: mockPush });
    mockedUseWorkoutStore.mockReturnValue({ addWorkout: mockAddWorkout });
  });

  it('deve gerar um ID, chamar addWorkout e redirecionar para a home ao salvar', async () => {
    const mockId = 'new-workout-123';
    mockedGenerateId.mockReturnValue(mockId);
    mockAddWorkout.mockResolvedValue(undefined); // Simula uma função assíncrona

    const { result } = renderHook(() => useCreateWorkout());

    const newWorkoutData: Omit<Workout, 'id'> = {
      name: 'Meu Novo Treino',
      exercises: [
        {
          id: 'ex1',
          name: 'Supino',
          sets: [
            { id: 'set1', reps: 10, weight: 50, completed: false },
          ],
          restTime: 60,
        },
      ],
    };

    // 'saveWorkout' é assíncrono, então usamos 'act' com 'async/await'
    await act(async () => {
      await result.current.saveWorkout(newWorkoutData as Workout);
    });

    // 1. Verifica se o ID foi gerado
    expect(mockedGenerateId).toHaveBeenCalledTimes(1);

    // 2. Verifica se 'addWorkout' foi chamado com o payload completo (incluindo o ID)
    expect(mockAddWorkout).toHaveBeenCalledTimes(1);
    expect(mockAddWorkout).toHaveBeenCalledWith({
      ...newWorkoutData,
      id: mockId,
    });

    // 3. Verifica se o redirecionamento foi acionado
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
