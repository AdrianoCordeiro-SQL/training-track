import { workoutService } from './workoutService';
import { supabase } from '@/utils/supabase';
import { Workout } from '@/types';

// 1. Mock do Supabase limpo e simplificado
jest.mock('@/utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockUser = { id: 'user-123', email: 'test@test.com' };
const mockWorkouts: Workout[] = [
  { id: '1', title: 'Treino A', exercises: [] },
];

describe('workoutService', () => {
  // 2. Criamos funções isoladas para podermos "espiá-las" nos testes
  const mockOrder = jest.fn();
  const mockSelect = jest.fn();
  const mockInsert = jest.fn();
  const mockEq = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Configuração padrão de sucesso para o usuário estar logado
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // 3. Encadeamos as funções. Quando o from() for chamado, ele retorna esses espiões.
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect.mockReturnValue({ order: mockOrder }),
      insert: mockInsert,
      update: mockUpdate.mockReturnValue({ eq: mockEq }),
      delete: mockDelete.mockReturnValue({ eq: mockEq }),
    });
  });

  describe('fetchWorkouts', () => {
    it('deve buscar e retornar os treinos com sucesso', async () => {
      // Preparamos o resultado do "order", que é o último método da cadeia
      mockOrder.mockResolvedValue({ data: mockWorkouts, error: null });

      const result = await workoutService.fetchWorkouts();

      expect(result).toEqual(mockWorkouts);
      expect(supabase.from).toHaveBeenCalledWith('workouts');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('deve lançar um erro se o usuário não estiver autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(workoutService.fetchWorkouts()).rejects.toThrow('Usuário não autenticado');
    });

    it('deve lançar um erro se o Supabase retornar um erro', async () => {
      mockOrder.mockResolvedValue({ data: null, error: new Error('DB Error') });

      await expect(workoutService.fetchWorkouts()).rejects.toThrow('DB Error');
    });
  });

  describe('addWorkout', () => {
    const newWorkout: Workout = { id: 'new-1', title: 'Novo Treino', exercises: [] };

    it('deve adicionar um treino com sucesso', async () => {
      // O insert é o último da cadeia aqui
      mockInsert.mockResolvedValue({ error: null });

      await workoutService.addWorkout(newWorkout);

      expect(supabase.from).toHaveBeenCalledWith('workouts');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        id: newWorkout.id,
        user_id: mockUser.id,
        title: newWorkout.title,
        exercises: newWorkout.exercises,
      }));
    });

    it('deve lançar um erro se o usuário não estiver autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });
      await expect(workoutService.addWorkout(newWorkout)).rejects.toThrow('Usuário não autenticado');
    });
  });

  describe('updateWorkout', () => {
    const updatedWorkout: Workout = { id: '1', title: 'Treino Atualizado', exercises: [] };

    it('deve atualizar um treino com sucesso', async () => {
      // O eq é o último da cadeia (from().update().eq())
      mockEq.mockResolvedValue({ error: null });

      await workoutService.updateWorkout('1', updatedWorkout);

      expect(supabase.from).toHaveBeenCalledWith('workouts');
      expect(mockUpdate).toHaveBeenCalledWith({
        title: updatedWorkout.title,
        exercises: updatedWorkout.exercises,
      });
      expect(mockEq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('deleteWorkout', () => {
    it('deve deletar um treino com sucesso', async () => {
      // O eq é o último da cadeia (from().delete().eq())
      mockEq.mockResolvedValue({ error: null });

      await workoutService.deleteWorkout('1');

      expect(supabase.from).toHaveBeenCalledWith('workouts');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', '1');
    });
  });
});