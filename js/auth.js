/* ============================
   AUTH STATE
============================ */

let currentUser = null;

/* ============================
   AUTH LISTENER (SINGLE SOURCE OF TRUTH)
============================ */
window.supabase.auth.onAuthStateChange(async (_event, session) => {
  currentUser = session?.user ?? null;
  console.log('AUTH:', currentUser);

  updateAuthUI();

  if (!currentUser) return;

  // 1️⃣ sync local trades once after login
  await syncLocalTradesToSupabase();

  // 2️⃣ load trades from Supabase (next step)
  await loadTrades();

  // 3️⃣ render AFTER data exists
  render();
});

/* ============================
   APP INIT
============================ */
(function initApp() {
  // only UI init here — no auth logic
  render();
})();
