export type Set = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  sets: Set[];
  restTime: number; // segundos
  observations?: string;
};

export type Workout = {
  id: string;
  title: string; // Ex: Treino A - Peito e Tríceps
  lastPerformed?: Date;
  exercises: Exercise[];
};
