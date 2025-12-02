import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABSE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABSE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase env missing", { supabaseUrl, supabaseAnonKey, env: import.meta.env });
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file and restart dev server.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;