import { useEffect } from "react";
import { useWorkoutStore } from "@/store/useWorkoutStore";

export function useActiveWorkout(workoutId: string) {
  const { activeWorkout, setActiveWorkout, workouts } = useWorkoutStore();

  useEffect(() => {
    if (!activeWorkout || activeWorkout.id !== workoutId) {
      const treinoClicado = workouts.find((w) => w.id === workoutId);

      if (treinoClicado) {
        setActiveWorkout(treinoClicado);
      }
    }
  }, [activeWorkout, workoutId, workouts, setActiveWorkout]);

  return { activeWorkout };
}