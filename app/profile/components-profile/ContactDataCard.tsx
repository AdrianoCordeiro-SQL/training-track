import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Phone } from "lucide-react";
import { UserMetadata, ContactFormInputs } from "@/hooks/useProfile";

export function ContactDataCard({
  metadata,
  isEditing,
  setIsEditing,
  onSave,
}: {
  metadata: UserMetadata;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  onSave: (d: ContactFormInputs) => Promise<boolean>;
}) {
  const form = useForm<ContactFormInputs>({
    defaultValues: {
      phone: metadata.phone || "",
      address: metadata.address || "",
    },
  });

  useEffect(() => {
    form.reset({
      phone: metadata.phone || "",
      address: metadata.address || "",
    });
  }, [metadata, form]);

  const handleSubmit = async (data: ContactFormInputs) => {
    const success = await onSave(data);
    if (success) setIsEditing(false);
  };

  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-5 flex flex-col justify-start">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-semibold text-zinc-100">
            Informações de Contato
          </h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
          >
            Editar
          </button>
        )}
      </div>
      {isEditing ? (
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-500 mb-1">
              Telefone
            </label>
            <input
              type="text"
              {...form.register("phone", {
                required: "O telefone é obrigatório",
              })}
              className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500 text-zinc-100"
            />
            {form.formState.errors.phone && (
              <span className="text-red-500 text-xs mt-1 block">
                {form.formState.errors.phone.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-500 mb-1">
              Endereço
            </label>
            <input
              type="text"
              {...form.register("address", {
                required: "O endereço é obrigatório",
              })}
              className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-emerald-500 text-zinc-100"
            />
            {form.formState.errors.address && (
              <span className="text-red-500 text-xs mt-1 block">
                {form.formState.errors.address.message}
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
  );
}
