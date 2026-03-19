
import { renderHook, act, waitFor } from '@testing-library/react';
import type { User, UserResponse } from '@supabase/supabase-js';
import { useAuth } from './useAuth';
import { supabase } from '@/utils/supabase';

// Mock de 'next/navigation'
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

// Mock do Supabase
jest.mock('@/utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const mockSupabaseAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;

// Helper para criar uma resposta de usuário mockada e tipada
const createMockUserResponse = (
  userData: Partial<User> | null
): UserResponse => ({
  data: {
    user: userData as User,
  },
  error: null,
});

describe('useAuth', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve carregar os dados do usuário e gerar as iniciais a partir do nome completo', async () => {
    const mockUserResponse = createMockUserResponse({
      user_metadata: { first_name: 'John', last_name: 'Doe' },
      email: 'john.doe@example.com',
    });
    mockSupabaseAuth.getUser.mockResolvedValue(mockUserResponse);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.userName).toBe('John Doe');
      expect(result.current.userInitials).toBe('JD');
    });
  });

  it('deve usar o email quando o nome do usuário não estiver disponível', async () => {
    const mockUserResponse = createMockUserResponse({
      user_metadata: {},
      email: 'testuser@email.com',
    });
    mockSupabaseAuth.getUser.mockResolvedValue(mockUserResponse);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.userName).toBe('testuser');
      expect(result.current.userInitials).toBe('T');
    });
  });

  it('deve chamar signOut e redirecionar para /login ao deslogar', async () => {
    const mockUserResponse = createMockUserResponse({
      user_metadata: { first_name: 'Jane' },
      email: 'jane@example.com',
    });
    mockSupabaseAuth.getUser.mockResolvedValue(mockUserResponse);
    mockSupabaseAuth.signOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());

    // Aguarda o estado inicial ser definido
    await waitFor(() => {
      expect(result.current.userName).toBe('Jane ');
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockSupabaseAuth.signOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('deve definir um estado padrão se não houver usuário', async () => {
    const mockUserResponse = createMockUserResponse(null);
    mockSupabaseAuth.getUser.mockResolvedValue(mockUserResponse);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.userName).toBe('Usuário');
      expect(result.current.userInitials).toBe('U');
    });
  });
});
