import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateWorkoutPage from "./page";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";

// Mock do hook responsável por salvar o treino
jest.mock("@/hooks/useCreateWorkout", () => ({
  useCreateWorkout: jest.fn(),
}));

// Mock do utilitário de geração de ID para previsibilidade
jest.mock("@/utils/generateId", () => {
  let idCounter = 1;
  return {
    generateId: jest.fn(() => `mock-id-${idCounter++}`),
  };
});

// Mock de subcomponentes para isolar o comportamento da página
jest.mock("@/components/HomeButton", () => ({
  HomeButton: () => <button data-testid="mock-home-button">Home</button>,
}));

jest.mock("@/components/ExerciseField", () => ({
  ExerciseField: ({ index, onRemove }: never) => (
    <div data-testid={`mock-exercise-field-${index}`}>
      <span>Exercício Mockado</span>
      <button
        type="button"
        onClick={onRemove}
        data-testid={`remove-exercise-${index}`}
      >
        Remover
      </button>
    </div>
  ),
}));

describe("CreateWorkoutPage", () => {
  const mockSaveWorkout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateWorkout as jest.Mock).mockReturnValue({
      saveWorkout: mockSaveWorkout,
    });
  });

  it("deve renderizar a página corretamente com os elementos iniciais", () => {
    render(<CreateWorkoutPage />);

    expect(screen.getByText("Criar Novo Treino")).toBeInTheDocument();
    expect(screen.getByTestId("mock-home-button")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Adicionar Exercício" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Salvar Treino" }),
    ).toBeInTheDocument();

    // Verifica se um campo de exercício padrão é renderizado através do useFieldArray
    expect(screen.getByTestId("mock-exercise-field-0")).toBeInTheDocument();
  });

  it("deve exibir erro de validação se tentar salvar o formulário sem título", async () => {
    const user = userEvent.setup();
    render(<CreateWorkoutPage />);

    const saveButton = screen.getByRole("button", { name: "Salvar Treino" });
    await user.click(saveButton);

    expect(await screen.findByText("Título é obrigatório")).toBeInTheDocument();
    expect(mockSaveWorkout).not.toHaveBeenCalled();
  });

  it("deve chamar saveWorkout ao preencher o título e enviar o formulário", async () => {
    const user = userEvent.setup();
    render(<CreateWorkoutPage />);

    const titleInput = screen.getByLabelText("Título");
    await user.type(titleInput, "Meu Treino de Costas");

    const saveButton = screen.getByRole("button", { name: "Salvar Treino" });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockSaveWorkout).toHaveBeenCalledTimes(1);
    });
  });

  it("deve adicionar e remover campos de exercício dinamicamente", async () => {
    const user = userEvent.setup();
    render(<CreateWorkoutPage />);

    const addExerciseBtn = screen.getByRole("button", {
      name: "+ Adicionar Exercício",
    });
    await user.click(addExerciseBtn);

    // Agora devem existir 2 campos na tela
    expect(screen.getByTestId("mock-exercise-field-1")).toBeInTheDocument();
    expect(screen.getAllByText("Exercício Mockado")).toHaveLength(2);

    // Vamos remover o primeiro
    const removeFirstBtn = screen.getByTestId("remove-exercise-0");
    await user.click(removeFirstBtn);

    await waitFor(() => {
      // Como removemos o índice 0, o que restou (antigo índice 1) passará a ser renderizado com index 0 pelo map, restando apenas 1 na tela.
      expect(screen.getAllByText("Exercício Mockado")).toHaveLength(1);
    });
  });
});
