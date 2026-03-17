import Link from "next/link";
import { HomeButton } from "./HomeButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      {/* Removemos o max-w-5xl para que ocupe toda a largura e alinhe com o main */}
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full">
        {/* Lado Esquerdo: Botão Home + Nome do App */}
        <div className="flex items-center gap-3">
          <HomeButton />
          <span className="font-bold text-lg tracking-tight text-zinc-100 hidden sm:block">
            Training<span className="text-emerald-500">Track</span>
          </span>
        </div>

        {/* Lado Direito: Ações */}
        <nav>
          <Link
            href="/create-workout"
            className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 px-4 py-2 rounded-lg"
          >
            + Novo Treino
          </Link>
        </nav>
      </div>
    </header>
  );
}
