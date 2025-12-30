/* ============================
   AUTH STATE CHANGE
============================ */
window.supabase.auth.onAuthStateChange(async (_event, session) => {
  currentUser = session?.user || null;
  updateAuthUI();
  if (currentUser) await mergeLocalToCloud();
});


window.supabase.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user ?? null;
  console.log('AUTH:', currentUser);
});





async function testInsert() {
  if (!currentUser) {
    console.warn('Insert blocked: no authenticated user');
    return;
  }

  const { data, error } = await window.supabase
    .from('trades')
    .insert({
      pair: 'US100',
      side: 'BUY',
      lots: 0.01,
      points: 10,
      result: 5,
      user_id: currentUser.id
    });

  console.log('INSERT TEST:', data, error);
}


/* ============================
   APP INIT
============================ */
(async function initApp(){

  render();
})();