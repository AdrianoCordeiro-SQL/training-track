import { render, screen } from "@testing-library/react";
import TreinoPage from "./page";
import { useActiveWorkout } from "@/hooks/useActiveWorkout";
import { useWorkoutStore } from "@/store/useWorkoutStore";

// 1. Mock do roteamento do Next.js para isolar a página
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "treino-123" }),
}));

// 2. Mock do hook que fornece os dados do treino em execução
jest.mock("@/hooks/useActiveWorkout", () => ({
  useActiveWorkout: jest.fn(),
}));

// 3. Mock da Store (Necessário porque a página renderiza o ExerciseCard, que consome a store)
jest.mock("@/store/useWorkoutStore", () => ({
  useWorkoutStore: jest.fn(),
}));

describe("TreinoPage", () => {
  // Mock de dados robusto, com o formato que os subcomponentes esperam
  const mockWorkout = {
    id: "treino-123",
    title: "Treino de Peito e Tríceps",
    exercises: [
      {
        id: "ex-1",
        name: "Supino Reto",
        observations: "Contrair bem o peitoral",
        restTime: 60,
        sets: [
          { id: "set-1", reps: 10, weight: 20, completed: false },
          { id: "set-2", reps: 10, weight: 20, completed: false },
        ],
      },
      {
        id: "ex-2",
        name: "Crucifixo",
        observations: "", // Sem observação para testar a renderização condicional
        restTime: 45,
        sets: [{ id: "set-3", reps: 12, weight: 14, completed: false }],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Retorno padrão da store para o ExerciseCard não quebrar ao renderizar na tela
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      updateSet: jest.fn(),
      toggleRestTimer: jest.fn(),
    });
  });

  it("deve renderizar a tela de carregamento inicialmente quando não há dados", () => {
    // Força o hook a retornar nulo para simular o carregamento
    (useActiveWorkout as jest.Mock).mockReturnValue({ activeWorkout: null });

    render(<TreinoPage />);

    // Verifica se o componente <LoadingScreen /> apareceu
    expect(screen.getByText("Carregando treino...")).toBeInTheDocument();
  });

  it("deve renderizar o cabeçalho e os exercícios corretamente quando os dados carregam", () => {
    // Força o hook a retornar o nosso mock preenchido
    (useActiveWorkout as jest.Mock).mockReturnValue({
      activeWorkout: mockWorkout,
    });

    render(<TreinoPage />);

    // 1. Verifica os títulos estáticos e dinâmicos do WorkoutHeader
    expect(screen.getByText("Treino de Peito e Tríceps")).toBeInTheDocument();
    expect(
      screen.getByText("Pegue a sua garrafa de água e prepare-se!"),
    ).toBeInTheDocument();

    // 2. Verifica se o Exercício 1 renderizou os detalhes
    expect(screen.getByText("Supino Reto")).toBeInTheDocument();
    expect(screen.getByText("💡 Contrair bem o peitoral")).toBeInTheDocument();
    expect(screen.getByText("⏱ 60s")).toBeInTheDocument();

    // 3. Verifica se o Exercício 2 renderizou corretamente
    expect(screen.getByText("Crucifixo")).toBeInTheDocument();
    expect(screen.getByText("⏱ 45s")).toBeInTheDocument();
  });

  it("não deve renderizar o ícone de lâmpada se o exercício não tiver observações", () => {
    (useActiveWorkout as jest.Mock).mockReturnValue({
      activeWorkout: mockWorkout,
    });

    render(<TreinoPage />);

    const observacoes = screen.getAllByText(/💡/);
    expect(observacoes).toHaveLength(1);
  });
});
