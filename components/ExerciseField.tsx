import { UseFormRegister } from "react-hook-form";
import { Workout } from "@/types";

interface ExerciseFieldProps {
  index: number;
  register: UseFormRegister<Workout>;
  onRemove: () => void;
}

export function ExerciseField({
  index,
  register,
  onRemove,
}: ExerciseFieldProps) {
  const nameId = `exercise-${index}-name`;
  const restTimeId = `exercise-${index}-restTime`;
  const repsId = `exercise-${index}-reps`;
  const weightId = `exercise-${index}-weight`;

  return (
    <div className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-zinc-100">
          Exercício #{index + 1}
        </h2>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 text-xs hover:text-red-400 transition-colors"
        >
          Remover
        </button>
      </div>

      <div>
        <label
          htmlFor={nameId}
          className="block text-sm font-medium text-zinc-400"
        >
          Nome
        </label>
        <input
          id={nameId}
          type="text"
          placeholder="Ex: Agachamento Livre"
          {...register(`exercises.${index}.name`, { required: true })}
          className="mt-1 bg-zinc-800 p-3 rounded-lg w-full focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label
          htmlFor={restTimeId}
          className="block text-sm font-medium text-zinc-400"
        >
          Descanso (segundos)
        </label>
        <input
          id={restTimeId}
          type="number"
          {...register(`exercises.${index}.restTime`, {
            required: true,
            min: 0,
          })}
          className="mt-1 bg-zinc-800 p-3 rounded-lg w-full focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          Série 1 (Referência)
        </label>
        <div className="grid grid-cols-2 gap-3 text-sm font-medium text-zinc-500 text-center px-2">
          <span>REPS</span>
          <span>KG</span>
        </div>
        <div className="grid grid-cols-2 items-center text-center p-2 rounded-lg bg-zinc-800/50 gap-2">
          <input
            id={repsId}
            type="number"
            aria-label="Reps"
            {...register(`exercises.${index}.sets.0.reps`, { required: true })}
            className="bg-transparent text-zinc-100 text-center w-full focus:outline-none focus:border-b border-emerald-500"
          />
          <input
            id={weightId}
            type="number"
            aria-label="Kg"
            {...register(`exercises.${index}.sets.0.weight`, {
              required: true,
            })}
            className="bg-transparent text-zinc-100 text-center w-full focus:outline-none focus:border-b border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
