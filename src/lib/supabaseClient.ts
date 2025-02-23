import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing public Supabase environment variables.");
}

// Public client (for client-side use)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side use only)
export const supabaseAdmin =
    typeof window === 'undefined'
        ? createClient(supabaseUrl, supabaseServiceRoleKey)
        : null;
