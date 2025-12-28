
/* ============================
   LOAD TRADES
============================ */
async function loadTrades() {
  if(!currentUser) return;
  const { data, error } = await window.supabase.from('trades').select('*').eq('user_id', currentUser.id);
  if(error){ console.error(error); return; }
  trades = data;
  render();
}