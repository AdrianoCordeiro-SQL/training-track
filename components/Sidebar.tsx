"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");
  const [userInitials, setUserInitials] = useState("U");

  // Busca os dados do Supabase ao montar a sidebar
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Pega os metadados que salvamos no cadastro
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";

        if (firstName) {
          setUserName(`${firstName} ${lastName}`);
          setUserInitials(
            firstName.charAt(0) + (lastName ? lastName.charAt(0) : ""),
          );
        } else if (user.email) {
          setUserName(user.email.split("@")[0]);
          setUserInitials(user.email.charAt(0).toUpperCase());
        }
      }
    };
    getUser();
  }, [pathname]);

  // Não renderiza na tela de login ou registro
  if (pathname === "/login" || pathname === "/register") return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen bg-zinc-950/95 backdrop-blur-md border-r border-zinc-800 transition-all duration-300 w-16 hover:w-64 z-50 group flex flex-col overflow-hidden shadow-2xl">
      {/* Topo: Foto do Usuário (Iniciais por enquanto) */}
      <div className="p-4 flex items-center gap-4 border-b border-zinc-800/50 mt-2">
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-zinc-950 shrink-0 shadow-inner">
          {userInitials}
        </div>
        <div className="flex flex-col whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-semibold text-zinc-100 truncate w-40">
            {userName}
          </span>
        </div>
      </div>

      {/* Meio: Navegação */}
      <nav className="flex-1 p-3 space-y-2 mt-2">
        {/* Link Dashboard */}
        <Link
          href="/"
          className="flex items-center gap-4 p-2 rounded-xl hover:bg-zinc-800/80 text-zinc-400 hover:text-emerald-500 transition-colors group/link"
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
            Início
          </span>
        </Link>

        {/* Link Perfil */}
        <Link
          href="/profile"
          className="flex items-center gap-4 p-2 rounded-xl hover:bg-zinc-800/80 text-zinc-400 hover:text-emerald-500 transition-colors group/link"
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
            Perfil
          </span>
        </Link>
      </nav>

      {/* Fundo: Logout */}
      <div className="p-3 border-t border-zinc-800/50 mb-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}
