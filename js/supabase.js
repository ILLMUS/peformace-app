/* ============================
   SUPABASE INIT
============================ */

// CREATE CLIENT ONCE
const SUPABASE_URL = 'https://iethtasvjadlbgfbeoae.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L2bCsmanDanTLZn0iZruJA_FFULHYpS';

// Attach globally
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

