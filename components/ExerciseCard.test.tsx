import { render, screen, fireEvent } from "@testing-library/react";
import { ExerciseCard } from "./ExerciseCard";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { Exercise } from "@/types";

jest.mock("@/store/useWorkoutStore");

const mockExercise: Exercise = {
  id: "ex1",
  name: "Supino Reto",
  sets: [
    { id: "set1", reps: 10, weight: 100, completed: false },
    { id: "set2", reps: 8, weight: 110, completed: true },
  ],
  restTime: 60,
};

describe("ExerciseCard", () => {
  const updateSet = jest.fn();
  const toggleRestTimer = jest.fn();

  beforeEach(() => {
    (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
      updateSet,
      toggleRestTimer,
    });
    jest.clearAllMocks();
  });

  it("deve renderizar os dados do exercício corretamente", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    // Verifica cabeçalhos
    expect(screen.getByText("SÉRIE")).toBeInTheDocument();
    expect(screen.getByText("KG")).toBeInTheDocument();
    expect(screen.getByText("REPS")).toBeInTheDocument();
    expect(screen.getByText("FEITO")).toBeInTheDocument();

    // Verifica os dados das séries
    const weightInputs = screen.getAllByRole("spinbutton");
    expect(weightInputs[0]).toHaveValue(100);
    expect(weightInputs[2]).toHaveValue(110);

    const repsInputs = screen.getAllByRole("spinbutton");
    expect(repsInputs[1]).toHaveValue(10);
    expect(repsInputs[3]).toHaveValue(8);

    // Verifica o estado de conclusão
    const completedSet = screen.getByText("2").closest("div");
    expect(completedSet).toHaveClass("bg-emerald-900/20");
  });

  it("deve chamar updateSet quando o peso é alterado", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    const weightInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(weightInput, { target: { value: "105" } });

    expect(updateSet).toHaveBeenCalledWith("ex1", "set1", { weight: 105 });
  });

  it("deve chamar updateSet quando as repetições são alteradas", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    const repsInput = screen.getAllByRole("spinbutton")[1];
    fireEvent.change(repsInput, { target: { value: "12" } });

    expect(updateSet).toHaveBeenCalledWith("ex1", "set1", { reps: 12 });
  });

  it("deve chamar updateSet e toggleRestTimer quando uma série é marcada como concluída", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    const completeButtons = screen.getAllByRole("button");
    fireEvent.click(completeButtons[0]);

    expect(updateSet).toHaveBeenCalledWith("ex1", "set1", { completed: true });
    expect(toggleRestTimer).toHaveBeenCalledWith(60, "ex1", "set1");
  });

  it("deve chamar apenas updateSet quando uma série é marcada como incompleta", () => {
    render(<ExerciseCard exercise={mockExercise} />);

    const completeButtons = screen.getAllByRole("button");
    fireEvent.click(completeButtons[1]); // Clica na série já completa

    expect(updateSet).toHaveBeenCalledWith("ex1", "set2", { completed: false });
    expect(toggleRestTimer).not.toHaveBeenCalled();
  });
});
