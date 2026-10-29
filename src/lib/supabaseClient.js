import { createClient } from '@supabase/supabase-js';

// Ambil credentials dari .env jika tersedia
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
