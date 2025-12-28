/* ============================
   SESSION RESTORE
============================ */
async function restoreSession() {
  const { data } = await window.supabase.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthUI();
  if(currentUser) await mergeLocalToCloud();
}
window.supabase.auth.onAuthStateChange(async (_event, session)=>{
  currentUser = session?.user || null;
  updateAuthUI();

  if(currentUser){
    await mergeLocalToCloud();
    await loadTrades();
  }
});
