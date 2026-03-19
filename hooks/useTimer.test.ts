
import { renderHook } from '@testing-library/react';
import { useTimer } from './useTimer';
import { useWorkoutStore } from '@/store/useWorkoutStore';

// Mock do store Zustand
jest.mock('@/store/useWorkoutStore');

// Tipagem para o mock do store
const mockedUseWorkoutStore = useWorkoutStore as jest.MockedFunction<typeof useWorkoutStore>;
const mockTickTimer = jest.fn();

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockTickTimer.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve iniciar o intervalo e chamar tickTimer quando isResting é verdadeiro', () => {
    mockedUseWorkoutStore.mockReturnValue({
      isResting: true,
      tickTimer: mockTickTimer,
    });

    renderHook(() => useTimer());

    // Avança o tempo em 3 segundos
    jest.advanceTimersByTime(3000);

    expect(mockTickTimer).toHaveBeenCalledTimes(3);
  });

  it('não deve iniciar o intervalo quando isResting é falso', () => {
    mockedUseWorkoutStore.mockReturnValue({
      isResting: false,
      tickTimer: mockTickTimer,
    });

    renderHook(() => useTimer());

    // Avança o tempo
    jest.advanceTimersByTime(2000);

    expect(mockTickTimer).not.toHaveBeenCalled();
  });

  it('deve limpar o intervalo ao desmontar o hook', () => {
    mockedUseWorkoutStore.mockReturnValue({
      isResting: true,
      tickTimer: mockTickTimer,
    });
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useTimer());

    // O intervalo é criado
    expect(clearIntervalSpy).not.toHaveBeenCalled();

    unmount();

    // O intervalo deve ser limpo
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });

  it('deve reiniciar o intervalo se isResting mudar de false para true', () => {
    // 1. Inicia com isResting: false
    const { rerender } = renderHook(
      ({ isResting }) => {
        mockedUseWorkoutStore.mockReturnValue({ isResting, tickTimer: mockTickTimer });
        return useTimer();
      },
      { initialProps: { isResting: false } }
    );

    jest.advanceTimersByTime(1000);
    expect(mockTickTimer).not.toHaveBeenCalled();

    // 2. Atualiza para isResting: true
    rerender({ isResting: true });

    jest.advanceTimersByTime(2000);
    expect(mockTickTimer).toHaveBeenCalledTimes(2);
  });
});
