const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. API calls will fail until configured.');
}

const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', serviceRoleKey || 'placeholder');
const supabaseAnon = createClient(supabaseUrl || 'https://placeholder.supabase.co', anonKey || 'placeholder');

module.exports = { supabaseAdmin, supabaseAnon };
