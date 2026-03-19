import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfile } from './useProfile';
import { supabase } from '@/utils/supabase';
import { User, UserResponse, AuthError } from '@supabase/supabase-js';

// 1. Mock do Supabase "limpo" para evitar erros de inicialização (Hoisting)
jest.mock('@/utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      updateUser: jest.fn(),
      signInWithPassword: jest.fn(),
    },
    storage: {
      from: jest.fn(),
    },
  },
}));

// Atalho para manter os tipos do TypeScript felizes nos testes
const mockAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;
const mockStorageFrom = supabase.storage.from as jest.Mock;

describe('useProfile', () => {
  const mockUpload = jest.fn();
  const mockGetPublicUrl = jest.fn();

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { first_name: 'John', last_name: 'Doe' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: 'authenticated',
  };

  // Helper para criar respostas de sucesso do Supabase sem erros de tipagem
  const createSuccessResponse = (user: User) => ({
    data: { user },
    error: null,
  } as unknown as UserResponse);

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configura o mock do storage.from encadeado
    mockStorageFrom.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    });
  });

  it('deve carregar os dados iniciais do usuário corretamente', async () => {
    mockAuth.getUser.mockResolvedValue(createSuccessResponse(mockUser));

    const { result } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.metadata).toEqual({ first_name: 'John', last_name: 'Doe' });
    expect(result.current.initials).toBe('JD');
  });

  it('deve atualizar as informações de contato com sucesso', async () => {
    mockAuth.getUser.mockResolvedValue(createSuccessResponse(mockUser));
    
    const updatedUser = { 
      ...mockUser, 
      user_metadata: { first_name: 'John', last_name: 'Doe', phone: '12345', address: 'Rua A' } 
    };
    mockAuth.updateUser.mockResolvedValue(createSuccessResponse(updatedUser));

    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success: boolean = false;
    await act(async () => {
      success = await result.current.updateContact({ phone: '12345', address: 'Rua A' });
    });

    expect(success).toBe(true);
    expect(mockAuth.updateUser).toHaveBeenCalledWith({ data: { phone: '12345', address: 'Rua A' } });
    expect(result.current.metadata.phone).toBe('12345');
    expect(result.current.statusMessage).toEqual({ type: 'success', text: 'Informações de contato atualizadas!' });
  });

  it('deve falhar ao atualizar a senha se a senha antiga for incorreta', async () => {
    mockAuth.getUser.mockResolvedValue(createSuccessResponse(mockUser));
    
    // Simula erro na verificação da senha antiga criando uma instância real de AuthError
    const mockAuthError = new AuthError('Invalid credentials');
    mockAuthError.status = 400;

    mockAuth.signInWithPassword.mockResolvedValue({ 
      data: { user: null, session: null }, 
      error: mockAuthError 
    });

    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success: boolean = false;
    await act(async () => {
      success = await result.current.updatePassword({ oldPassword: 'wrong', newPassword: 'new' });
    });

    expect(success).toBe(false);
    expect(mockAuth.updateUser).not.toHaveBeenCalled();
    expect(result.current.statusMessage).toEqual({ type: 'error', text: 'A senha atual está incorreta.' });
  });

  it('deve rejeitar upload de avatar se o arquivo for maior que 2MB', async () => {
    mockAuth.getUser.mockResolvedValue(createSuccessResponse(mockUser));
    
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Cria um mock de File com tamanho artificialmente grande (>2MB)
    const largeFile = new File([''], 'big.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 });

    await act(async () => {
      await result.current.uploadAvatar(largeFile);
    });

    expect(mockUpload).not.toHaveBeenCalled();
    expect(result.current.statusMessage).toEqual({ type: 'error', text: 'A imagem deve ter no máximo 2MB.' });
  });

  it('deve realizar upload do avatar e atualizar os metadados com sucesso', async () => {
    mockAuth.getUser.mockResolvedValue(createSuccessResponse(mockUser));
    
    // Configura os mocks de sucesso para o storage
    mockUpload.mockResolvedValue({ data: { path: 'path' }, error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'http://avatar.url/img.png' } });
    
    const updatedUser = { 
      ...mockUser, 
      user_metadata: { ...mockUser.user_metadata, avatar_url: 'http://avatar.url/img.png' } 
    };
    mockAuth.updateUser.mockResolvedValue(createSuccessResponse(updatedUser));

    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const validFile = new File(['dummy content'], 'avatar.png', { type: 'image/png' });

    await act(async () => {
      await result.current.uploadAvatar(validFile);
    });

    // Verifica se a chamada do bucket foi correta
    expect(mockStorageFrom).toHaveBeenCalledWith('avatars');
    
    // Verifica se o upload usou o formato `user-123/avatar_...`
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^user-123\/avatar_\d+\.png$/), 
      validFile, 
      { upsert: true }
    );

    // Verifica se os metadados foram atualizados
    expect(result.current.metadata.avatar_url).toBe('http://avatar.url/img.png');
    expect(result.current.statusMessage).toEqual({ type: 'success', text: 'Foto de perfil atualizada!' });
  });
});