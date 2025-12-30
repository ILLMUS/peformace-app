/* ============================
   MERGE LOCAL TRADES TO CLOUD
============================ */
async function mergeLocalToCloud() {
  if (!currentUser) return;

  const localTrades = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  if (!localTrades.length) return;

  // Build payload strictly matching Supabase schema
  const uploads = localTrades.map(t => ({
    pair: t.pair,
    side: t.side,
    lots: Number(t.lots),
    points: Number(t.points),
    result: Number(t.result ?? 0),
    user_id: currentUser.id
  }));

  const { error } = await window.supabase
    .from('trades')
    .insert(uploads);

  if (error) {
    console.error('MERGE ERROR:', error);
    return;
  }

  console.log('Local trades merged to cloud:', uploads.length);

  // Optional: clear local trades after successful merge
  // localStorage.removeItem(LS_KEY);
}
