/* ============================
   LOGIN / SIGNUP LOGIC
============================ */

async function handleAuth(type) {
  const email = modalEmail.value.trim();
  const password = modalPassword.value.trim();

  if (!email || !password) {
    modalMsg.textContent = 'Email and password are required!';
    modalMsg.style.color = 'red';
    return;
  }

  modalMsg.textContent = type === 'login' ? 'Logging in…' : 'Signing up…';
  modalMsg.style.color = 'rgb(199, 224, 199)';

  if (type === 'login') {
    const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      modalMsg.textContent = error.message;
      modalMsg.style.color = 'red';
      return;
    }

    currentUser = data.user;
    hideModal();
    updateAuthUI();
    await mergeLocalToCloud();
    await loadTrades();

  } else {
    const { error } = await window.supabase.auth.signUp({ email, password });

    if (error) {
      modalMsg.textContent = error.message;
      modalMsg.style.color = 'red';
      return;
    }

    modalMsg.textContent = 'Check your email to confirm your account.';
    modalMsg.style.color = 'green';
  }
}

/* ============================
   LOGOUT
============================ */
async function logout() {
  try {
    await window.supabase.auth.signOut(); // Ends the Supabase session
    currentUser = null;                    // Reset the global user
    updateAuthUI();                        // Update buttons & UI
    console.log('Logout successful');
  } catch (err) {
    console.error('Logout error:', err.message);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});



/* ============================
   ADD TRADE LOGIN GUARD
============================ */
document.getElementById('addBtn').addEventListener('click', async () => {
  if (!currentUser) {
    showModal('login');
    return;
  }

  // trade logic already exists elsewhere
});

/* ============================
   AUTH STATE LISTENER
============================ */
window.supabase.auth.onAuthStateChange(async (_event, session) => {
  currentUser = session?.user ?? null;
  updateAuthUI();

  if (currentUser) {
    await mergeLocalToCloud();
    await loadTrades();
  }
});




