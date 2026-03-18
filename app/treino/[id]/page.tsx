"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkoutStore } from "@/store/useWorkoutStore";

import { ExerciseCard } from "@/components/ExerciseCard";

export default function TreinoPage() {
  const params = useParams();
  const { activeWorkout, setActiveWorkout, workouts } = useWorkoutStore();

  useEffect(() => {
    if (!activeWorkout || activeWorkout.id !== params.id) {
      const treinoClicado = workouts.find((w) => w.id === params.id);

      if (treinoClicado) {
        setActiveWorkout(treinoClicado);
      }
    }
  }, [activeWorkout, params.id, workouts, setActiveWorkout]);

  if (!activeWorkout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Carregando treino...
      </div>
    );
  }

  return (
    <main className="w-full p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-500 tracking-tight">
          {activeWorkout.title}
        </h1>
        <p className="text-zinc-400 mt-1">
          Pegue na sua garrafa de água e prepare-se!
        </p>
      </header>

      <section className="space-y-6 pb-24">
        {activeWorkout.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">
                  {exercise.name}
                </h2>
                {exercise.observations && (
                  <p className="text-sm text-zinc-400 mt-1 italic">
                    💡 {exercise.observations}
                  </p>
                )}
              </div>
              <span className="bg-zinc-800 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full">
                ⏱ {exercise.restTime}s
              </span>
            </div>
            <ExerciseCard exercise={exercise} />
          </div>
        ))}
      </section>
    </main>
  );
}
