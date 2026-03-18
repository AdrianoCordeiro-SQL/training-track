import { createBrowserClient } from '@supabase/ssr';

// Usamos o createBrowserClient do pacote SSR para que a sessão seja guardada em Cookies automaticamente
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);