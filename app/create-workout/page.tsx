"use client";

import {
  useForm,
  useFieldArray,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Workout } from "@/types";
import { HomeButton } from "@/components/HomeButton";
import { generateId } from "@/utils/generateId";
import { ExerciseField } from "@/components/ExerciseField";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";

export default function CreateWorkoutPage() {
  const { saveWorkout } = useCreateWorkout();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Workout>({
    defaultValues: {
      title: "",
      exercises: [
        {
          id: generateId(),
          name: "",
          restTime: 60,
          sets: [{ id: generateId(), reps: 0, weight: 0, completed: false }],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 px-4 md:px-8 py-4 md:py-8 font-sans w-full">
      <PageHeader />

      <form onSubmit={handleSubmit(saveWorkout)} className="space-y-6 pb-24">
        <TitleInput register={register} errors={errors} />

        {fields.map((field, index) => (
          <ExerciseField
            key={field.id}
            index={index}
            register={register}
            onRemove={() => remove(index)}
          />
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              id: generateId(),
              name: "",
              restTime: 60,
              sets: [
                { id: generateId(), reps: 0, weight: 0, completed: false },
              ],
            })
          }
          className="w-full bg-zinc-800/80 hover:bg-zinc-800 text-emerald-400 px-5 py-4 rounded-xl font-semibold transition-all border border-zinc-700/50 border-dashed"
        >
          + Adicionar Exercício
        </button>

        <button
          type="submit"
          className="fixed bottom-4 left-4 right-4 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-2xl p-4 text-zinc-950 font-bold z-50 shadow-lg shadow-emerald-900/50"
        >
          Salvar Treino
        </button>
      </form>
    </main>
  );
}

// --- SUBCOMPONENTES ---

function PageHeader() {
  return (
    <div className="mb-8 flex items-center gap-4">
      <HomeButton />
      <div>
        <h1 className="text-3xl font-bold text-emerald-500 tracking-tight">
          Criar Novo Treino
        </h1>
        <p className="text-zinc-400 mt-1">
          Personalize os seus exercícios e cargas.
        </p>
      </div>
    </div>
  );
}

function TitleInput({
  register,
  errors,
}: {
  register: UseFormRegister<Workout>;
  errors: FieldErrors<Workout>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400">Título</label>
      <input
        type="text"
        placeholder="Ex: Treino C - Pernas"
        {...register("title", { required: true })}
        className="mt-1 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 w-full focus:outline-none focus:border-emerald-500"
      />
      {errors.title && (
        <span className="text-red-500 text-xs mt-1">Título é obrigatório</span>
      )}
    </div>
  );
}
