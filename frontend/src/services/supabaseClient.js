import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't throw — the app should still run (e.g. during local dev before
  // Supabase is configured), it just won't be able to log in or persist.
  console.warn(
    "Supabase env vars are missing. Login and saved history won't work until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in frontend/.env."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");