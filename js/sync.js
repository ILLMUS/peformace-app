/*async function syncLocalTradesToSupabase() {
  if (!currentUser) return;

  const localTrades = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  if (!localTrades.length) return;

  const payload = localTrades.map(t => ({
    date: t.date,
    pair: t.pair,
    side: t.side,
    lots: Number(t.lots),
    points: Number(t.points),
    result: Number(t.result),
    atr: t.atr || null,
    notes: t.notes || null,
    user_id: currentUser.id,
    created_at: t.time
  }));

  const { error } = await window.supabase
    .from('trades')
    .insert(payload);

  if (error) {
    console.error('SUPABASE SYNC ERROR:', error);
    return;
  }

  console.log('Supabase sync success:', payload.length);

  // clear only AFTER success
  localStorage.removeItem(LS_KEY);
}
*/