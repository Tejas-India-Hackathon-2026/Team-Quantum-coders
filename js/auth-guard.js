/**
 * LifeProof - Dashboard Authentication & Role Guard
 * Enforces Firebase Authentication, populates user profile data into the dashboard UI,
 * and connects the Logout button.
 */

import { 
  auth, 
  onAuthStateChanged, 
  signOut 
} from './firebase.js';

/**
 * Initializes authentication guard for a specific dashboard
 * @param {string} requiredRole - 'student' | 'recruiter' | 'faculty'
 */
export function initDashboardAuthGuard(requiredRole) {
  const roleRedirects = {
    student: 'student.html',
    recruiter: 'recruiter.html',
    faculty: 'faculty.html'
  };

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn('[LifeProof Guard] No active Firebase Auth session.');
      return;
    }

    try {
      console.info(`[LifeProof Guard] User authenticated: ${user.email} (UID: ${user.uid})`);
      renderUserProfileUI(user);
    } catch (error) {
      console.error('[LifeProof Guard] Error displaying user profile:', error);
    }
  });

  // Attach Logout button event
  initLogoutHandler();
}

/**
 * Renders user profile information in the dashboard
 */
function renderUserProfileUI(user) {
  const nameElements = document.querySelectorAll('.auth-user-name');
  const emailElements = document.querySelectorAll('.auth-user-email');
  const uidElements = document.querySelectorAll('.auth-user-uid');
  const avatarElements = document.querySelectorAll('.auth-user-avatar');

  const displayName = user.displayName || user.email.split('@')[0] || 'LifeProof User';
  const email = user.email || '';
  const photoURL = user.photoURL || '';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'LP';

  nameElements.forEach(el => { el.textContent = displayName; });
  emailElements.forEach(el => { el.textContent = email; });
  uidElements.forEach(el => { el.textContent = user.uid; });

  avatarElements.forEach(el => {
    if (photoURL && el.tagName === 'IMG') {
      el.src = photoURL;
    } else if (photoURL && el.style) {
      el.style.backgroundImage = `url('${photoURL}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    } else {
      el.textContent = initials;
    }
  });
}

/**
 * Attaches sign-out action to logout buttons
 */
function initLogoutHandler() {
  const logoutButtons = document.querySelectorAll('.btn-logout, #logoutBtn, #navLogoutBtn');

  logoutButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        btn.textContent = 'Signing out...';
        await signOut(auth);
        window.location.replace('../login.html');
      } catch (error) {
        alert('Error signing out. Please try again.');
        btn.textContent = 'Sign Out';
      }
    });
  });
}
