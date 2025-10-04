import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lebumzszhhjlpflqgity.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYnVtenN6aGhqbHBmbHFnaXR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ5OTk2OCwiZXhwIjoyMDc1MDc1OTY4fQ.NqwLcjNOP9PuT0gwtRP_26vCIsmeXX0m6z0VQNlbbi0";
const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export { supabaseServer as s };
