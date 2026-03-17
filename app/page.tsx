import Link from "next/link";
import { mockWorkout } from "@/utils/mockData";

export default function Dashboard() {
  return (
    <main className="w-full p-4 md:p-8">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
          Visão Geral
        </h1>
        <p className="text-zinc-400 mt-1">
          Bem-vindo de volta. Qual é o plano para hoje?
        </p>
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Os seus treinos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cartão do Treino A que liga à nova rota dinâmica */}
          <Link href={`/treino/${mockWorkout.id}`}>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500 transition-all group cursor-pointer relative overflow-hidden">
              {/* Efeito visual de fundo no hover */}
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <h3 className="text-lg font-bold text-emerald-500 group-hover:text-emerald-400 transition-colors relative z-10">
                {mockWorkout.title}
              </h3>
              <p className="text-sm text-zinc-400 mt-2 relative z-10">
                {mockWorkout.exercises.length} exercícios registados
              </p>

              <div className="mt-6 flex items-center text-sm font-medium text-zinc-300 relative z-10">
                <span className="bg-zinc-800 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
                  Iniciar treino
                </span>
              </div>
            </div>
          </Link>

          {/* Botão de Adicionar Mais Treinos (Atalho) */}
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
