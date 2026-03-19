"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useTimer } from "@/hooks/useTimer";

export function RestTimer() {
  // Inicializamos o hook que criámos anteriormente para fazer a contagem decrescente
  useTimer();

  const {
    isResting,
    restTimeRemaining,
    toggleRestTimer,
    activeExerciseId,
    activeSetId,
    updateSet,
  } = useWorkoutStore();

  const pathname = usePathname();

  const handleCloseTimer = useCallback(() => {
    toggleRestTimer(0); // Desativa o timer
    if (activeExerciseId && activeSetId) {
      updateSet(activeExerciseId, activeSetId, { completed: false }); // Desmarca o FEITO
    }
  }, [activeExerciseId, activeSetId, toggleRestTimer, updateSet]);

  // Efeito que observa: se o tempo chegar a zero, fecha o timer e desmarca
  useEffect(() => {
    if (isResting && restTimeRemaining <= 0) {
      handleCloseTimer();
    }
  }, [isResting, restTimeRemaining, handleCloseTimer]);

  if (pathname === "/login" || pathname === "/register") return null;

  // Se não estiver em período de descanso, o componente não é renderizado
  if (!isResting || restTimeRemaining <= 0) return null;

  // Formatar o tempo para MM:SS
  const minutes = Math.floor(restTimeRemaining / 60);
  const seconds = restTimeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-emerald-600 rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-emerald-900/50 text-zinc-50 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-emerald-100 uppercase tracking-wider">
          Descanso
        </span>
        <span className="text-3xl font-bold tracking-tighter tabular-nums">
          {formattedTime}
        </span>
      </div>

      {/* Botão para saltar o descanso */}
      <button
        onClick={handleCloseTimer}
        className="bg-zinc-950/20 hover:bg-zinc-950/40 active:bg-zinc-950/60 px-5 py-3 rounded-xl font-semibold transition-all"
      >
        Pular
      </button>
    </div>
  );
}
