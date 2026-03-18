"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabase";

// Tipagens
interface UserMetadata {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

interface ContactFormInputs {
  phone: string;
  address: string;
}

interface PasswordFormInputs {
  oldPassword: string;
  newPassword: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [metadata, setMetadata] = useState<UserMetadata>({});
  const [initials, setInitials] = useState("U");

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const contactForm = useForm<ContactFormInputs>();
  const passwordForm = useForm<PasswordFormInputs>();

  useEffect(() => {
    async function getUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
        const userMeta = user.user_metadata as UserMetadata;
        setMetadata(userMeta || {});

        // Preenche o formulário de contato com os dados atuais
        contactForm.reset({
          phone: userMeta?.phone || "",
          address: userMeta?.address || "",
        });

        if (userMeta?.first_name) {
          const init =
            userMeta.first_name.charAt(0) +
            (userMeta.last_name ? userMeta.last_name.charAt(0) : "");
          setInitials(init.toUpperCase());
        } else if (user.email) {
          setInitials(user.email.charAt(0).toUpperCase());
        }
      }
      setLoading(false);
    }
    getUserData();
  }, [contactForm]);

  // Função para atualizar Contato
  const onSubmitContact = async (data: ContactFormInputs) => {
    setStatusMessage(null);

    // Atualiza os metadados no Supabase
    const { data: updateData, error } = await supabase.auth.updateUser({
      data: {
        phone: data.phone,
        address: data.address,
      },
    });

    if (error) {
      setStatusMessage({
        type: "error",
        text: "Erro ao atualizar contato: " + error.message,
      });
      return;
    }

    // Atualiza o estado local para refletir a mudança instantaneamente
    setMetadata(updateData.user.user_metadata as UserMetadata);
    setIsEditingContact(false);
    setStatusMessage({
      type: "success",
      text: "Informações de contato atualizadas!",
    });

    // Limpa a mensagem de sucesso após 3 segundos
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Função para atualizar Senha
  const onSubmitPassword = async (data: PasswordFormInputs) => {
    setStatusMessage(null);

    // 1. Verificamos se a senha atual está correta tentando fazer login com ela
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: email, // Usamos o email que já está salvo no state da página
      password: data.oldPassword,
    });

    if (verifyError) {
      setStatusMessage({
        type: "error",
        text: "A senha atual está incorreta.",
      });
      return;
    }

    // 2. Se a senha atual estiver certa, atualizamos para a nova senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (updateError) {
      setStatusMessage({
        type: "error",
        text: "Erro ao atualizar senha: " + updateError.message,
      });
      return;
    }

    setIsEditingPassword(false);
    passwordForm.reset(); // Limpa os campos
    setStatusMessage({ type: "success", text: "Senha alterada com sucesso!" });

    setTimeout(() => setStatusMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        A carregar os seus dados...
      </div>
    );
  }

  return (
    <main className="w-full p-4 md:p-8 relative">
      {/* Toast de Feedback (Mensagens de sucesso ou erro flutuantes no topo) */}
      {statusMessage && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-medium shadow-xl transition-all animate-in slide-in-from-top-4 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
              : "bg-red-500/20 text-red-400 border border-red-500/50"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <header className="mb-10 mt-4 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-4xl font-extrabold text-zinc-950 shadow-2xl shrink-0 border-4 border-zinc-800">
          {initials}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tighter">
            {metadata.first_name
              ? `${metadata.first_name} ${metadata.last_name}`
              : "Meu Perfil"}
          </h1>
          <p className="text-zinc-400 mt-1.5 text-lg">
            Gira as tuas informações e credenciais.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {/* CARD: DADOS DA CONTA (SENHA E EMAIL) */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-5 flex flex-col justify-start">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-6 h-6 text-emerald-500"
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
            <h2 className="text-xl font-semibold text-zinc-100">
              Dados da Conta
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-500">
              Endereço de E-mail
            </label>
            <p className="text-zinc-100 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
              {email}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-500">Senha</label>
              {!isEditingPassword && (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="text-sm text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                >
                  Alterar
                </button>
              )}
            </div>

            {isEditingPassword ? (
              <form
                onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                className="space-y-4 mt-2 animate-in fade-in slide-in-from-top-2"
              >
                {/* Input da Senha Antiga */}
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    placeholder="Sua senha atual"
                    {...passwordForm.register("oldPassword", {
                      required: "A senha atual é obrigatória",
                    })}
                    className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500 text-zinc-100"
                  />
                  {passwordForm.formState.errors.oldPassword && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {passwordForm.formState.errors.oldPassword.message}
                    </span>
                  )}
                </div>

                {/* Input da Nova Senha */}
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    placeholder="Nova senha"
                    {...passwordForm.register("newPassword", {
                      required: "A nova senha é obrigatória",
                      minLength: { value: 6, message: "Mínimo 6 caracteres" },
                      validate: {
                        hasUpperCase: (v) =>
                          /[A-Z]/.test(v || "") || "Falta letra maiúscula",
                        hasNumber: (v) =>
                          /[0-9]/.test(v || "") || "Falta um número",
                        hasSpecialChar: (v) =>
                          /[!@#$%^&*(),.?":{}|<>]/.test(v || "") ||
                          "Falta um símbolo",
                      },
                    })}
                    className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500 text-zinc-100"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {passwordForm.formState.errors.newPassword.message}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingPassword(false);
                      passwordForm.reset();
                    }}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    Salvar Nova Senha
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                <p className="text-zinc-100">•••••••••••••••</p>
              </div>
            )}
          </div>
        </div>

        {/* CARD: INFORMAÇÕES DE CONTATO */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-5 flex flex-col justify-start">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-zinc-100">
                Informações de Contato
              </h2>
            </div>
            {!isEditingContact && (
              <button
                onClick={() => setIsEditingContact(true)}
                className="text-sm text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
              >
                Editar
              </button>
            )}
          </div>

          {isEditingContact ? (
            <form
              onSubmit={contactForm.handleSubmit(onSubmitContact)}
              className="space-y-4 animate-in fade-in slide-in-from-top-2"
            >
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  {...contactForm.register("phone", {
                    required: "O telefone é obrigatório",
                  })}
                  className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500 text-zinc-100"
                />
                {contactForm.formState.errors.phone && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {contactForm.formState.errors.phone.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  {...contactForm.register("address", {
                    required: "O endereço é obrigatório",
                  })}
                  className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500 text-zinc-100"
                />
                {contactForm.formState.errors.address && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {contactForm.formState.errors.address.message}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingContact(false);
                    contactForm.reset();
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-500">
                  Número de Telefone
                </label>
                <p className="text-zinc-100 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                  {metadata.phone || "Não informado"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-500">
                  Endereço Residencial
                </label>
                <p className="text-zinc-100 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50 leading-relaxed">
                  {metadata.address || "Não informado"}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
