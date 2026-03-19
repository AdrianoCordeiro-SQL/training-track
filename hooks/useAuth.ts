import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Usuário");
  const [userInitials, setUserInitials] = useState("U");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";
        const avatar = user.user_metadata?.avatar_url || null;

        if (firstName) {
          setUserName(`${firstName} ${lastName}`);
          setUserInitials(firstName.charAt(0) + (lastName ? lastName.charAt(0) : ""));
        } else if (user.email) {
          setUserName(user.email.split("@")[0]);
          setUserInitials(user.email.charAt(0).toUpperCase());
        }
        setAvatarUrl(avatar);
      }
    };
    getUser();
  }, [pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return { userName, userInitials, avatarUrl, logout };
}