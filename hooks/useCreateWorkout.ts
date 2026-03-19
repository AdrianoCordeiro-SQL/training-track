import { useRouter } from "next/navigation";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { Workout } from "@/types";
import { generateId } from "@/utils/generateId";

export function useCreateWorkout() {
  const router = useRouter();
  const { addWorkout } = useWorkoutStore();

  const saveWorkout = async (data: Workout) => {
    // Adicionamos o ID que falta à payload antes de enviar para a base de dados
    const newWorkout = { ...data, id: generateId() };
    await addWorkout(newWorkout);
    router.push("/");
  };

  return { saveWorkout };
}