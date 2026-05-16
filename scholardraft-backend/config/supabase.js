const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseUrl !== 'your-supabase-url' && supabaseKey && supabaseKey !== 'your-supabase-anon-key') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error.message);
  }
} else {
  console.log("Supabase initialization skipped. Please provide valid SUPABASE_URL and SUPABASE_ANON_KEY in .env.");
}

module.exports = { supabase };
