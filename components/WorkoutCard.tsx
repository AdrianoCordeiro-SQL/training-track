"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workout } from "@/types";
import { useWorkoutStore } from "@/store/useWorkoutStore";

interface Props {
  workout: Workout;
}

export function WorkoutCard({ workout }: Props) {
  const router = useRouter();
  const { deleteWorkout } = useWorkoutStore();

  // Estados separados para o menu e para o modal de exclusão
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    // Só navega para o treino se não estiver com o modal ou menu abertos
    if (!showDeleteModal) {
      router.push(`/treino/${workout.id}`);
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede o clique no cartão inteiro
    setMenuOpen(!menuOpen);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    // Agora ele navega para a rota dinâmica de edição passando o ID do treino
    router.push(`/edit-workout/${workout.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false); // Fecha o menu dos 3 pontinhos
    setShowDeleteModal(true); // Abre o nosso card (modal) de confirmação
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteWorkout(workout.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500 transition-all group cursor-pointer relative overflow-visible flex flex-col justify-between"
      >
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

        {/* Menu (3 Pontinhos) */}
        <div className="absolute top-4 right-4 z-20" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {/* Dropdown com Editar e Excluir */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={handleEditClick}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Editar
              </button>
              <div className="h-px bg-zinc-700/50 w-full" />
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-zinc-700 hover:text-red-300 transition-colors"
              >
                Excluir
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-emerald-500 group-hover:text-emerald-400 transition-colors pr-8 relative z-10">
            {workout.title}
          </h3>
          <p className="text-sm text-zinc-400 mt-2 relative z-10">
            {workout.exercises.length} exercícios registados
          </p>
        </div>

        <div className="mt-6 flex items-center text-sm font-medium text-zinc-300 relative z-10">
          <span className="bg-zinc-800 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors pointer-events-none">
            Iniciar treino
          </span>
        </div>
      </div>

      {/* Card (Modal) de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={cancelDelete} // Clicar fora também cancela
        >
          <div
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do card feche o modal
          >
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              Excluir treino?
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Tem a certeza que deseja excluir o{" "}
              <strong>{workout.title}</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-red-50 hover:text-white bg-red-500/80 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
