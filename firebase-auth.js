import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCuLlvqTZjKi-h7HKOEjL3nHnLWwEraOLI",
  authDomain: "carousel-2a740.firebaseapp.com",
  projectId: "carousel-2a740",
  storageBucket: "carousel-2a740.firebasestorage.app",
  messagingSenderId: "814805521732",
  appId: "1:814805521732:web:af814890ca6c95f6ad7311",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── Auth state ──────────────────────────────────────────────────────────────

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  updateAuthUI(user);
  handleGate(user);
});

function updateAuthUI(user) {
  const btn = document.getElementById('auth-btn');
  const userLabel = document.getElementById('auth-user');
  if (!btn) return;

  if (user) {
    btn.textContent = 'Sign out';
    btn.onclick = () => signOut(auth);
    if (userLabel) {
      userLabel.textContent = user.displayName || user.email || '';
    }
  } else {
    btn.textContent = 'Sign in';
    btn.onclick = () => signInWithPopup(auth, new GoogleAuthProvider()).catch(console.error);
    if (userLabel) userLabel.textContent = '';
  }
}

// ── Gate ────────────────────────────────────────────────────────────────────

function handleGate(user) {
  const gated = document.body.dataset.gated === 'true';
  if (!gated) return;

  const overlay = document.getElementById('gate-overlay');
  if (!overlay) return;

  if (!user) {
    overlay.classList.add('active');
    const gateBtn = document.getElementById('gate-sign-in-btn');
    if (gateBtn) {
      gateBtn.onclick = () =>
        signInWithPopup(auth, new GoogleAuthProvider()).catch(console.error);
    }
  } else {
    overlay.classList.remove('active');
  }
}

// ── Random question ─────────────────────────────────────────────────────────

window.goRandom = function (btn) {
  const open = JSON.parse(btn.dataset.openUrls || '[]');
  const all  = JSON.parse(btn.dataset.allUrls  || '[]');
  const pool = currentUser ? all : open;
  if (!pool.length) return;
  const url = pool[Math.floor(Math.random() * pool.length)];
  window.location.href = url;
};
