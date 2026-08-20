/**
 * LifeProof - Universal Navbar Authentication & Session Synchronizer
 * Automatically detects Firebase Auth state and updates Navbar across all pages with user avatar, name, dashboard link, and logout.
 */

import { 
  auth, 
  onAuthStateChanged, 
  signOut,
  getUserProfile 
} from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbarAuthSync();
});

/**
 * Initializes real-time Firebase Auth listener to update Navbar UI
 */
export function initNavbarAuthSync() {
  const navActionsContainer = document.querySelector('.nav-actions');
  if (!navActionsContainer) return;

  const isInsidePagesDir = window.location.pathname.includes('/pages/');
  const rootPrefix = isInsidePagesDir ? '../' : '';

  onAuthStateChanged(auth, async (user) => {
    // Preserve mobile menu toggle button if present
    const mobileBtn = navActionsContainer.querySelector('.mobile-menu-btn');
    const mobileBtnClone = mobileBtn ? mobileBtn.cloneNode(true) : null;

    let activeUser = user;
    let profile = null;

    if (!activeUser) {
      const savedSession = sessionStorage.getItem('lp_active_session');
      if (savedSession) {
        try {
          activeUser = JSON.parse(savedSession);
          profile = activeUser;
        } catch (e) {}
      }
    }

    if (activeUser) {
      // User is LOGGED IN
      let role = activeUser.role || 'student';
      if (activeUser.uid && !profile) {
        try {
          profile = await getUserProfile(activeUser.uid);
          if (profile && profile.role) {
            role = profile.role;
          }
        } catch (err) {
          console.warn('Navbar could not fetch Firestore role:', err);
        }
      }

      const displayName = (profile && profile.name) || activeUser.displayName || activeUser.name || (activeUser.email ? activeUser.email.split('@')[0] : 'Member');
      const photoURL = (profile && profile.photoURL) || activeUser.photoURL || '';
      const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'LP';

      // Dashboard Route
      let dashboardUrl = `${rootPrefix}pages/${role}.html`;

      // Check if avatar photo URL exists
      const avatarContent = photoURL 
        ? `<img src="${photoURL}" alt="${displayName}" class="nav-user-avatar-img" referrerpolicy="no-referrer" />`
        : `<div class="nav-user-avatar-img">${initials}</div>`;

      navActionsContainer.innerHTML = `
        <div class="nav-auth-user-widget" id="navAuthUserWidget">
          <a href="${dashboardUrl}" class="nav-user-pill" title="Open Your Dashboard">
            ${avatarContent}
            <div class="nav-user-meta">
              <span class="nav-user-display-name">${escapeHtml(displayName)}</span>
              <span class="nav-user-role-badge">${role}</span>
            </div>
          </a>
          <button type="button" class="btn-nav-logout" id="headerNavLogoutBtn" title="Sign out of LifeProof">
            <span>Sign Out</span>
          </button>
        </div>
      `;

      if (mobileBtnClone) {
        navActionsContainer.appendChild(mobileBtnClone);
        rebindMobileMenu(mobileBtnClone);
      }

      // Bind Logout Button
      const logoutBtn = document.getElementById('headerNavLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          try {
            logoutBtn.innerHTML = '<span>Exiting...</span>';
            sessionStorage.removeItem('lp_active_session');
            sessionStorage.removeItem('lp_user_role');
            try { await signOut(auth); } catch (e) {}
            window.location.href = `${rootPrefix}index.html`;
          } catch (error) {
            console.error('Logout error:', error);
            window.location.reload();
          }
        });
      }

    } else {
      // User is NOT LOGGED IN
      const loginUrl = `${rootPrefix}login.html`;
      navActionsContainer.innerHTML = `
        <a href="${loginUrl}" class="btn btn-primary btn-sm" id="headerLoginBtn">Login</a>
      `;

      if (mobileBtnClone) {
        navActionsContainer.appendChild(mobileBtnClone);
        rebindMobileMenu(mobileBtnClone);
      }
    }
  });
}

function rebindMobileMenu(btn) {
  const navMenu = document.getElementById('navMenu');
  if (!btn || !navMenu) return;
  btn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-active');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.innerHTML = isOpen ? '✕' : '☰';
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
