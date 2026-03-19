import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

export interface ContactFormInputs {
  phone: string;
  address: string;
}

export interface PasswordFormInputs {
  oldPassword: string;
  newPassword: string;
}

export type StatusMessage = { type: "success" | "error"; text: string } | null;

export function useProfile() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [metadata, setMetadata] = useState<UserMetadata>({});
  const [initials, setInitials] = useState("U");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
        const userMeta = user.user_metadata as UserMetadata;
        setMetadata(userMeta || {});

        if (userMeta?.first_name) {
          const init = userMeta.first_name.charAt(0) + (userMeta.last_name ? userMeta.last_name.charAt(0) : "");
          setInitials(init.toUpperCase());
        } else if (user.email) {
          setInitials(user.email.charAt(0).toUpperCase());
        }
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    if (type === "success") {
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploadingAvatar(true);
      setStatusMessage(null);

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`;

      if (file.size > 2 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 2MB.");
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new Error("Apenas arquivos JPG, PNG ou WebP são permitidos.");
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setMetadata(updateData.user.user_metadata as UserMetadata);
      showMessage("success", "Foto de perfil atualizada!");
    } catch (error) {
      showMessage("error", error instanceof Error ? error.message : "Erro ao subir imagem.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const updateContact = async (data: ContactFormInputs) => {
    setStatusMessage(null);
    const { data: updateData, error } = await supabase.auth.updateUser({
      data: { phone: data.phone, address: data.address },
    });
    if (error) {
      showMessage("error", "Erro ao atualizar contato: " + error.message);
      return false;
    }
    setMetadata(updateData.user.user_metadata as UserMetadata);
    showMessage("success", "Informações de contato atualizadas!");
    return true;
  };

  const updatePassword = async (data: PasswordFormInputs) => {
    setStatusMessage(null);
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email, password: data.oldPassword });
    if (verifyError) {
      showMessage("error", "A senha atual está incorreta.");
      return false;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: data.newPassword });
    if (updateError) {
      showMessage("error", "Erro ao atualizar senha: " + updateError.message);
      return false;
    }
    showMessage("success", "Senha alterada com sucesso!");
    return true;
  };

  return {
    loading, email, metadata, initials, uploadingAvatar, statusMessage,
    uploadAvatar, updateContact, updatePassword
  };
}