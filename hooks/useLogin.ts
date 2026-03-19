import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export function useLogin() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email?: string, password?: string) => {
    if (!email || !password) return;
    
    setIsLoading(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      console.error("Erro de login:", error.message);
      if (error.message === "Invalid login credentials") {
        setAuthError("E-mail ou senha incorretos.");
      } else {
        setAuthError(error.message);
      }
      return;
    }

    if (data.user) {
      router.push("/");
    }
  };

  return { login, isLoading, authError };
}