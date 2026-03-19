"use client";
import { HomeButton } from "./HomeButton";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full">
        {/* Lado Esquerdo: Botão Home + Nome do App */}
        <div className="flex items-center gap-3">
          <HomeButton />
          <span className="font-bold text-lg tracking-tight text-zinc-100 hidden sm:block">
            Training<span className="text-emerald-500">Track</span>
          </span>
        </div>
      </div>
    </header>
  );
}
