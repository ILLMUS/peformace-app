/* ============================
   MODAL UI ONLY
============================ */

// DOM elements
const loginModal = document.getElementById('loginModal');
const modalEmail = document.getElementById('modalEmail');
const modalPassword = document.getElementById('modalPassword');
const modalLoginBtn = document.getElementById('modalLoginBtn');
const modalSignupBtn = document.getElementById('modalSignupBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalMsg = document.getElementById('modalMsg');

const authButtons = document.getElementById('authButtons');
const loginHeaderBtn = document.getElementById('loginHeaderBtn');
const signupHeaderBtn = document.getElementById('signupHeaderBtn');

let modalAuthType = 'login';

/* ============================
   SHOW / HIDE MODAL
============================ */
function showModal(type = 'login') {
  modalAuthType = type;
  loginModal.style.display = 'flex';
  modalMsg.textContent = '';
  modalMsg.style.color = 'rgb(199, 224, 199)';
  modalEmail.value = '';
  modalPassword.value = '';
}

function hideModal() {
  loginModal.style.display = 'none';
}

/* ============================
   BUTTON WIRING (UI ONLY)
============================ */
loginHeaderBtn.onclick = () => showModal('login');
signupHeaderBtn.onclick = () => showModal('signup');
modalCloseBtn.onclick = hideModal;

// These only delegate — logic lives elsewhere
modalLoginBtn.onclick = () => handleAuth('login');
modalSignupBtn.onclick = () => handleAuth('signup');
