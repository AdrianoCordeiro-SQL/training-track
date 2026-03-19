"use client";

import { useParams } from "next/navigation";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useActiveWorkout } from "@/hooks/useActiveWorkout";
import { Exercise } from "@/types";

export default function TreinoPage() {
  const params = useParams();
  const workoutId = params.id as string;
  const { activeWorkout } = useActiveWorkout(workoutId);

  if (!activeWorkout) {
    return <LoadingScreen />;
  }

  return (
    <main className="w-full p-4 md:p-8">
      <WorkoutHeader title={activeWorkout.title} />

      <section className="space-y-6 pb-24">
        {activeWorkout.exercises.map((exercise) => (
          <ExerciseSection key={exercise.id} exercise={exercise} />
        ))}
      </section>
    </main>
  );
}

// --- SUBCOMPONENTES ---

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
      Carregando treino...
    </div>
  );
}

function WorkoutHeader({ title }: { title: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-emerald-500 tracking-tight">
        {title}
      </h1>
      <p className="text-zinc-400 mt-1">
        Pegue a sua garrafa de água e prepare-se!
      </p>
    </header>
  );
}

function ExerciseSection({ exercise }: { exercise: Exercise }) {
  return (
    <div className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800">
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
  );
}
