import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { ExerciseField } from "./ExerciseField";
import { Workout } from "@/types";

// Componente Wrapper para fornecer o contexto do react-hook-form
const Wrapper = ({
  index = 0,
  onRemove = jest.fn(),
}: {
  index?: number;
  onRemove?: () => void;
}) => {
  const { register } = useForm<Workout>();
  return (
    <ExerciseField index={index} register={register} onRemove={onRemove} />
  );
};

describe("ExerciseField", () => {
  it("deve renderizar corretamente com o índice fornecido", () => {
    render(<Wrapper index={5} />);

    expect(screen.getByText("Exercício #6")).toBeInTheDocument();
  });

  it('deve chamar onRemove quando o botão "Remover" é clicado', () => {
    const onRemoveMock = jest.fn();
    render(<Wrapper onRemove={onRemoveMock} />);

    const removeButton = screen.getByText("Remover");
    fireEvent.click(removeButton);

    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });

  // Este teste é mais conceitual, pois não podemos verificar diretamente
  // as chamadas internas do `register` de forma simples.
  // Em vez disso, verificamos se os inputs esperados estão presentes.
  it("deve renderizar todos os campos de entrada necessários para o registro", () => {
    render(<Wrapper index={0} />);

    // Verifica se os campos de input existem, o que implica que `register` foi chamado
    expect(
      screen.getByPlaceholderText("Ex: Agachamento Livre"),
    ).toBeInTheDocument();

    const numberInputs = screen.getAllByRole("spinbutton");
    expect(numberInputs).toHaveLength(3); // Descanso, Reps, KG
  });
});
