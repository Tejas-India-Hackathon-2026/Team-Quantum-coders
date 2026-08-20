import { createClient } from "@supabase/supabase-js";

// Retrieve environment variables with safe defaults for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Base Supabase client for authentication and database queries.
 * Ready for future backend integration.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to check if actual Supabase credentials have been configured.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
}
