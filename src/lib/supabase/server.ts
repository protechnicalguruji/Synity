/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// This helper is prepared for full-stack Node.js environments (e.g. Express, Next.js, Cloud Run edge servers).
// In a server environment, the Service Role key should be used strictly behind secure API routes to bypass Row Level Security.
// Do NOT export or use this client on the client-side of your application.

import { createClient } from "@supabase/supabase-js";

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

/**
 * Creates a server-side Supabase Client.
 * Automatically uses SUPABASE_SERVICE_ROLE_KEY from server-side environment variables.
 */
export const createSupabaseServerClient = (serviceRoleKey?: string) => {
  const rawUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "";
  const supabaseUrl = sanitizeUrl(rawUrl);
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
