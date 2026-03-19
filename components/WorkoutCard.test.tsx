import { render, screen, fireEvent } from "@testing-library/react";
import { WorkoutCard } from "./WorkoutCard";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useRouter } from "next/navigation";
import { Workout } from "@/types";

// Mock dos hooks e do store
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/store/useWorkoutStore");

const mockUseRouter = useRouter as jest.Mock;
const mockUseWorkoutStore = useWorkoutStore as jest.Mock;

const mockWorkout: Workout = {
  id: "workout1",
  title: "Treino de Peito",
  exercises: [
    { id: "ex1", name: "Supino", sets: [], restTime: 60 },
    { id: "ex2", name: "Flexão", sets: [], restTime: 60 },
  ],
};

describe("WorkoutCard", () => {
  const pushMock = jest.fn();
  const deleteWorkoutMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: pushMock });
    mockUseWorkoutStore.mockReturnValue({ deleteWorkout: deleteWorkoutMock });
  });

  it("deve renderizar o título do treino e a contagem de exercícios", () => {
    render(<WorkoutCard workout={mockWorkout} />);

    expect(screen.getByText("Treino de Peito")).toBeInTheDocument();
    expect(screen.getByText("2 exercícios registados")).toBeInTheDocument();
  });

  it("deve navegar para a página de treino ao clicar no card", () => {
    render(<WorkoutCard workout={mockWorkout} />);

    fireEvent.click(screen.getByText("Treino de Peito"));
    expect(pushMock).toHaveBeenCalledWith("/treino/workout1");
  });

  it("deve abrir e fechar o menu suspenso", () => {
    render(<WorkoutCard workout={mockWorkout} />);
    const menuButton = screen.getByRole("button", { name: "" }); // O botão de 3 pontos não tem texto

    // Abre o menu
    fireEvent.click(menuButton);
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();

    // Fecha o menu (simulando um clique fora)
    fireEvent.mouseDown(document);
    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
  });

  it('deve navegar para a página de edição quando "Editar" for clicado', () => {
    render(<WorkoutCard workout={mockWorkout} />);
    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);

    const editButton = screen.getByText("Editar");
    fireEvent.click(editButton);

    expect(pushMock).toHaveBeenCalledWith("/edit-workout/workout1");
  });

  it('deve abrir o modal de exclusão quando "Excluir" for clicado', () => {
    render(<WorkoutCard workout={mockWorkout} />);
    const menuButton = screen.getByRole("button", { name: "" });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("Excluir");
    fireEvent.click(deleteButton);

    const modalTitle = /Tem a certeza que deseja excluir o/i;
    expect(screen.getByText(modalTitle)).toBeInTheDocument();
  });

  it("deve fechar o modal de exclusão quando 'Cancelar' for clicado", () => {
    render(<WorkoutCard workout={mockWorkout} />);
    // Abre o modal
    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(screen.getByText("Excluir"));

    // Verifica se o modal está visível
    const modalTitle = /Tem a certeza que deseja excluir o/i;
    expect(screen.getByText(modalTitle)).toBeInTheDocument();

    // Clica em cancelar
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
  });

  it('deve chamar deleteWorkout e fechar o modal quando "Sim, excluir" for clicado', () => {
    render(<WorkoutCard workout={mockWorkout} />);
    // Abre o modal
    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(screen.getByText("Excluir"));

    const modalTitle = /Tem a certeza que deseja excluir o/i;
    expect(screen.getByText(modalTitle)).toBeInTheDocument();

    // Clica em confirmar
    const confirmButton = screen.getByRole("button", { name: "Sim, excluir" });
    fireEvent.click(confirmButton);

    // Verifica se a função foi chamada
    expect(deleteWorkoutMock).toHaveBeenCalledWith("workout1");
    // Verifica se o modal foi fechado
    expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
  });
});
