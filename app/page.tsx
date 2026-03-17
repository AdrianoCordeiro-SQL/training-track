"use client";

import { useEffect } from "react";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { mockWorkout } from "@/utils/mockData";
import { ExerciseCard } from "@/components/ExerciseCard";

export default function Home() {
  // Puxamos o estado e a ação lá do nosso Zustand
  const { activeWorkout, startWorkout } = useWorkoutStore();

  // Quando a página carregar, injetamos o mock no estado (se não houver um treino ativo)
  useEffect(() => {
    if (!activeWorkout) {
      startWorkout(mockWorkout);
    }
  }, [activeWorkout, startWorkout]);

  // Prevenção enquanto o Zustand hidrata os dados do localStorage
  if (!activeWorkout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Carregando ferro...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-500 tracking-tight">
          {activeWorkout.title}
        </h1>
        <p className="text-zinc-400 mt-1">Pegue sua garrafinha e se prepare!</p>
      </header>

      {/* Lista de Exercícios */}
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

            {/* Onde os inputs de peso e repetição vão entrar */}
            <ExerciseCard exercise={exercise} />
          </div>
        ))}
      </section>
    </main>
  );
}
