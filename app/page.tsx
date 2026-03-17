"use client"; // Adicionado porque agora precisamos de ler o estado local

import Link from "next/link";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useWorkoutStore } from "@/store/useWorkoutStore";

export default function Dashboard() {
  // Agora puxamos a lista real e reativa de treinos!
  const { workouts } = useWorkoutStore();

  return (
    <main className="w-full px-4 md:px-8 py-4 md:py-8">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
          Visão Geral
        </h1>
        <p className="text-zinc-400 mt-1">Qual é o plano para hoje?</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Os seus treinos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Se não houver treinos, mostramos uma mensagem simpática */}
          {workouts.length === 0 ? (
            <div className="col-span-full py-8 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
              Ainda não tem treinos criados. Comece por criar um novo!
            </div>
          ) : (
            // Caso contrário, listamos os treinos
            workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          )}

          <Link href="/create-workout">
            <div className="h-full min-h-35 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer">
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-medium">Criar novo treino</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
