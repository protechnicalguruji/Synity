import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Custom logger to inform developers on console
if (!isSupabaseConfigured) {
  console.info(
    "Synity System: Supabase environment variables are missing. Running in high-fidelity Auth Demo Mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your settings to enable full cloud synchronization."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
