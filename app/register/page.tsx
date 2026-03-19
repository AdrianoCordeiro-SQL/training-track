"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useRegister, RegisterData } from "@/hooks/useRegister";

export default function RegisterPage() {
  const { registerUser, isLoading, authError } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    await registerUser(data);
  };

  return (
    // Adicionado py-8 e overflow para caso a tela do celular seja pequena e o formulário cresça
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 py-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative z-10 backdrop-blur-sm max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-inner mb-4">
            <UserPlus className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Criar Conta
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Junte-se ao TrainingTrack hoje.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Grid para Nome e Sobrenome lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Nome
              </label>
              <input
                type="text"
                placeholder="João"
                {...register("firstName", { required: true })}
                className="w-full bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600"
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1 block">
                  Obrigatório
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Sobrenome
              </label>
              <input
                type="text"
                placeholder="Silva"
                {...register("lastName", { required: true })}
                className="w-full bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600"
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs mt-1 block">
                  Obrigatório
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Telefone
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              {...register("phone", { required: true })}
              className="w-full bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1 block">
                O telefone é obrigatório
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Endereço Completo
            </label>
            <input
              type="text"
              placeholder="Rua, Número, Bairro, Cidade"
              {...register("address", { required: true })}
              className="w-full bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600"
            />
            {errors.address && (
              <span className="text-red-500 text-xs mt-1 block">
                O endereço é obrigatório
              </span>
            )}
          </div>
          <div className="h-px bg-zinc-800/50 w-full my-2" />
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
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              placeholder="Ex: TReino@2026"
              {...register("password", {
                required: "A senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
                validate: {
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value || "") ||
                    "Deve conter pelo menos uma letra maiúscula",
                  hasNumber: (value) =>
                    /[0-9]/.test(value || "") ||
                    "Deve conter pelo menos um número",
                  hasSpecialChar: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value || "") ||
                    "Deve conter pelo menos um símbolo (ex: @, #, !)",
                },
              })}
              className="w-full bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-100 placeholder:text-zinc-600"
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>
          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {authError}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20 mt-4"
          >
            {isLoading ? "A preparar os halteres..." : "Cadastrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
          >
            Faça login
          </Link>
        </div>
      </div>
    </main>
  );
}
