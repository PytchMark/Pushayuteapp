require('dotenv').config();
const { supabaseAdmin } = require('../services/supabase');

(async function seed() {
  const { count } = await supabaseAdmin.from('influencers').select('*', { count: 'exact', head: true });
  if (count > 0) return console.log('Seed skipped: influencers table not empty');
  console.log('Use server startup seed logic; table empty and ready.');
})();
