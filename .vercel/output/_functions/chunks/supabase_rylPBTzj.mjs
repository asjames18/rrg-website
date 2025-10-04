import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lebumzszhhjlpflqgity.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYnVtenN6aGhqbHBmbHFnaXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTk5NjgsImV4cCI6MjA3NTA3NTk2OH0.2XeY7OXkEfXiG_qwlSRN5rNE2gbZde42v4KfTrmctSs";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export { supabase as s };
