/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// This helper is prepared for full-stack Node.js environments (e.g. Express, Next.js, Cloud Run edge servers).
// In a server environment, the Service Role key should be used strictly behind secure API routes to bypass Row Level Security.
// Do NOT export or use this client on the client-side of your application.

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a server-side Supabase Client.
 * Automatically uses SUPABASE_SERVICE_ROLE_KEY from server-side environment variables.
 */
export const createSupabaseServerClient = (serviceRoleKey?: string) => {
  const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "";
  const key = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !key) {
    throw new Error(
      "Server-side Supabase initialization failed. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
  }

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
