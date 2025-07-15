import { createClient } from '@supabase/supabase-js'

// Check if required environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using placeholder values.');
}

// Use environment variables or fallback to placeholder values to prevent build errors
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

const supabase = createClient(url, key);

export default supabase