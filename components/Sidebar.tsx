"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Home, User, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");
  const [userInitials, setUserInitials] = useState("U");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";
        const avatar = user.user_metadata?.avatar_url || null;

        if (firstName) {
          setUserName(`${firstName} ${lastName}`);
          setUserInitials(
            firstName.charAt(0) + (lastName ? lastName.charAt(0) : ""),
          );
        } else if (user.email) {
          setUserName(user.email.split("@")[0]);
          setUserInitials(user.email.charAt(0).toUpperCase());
        }
        setAvatarUrl(avatar);
      }
    };
    getUser();
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed z-50 bg-zinc-950/95 backdrop-blur-md border-zinc-800 transition-all duration-300 shadow-2xl bottom-0 left-0 right-0 h-16 border-t flex flex-row items-center justify-evenly md:top-0 md:bottom-auto md:right-auto md:h-screen md:w-20 md:hover:w-64 md:flex-col md:border-r md:border-t-0 md:justify-between group overflow-hidden">
      {/* Topo: Logo / Avatar */}
      <div className="hidden md:flex h-20 w-full items-center border-b border-zinc-800/50 shrink-0">
        <div className="w-20 h-20 flex items-center justify-center shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-zinc-950 shadow-inner overflow-hidden border-2 border-zinc-800">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              userInitials
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
          <span className="text-sm font-bold text-zinc-100 whitespace-nowrap">
            Training Track
          </span>
          <span className="text-xs font-medium text-emerald-500 whitespace-nowrap">
            {userName}
          </span>
        </div>
      </div>

      {/* Meio: Navegação */}
      <nav className="flex flex-row md:flex-col flex-1 w-full items-center md:items-stretch justify-evenly md:justify-start md:p-4 md:space-y-2">
        <Link
          href="/"
          className={`flex items-center w-12 md:w-full h-12 rounded-xl transition-colors overflow-hidden ${
            pathname === "/"
              ? "text-emerald-500 bg-zinc-800/40"
              : "text-zinc-400 hover:text-emerald-500 hover:bg-zinc-800/80"
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            {/* Ícone limpo aqui 👇 */}
            <Home className="w-6 h-6" />
          </div>
          <div className="hidden md:block flex-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="whitespace-nowrap font-medium pl-2">Início</span>
          </div>
        </Link>

        <Link
          href="/profile"
          className={`flex items-center w-12 md:w-full h-12 rounded-xl transition-colors overflow-hidden ${
            pathname === "/profile"
              ? "text-emerald-500 bg-zinc-800/40"
              : "text-zinc-400 hover:text-emerald-500 hover:bg-zinc-800/80"
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            {/* Ícone limpo aqui 👇 */}
            <User className="w-6 h-6" />
          </div>
          <div className="hidden md:block flex-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="whitespace-nowrap font-medium pl-2">Perfil</span>
          </div>
        </Link>

        {/* Botão Sair - Mobile */}
        <button
          onClick={handleLogout}
          className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      {/* Fundo: Logout - Desktop */}
      <div className="hidden md:block w-full shrink-0 border-t border-zinc-800/50 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full h-12 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-colors overflow-hidden"
        >
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            {/* Ícone limpo aqui 👇 */}
            <LogOut className="w-6 h-6" />
          </div>
          <div className="flex-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
            <span className="whitespace-nowrap font-medium pl-2">Sair</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
