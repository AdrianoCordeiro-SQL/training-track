"use client";

import { useState } from "react"; // Importamos o useState para lidar com erros
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link"; // Importamos o Link para o cadastro
import { supabase } from "@/utils/supabase"; // Importamos o nosso cliente do Supabase

// 1. A interface já está certinha aqui fora
interface LoginFormInputs {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();

  // Estados para gerir o feedback para o usuário
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setAuthError(null); // Limpa erros anteriores

    // 2. Chamamos o Supabase para fazer o login
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email!,
      password: data.password!,
    });

    setIsLoading(false);

    // 3. Tratamos possíveis erros (ex: e-mail inválido, senha incorreta)
    if (error) {
      // O Supabase retorna mensagens em inglês, mas nós podemos traduzir
      // ou customizar baseado no erro. Por enquanto, vamos mostrar a do Supabase.
      console.error("Erro de login:", error.message);

      // Mapeamento simples para o usuário
      if (error.message === "Invalid login credentials") {
        setAuthError("E-mail ou senha incorretos.");
      } else {
        setAuthError(error.message);
      }
      return;
    }

    // 4. Se deu tudo certo, redirecionamos para o Dashboard!
    if (authData.user) {
      console.log("Login realizado com sucesso:", authData.user.email);
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans relative overflow-hidden">
      {/* Efeito visual de luz no fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative z-10 backdrop-blur-sm">
        {/* Logo Centralizada */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-inner mb-4">
            {/* Ícone de Haltere */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-emerald-500"
            >
              <path d="M12 21a9.1 9.1 0 0 0-3.3-1.4l.2.8.2.8" />
              <path d="M12 3a9.1 9.1 0 0 0 3.3 1.4l-.2-.8-.2-.8" />
              <rect x="2" y="10" width="8" height="4" rx="1.5" />
              <rect x="14" y="10" width="8" height="4" rx="1.5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Training<span className="text-emerald-500">Track</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Acompanhe a sua evolução real.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              {...register("email", { required: true })}
              className="w-full bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">
                O e-mail é obrigatório
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-zinc-400">
                Senha
              </label>
              <a
                href="#"
                className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: true })}
              className="w-full bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600"
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                A senha é obrigatória
              </span>
            )}
          </div>

          {/* Mensagem de erro vinda do Supabase */}
          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20 mt-2"
          >
            {isLoading ? "Carregando os dados..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Ainda não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </main>
  );
}
