import { render, screen, fireEvent } from "@testing-library/react";
import { RestTimer } from "./RestTimer";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useTimer } from "@/hooks/useTimer";
import { usePathname } from "next/navigation";

// Mock dos hooks e do store
jest.mock("@/store/useWorkoutStore");
jest.mock("@/hooks/useTimer");
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUseWorkoutStore = jest.mocked(useWorkoutStore);
const mockUsePathname = usePathname as jest.Mock;
const mockUseTimer = useTimer as jest.Mock;

describe("RestTimer", () => {
  const toggleRestTimer = jest.fn();
  const updateSet = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseTimer.mockReturnValue(undefined); // useTimer não tem retorno visível
  });

  it("não deve renderizar quando isResting for falso", () => {
    mockUsePathname.mockReturnValue("/workout/1");
    mockUseWorkoutStore.mockReturnValue({
      isResting: false,
      restTimeRemaining: 60,
      toggleRestTimer,
      updateSet,
    });

    const { container } = render(<RestTimer />);
    expect(container.firstChild).toBeNull();
  });

  it("não deve renderizar na página de login", () => {
    mockUsePathname.mockReturnValue("/login");
    mockUseWorkoutStore.mockReturnValue({
      isResting: true,
      restTimeRemaining: 60,
    });

    const { container } = render(<RestTimer />);
    expect(container.firstChild).toBeNull();
  });

  it("deve renderizar com o tempo formatado correto quando isResting for verdadeiro", () => {
    mockUsePathname.mockReturnValue("/workout/1");
    mockUseWorkoutStore.mockReturnValue({
      isResting: true,
      restTimeRemaining: 75, // 1 minuto e 15 segundos
      toggleRestTimer,
      updateSet,
    });

    render(<RestTimer />);

    expect(screen.getByText("Descanso")).toBeInTheDocument();
    expect(screen.getByText("01:15")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pular" })).toBeInTheDocument();
  });

  it('deve chamar toggleRestTimer e updateSet quando o botão "Pular" for clicado', () => {
    const exerciseId = "ex1";
    const setId = "set1";
    mockUsePathname.mockReturnValue("/workout/1");
    mockUseWorkoutStore.mockReturnValue({
      isResting: true,
      restTimeRemaining: 60,
      toggleRestTimer,
      updateSet,
      activeExerciseId: exerciseId,
      activeSetId: setId,
    });

    render(<RestTimer />);

    const skipButton = screen.getByRole("button", { name: "Pular" });
    fireEvent.click(skipButton);

    // Deve desativar o timer
    expect(toggleRestTimer).toHaveBeenCalledWith(0);
    // Deve desmarcar o "feito" da série ativa
    expect(updateSet).toHaveBeenCalledWith(exerciseId, setId, {
      completed: false,
    });
  });
});
