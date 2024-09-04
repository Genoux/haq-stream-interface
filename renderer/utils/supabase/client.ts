import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
);

if (supabase) {
  console.log('Supabase client created successfully');
}

export { supabase };