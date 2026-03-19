"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useForm,
  useFieldArray,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Workout } from "@/types";
import { HomeButton } from "@/components/HomeButton";
import { useEditWorkout } from "@/hooks/useEditWorkout";

export default function EditWorkoutPage() {
  const params = useParams();
  const workoutId = params.id as string;
  const { workoutToEdit, saveWorkout, goBack } = useEditWorkout(workoutId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Workout>({
    defaultValues: workoutToEdit,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  useEffect(() => {
    if (workoutToEdit) {
      reset(workoutToEdit);
    }
  }, [workoutToEdit, reset]);

  if (!workoutToEdit) {
    return <WorkoutNotFound onBack={goBack} />;
  }

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
              id: String(Date.now()),
              name: "",
              restTime: 60,
              sets: [
                {
                  id: String(Date.now() + 1),
                  reps: 0,
                  weight: 0,
                  completed: false,
                },
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
          Salvar Alterações
        </button>
      </form>
    </main>
  );
}

// --- SUBCOMPONENTES ---

function WorkoutNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-950 text-zinc-400 gap-4">
      <p>A carregar ferro... ou treino não encontrado.</p>
      <button onClick={onBack} className="text-emerald-500 hover:underline">
        Voltar para a Visão Geral
      </button>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-8 flex items-center gap-4">
      <HomeButton />
      <div>
        <h1 className="text-3xl font-bold text-emerald-500 tracking-tight">
          Editar Treino
        </h1>
        <p className="text-zinc-400 mt-1">
          Ajuste as suas cargas e exercícios.
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
        {...register("title", { required: true })}
        className="mt-1 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 w-full focus:outline-none focus:border-emerald-500"
      />
      {errors.title && (
        <span className="text-red-500 text-xs mt-1">Título é obrigatório</span>
      )}
    </div>
  );
}

function ExerciseField({
  index,
  register,
  onRemove,
}: {
  index: number;
  register: UseFormRegister<Workout>;
  onRemove: () => void;
}) {
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
        <label className="block text-sm font-medium text-zinc-400">Nome</label>
        <input
          type="text"
          {...register(`exercises.${index}.name`, { required: true })}
          className="mt-1 bg-zinc-800 p-3 rounded-lg w-full focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-400">
          Tempo de Descanso (segundos)
        </label>
        <input
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
            type="number"
            {...register(`exercises.${index}.sets.0.reps`, { required: true })}
            className="bg-transparent text-zinc-100 text-center w-full focus:outline-none focus:border-b border-emerald-500"
          />
          <input
            type="number"
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
