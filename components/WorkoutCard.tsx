"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workout } from "@/types";

interface Props {
  workout: Workout;
}

export function WorkoutCard({ workout }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = () => {
    // Navega para a página do treino
    router.push(`/treino/${workout.id}`);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique acione o handleCardClick
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Editar treino:", workout.id);
    // Futuramente: router.push(`/edit-workout/${workout.id}`)
    setMenuOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Excluir treino:", workout.id);
    // Futuramente: remover da store/banco de dados
    setMenuOpen(false);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500 transition-all group cursor-pointer relative overflow-visible"
    >
      {/* Efeito de fundo verde no hover */}
      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      {/* Container do Menu (3 Pontinhos) */}
      <div className="absolute top-4 right-4 z-20" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
          aria-label="Opções do treino"
        >
          {/* Ícone de 3 pontos verticais (idêntico ao do Gemini/Material Design) */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={handleEdit}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
            >
              Editar
            </button>
            <div className="h-px bg-zinc-700/50 w-full" />{" "}
            {/* Linha divisória */}
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-zinc-700 hover:text-red-300 transition-colors flex items-center gap-2"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-emerald-500 group-hover:text-emerald-400 transition-colors pr-8 relative z-10">
        {workout.title}
      </h3>
      <p className="text-sm text-zinc-400 mt-2 relative z-10">
        {workout.exercises.length} exercícios registados
      </p>

      <div className="mt-6 flex items-center text-sm font-medium text-zinc-300 relative z-10">
        <span className="bg-zinc-800 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors pointer-events-none">
          Iniciar treino
        </span>
      </div>
    </div>
  );
}
