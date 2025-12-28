/* ============================
   MERGE LOCAL TRADES TO CLOUD
============================ */
async function mergeLocalToCloud(){
  if (hasMerged) return;
  if (!currentUser) return;

  hasMerged = true;

  const localTrades = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  if (!localTrades.length) return;

  const uploads = localTrades.map(t => ({
    ...t,
    user_id: currentUser.id
  }));

  const { error } = await window.supabase
    .from('trades')
    .upsert(uploads);

  if (error) {
    console.error('MERGE ERROR:', error);
  } else {
    console.log('Local trades merged to cloud');
  }
}
