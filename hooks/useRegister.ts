import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export interface RegisterData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  email?: string;
  password?: string;
}

export function useRegister() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (data: RegisterData) => {
    setIsLoading(true);
    setAuthError(null);

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email!,
      password: data.password!,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          address: data.address,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (authData.user) {
      console.log("Usuário criado com sucesso:", authData.user);
      router.push("/");
    }
  };

  return { registerUser, isLoading, authError };
}