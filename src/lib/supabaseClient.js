import { createClient } from '@supabase/supabase-js';

// Credentials Supabase Cloud
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://bvibqplnbjthrddbggzg.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_M2Wn82MZHXfFw3Ri_K9xCQ_0txpzPaD';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
