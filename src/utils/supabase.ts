
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test function to check if tables exist
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};
