import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { PasswordFormInputs } from "@/hooks/useProfile";

export function AccountDataCard({
  email,
  isEditing,
  setIsEditing,
  onSave,
}: {
  email: string;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  onSave: (d: PasswordFormInputs) => Promise<boolean>;
}) {
  const form = useForm<PasswordFormInputs>();

  const handleSubmit = async (data: PasswordFormInputs) => {
    const success = await onSave(data);
    if (success) {
      setIsEditing(false);
      form.reset();
    }
  };

  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-5 flex flex-col justify-start">
      <div className="flex items-center gap-3 mb-2">
        <User className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-semibold text-zinc-100">Dados da Conta</h2>
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
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Alterar
            </button>
          )}
        </div>
        {isEditing ? (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-2 animate-in fade-in slide-in-from-top-2"
          >
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Senha Atual
              </label>
              <input
                type="password"
                placeholder="Sua senha atual"
                {...form.register("oldPassword", {
                  required: "A senha atual é obrigatória",
                })}
                className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500 text-zinc-100"
              />
              {form.formState.errors.oldPassword && (
                <span className="text-red-500 text-xs mt-1 block">
                  {form.formState.errors.oldPassword.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                placeholder="Nova senha"
                {...form.register("newPassword", {
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
              {form.formState.errors.newPassword && (
                <span className="text-red-500 text-xs mt-1 block">
                  {form.formState.errors.newPassword.message}
                </span>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Salvar
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
  );
}
