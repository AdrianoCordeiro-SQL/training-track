import { Exercise } from "@/types";
import { useWorkoutStore } from "@/store/useWorkoutStore";

interface Props {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: Props) {
  const { updateSet, toggleRestTimer } = useWorkoutStore();

  const handleSetCompletion = (setId: string, isCompleted: boolean) => {
    updateSet(exercise.id, setId, { completed: isCompleted });

    if (isCompleted) {
      toggleRestTimer(exercise.restTime);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Cabeçalho das colunas */}
      <div className="grid grid-cols-4 text-xs font-semibold text-zinc-500 text-center px-2">
        <span>SÉRIE</span>
        <span>KG</span>
        <span>REPS</span>
        <span>FEITO</span>
      </div>

      {/* Lista de Séries */}
      {exercise.sets.map((set, index) => (
        <div
          key={set.id}
          className={`grid grid-cols-4 items-center text-center p-2 rounded-lg transition-colors ${
            set.completed
              ? "bg-emerald-900/20 border border-emerald-900/50"
              : "bg-zinc-800/50"
          }`}
        >
          {/* Número da Série */}
          <span className="text-zinc-400 font-medium">{index + 1}</span>

          {/* Input de Carga (KG) */}
          <input
            type="number"
            defaultValue={set.weight}
            className="bg-transparent text-zinc-100 text-center w-full focus:outline-none focus:border-b border-emerald-500"
            onChange={(e) =>
              updateSet(exercise.id, set.id, { weight: Number(e.target.value) })
            }
          />

          {/* Input de Repetições */}
          <input
            type="number"
            defaultValue={set.reps}
            className="bg-transparent text-zinc-100 text-center w-full focus:outline-none focus:border-b border-emerald-500"
            onChange={(e) =>
              updateSet(exercise.id, set.id, { reps: Number(e.target.value) })
            }
          />

          {/* Botão de Concluir (Checkbox customizado) */}
          <div className="flex justify-center">
            <button
              onClick={() => handleSetCompletion(set.id, !set.completed)}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                set.completed
                  ? "bg-emerald-500 text-zinc-950 font-bold"
                  : "bg-zinc-700 text-transparent hover:bg-zinc-600"
              }`}
            >
              ✓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
