
/* ============================
   UPDATE HEADER UI
============================ */
function updateAuthUI() {
  const userBar = document.getElementById('userBar');
  const userEmail = document.getElementById('userEmail');

  if (currentUser) {
    authButtons.style.display = 'none';
    if(userBar) userBar.style.display = 'flex';
    if(userEmail) userEmail.textContent = currentUser.email;
  } else {
    authButtons.style.display = 'flex';
    if(userBar) userBar.style.display = 'none';
    if(userEmail) userEmail.textContent = '';
  }
}
