import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Clean and sanitize Supabase URL to prevent path errors (e.g. "Invalid path specified in request URL")
const sanitizeUrl = (url: string): string => {
  if (!url) return "";
  let clean = url.trim();
  // Remove trailing slashes
  while (clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  // Remove trailing API path suffixes if accidentally appended by users
  if (clean.endsWith("/rest/v1")) {
    clean = clean.slice(0, -8);
  }
  if (clean.endsWith("/auth/v1")) {
    clean = clean.slice(0, -8);
  }
  while (clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  // Ensure it starts with proper protocol
  if (clean && !clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = "https://" + clean;
  }
  return clean;
};

const supabaseUrl = sanitizeUrl(rawUrl);

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
