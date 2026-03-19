import { useRouter } from "next/navigation";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { Workout } from "@/types";

export function useEditWorkout(workoutId: string) {
  const router = useRouter();
  const { workouts, updateWorkout } = useWorkoutStore();

  const workoutToEdit = workouts.find((w) => w.id === workoutId);

  const saveWorkout = (data: Workout) => {
    updateWorkout(workoutId, { ...data, id: workoutId });
    router.push("/");
  };

  const goBack = () => router.push("/");

  return { workoutToEdit, saveWorkout, goBack };
}