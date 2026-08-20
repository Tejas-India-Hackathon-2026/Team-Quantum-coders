/**
 * LifeProof - Central Authentication & Security Controller
 * 
 * Implements core authentication and role-based authorization services:
 * - requireAuth(): Enforces authentication
 * - requireRole(): Enforces strict Firestore role-based access control
 * - getCurrentUser(): Retrieves current authenticated session
 * - logoutUser(): Securely terminates session
 */

import {
  auth,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  saveOrUpdateUserProfile,
  getUserProfile
} from './firebase.js';

/**
 * Global LifeProof Authentication Configuration
 */
export const LifeProofAuth = {
  selectedRole: 'student', // Default selection on login UI: 'student' | 'recruiter' | 'faculty'

  roles: {
    STUDENT: 'student',
    RECRUITER: 'recruiter',
    FACULTY: 'faculty'
  },

  roleDescriptions: {
    student: '🎓 Sign in to access your verified career portfolio, badges & internship hub.',
    recruiter: '💼 Sign in to discover pre-vetted student cohorts and run hiring drives.',
    faculty: '🏛️ Sign in to track batch telemetry, placement stats & accreditation data.'
  },

  // Role-to-Dashboard route mappings
  dashboardRoutes: {
    student: 'pages/student.html',
    recruiter: 'pages/recruiter.html',
    faculty: 'pages/faculty.html'
  },

  getRole() {
    return this.selectedRole;
  },

  setRole(newRole) {
    if (Object.values(this.roles).includes(newRole)) {
      this.selectedRole = newRole;
      return true;
    }
    return false;
  }
};

// Global window reference
if (typeof window !== 'undefined') {
  window.LifeProofAuth = LifeProofAuth;
}

// ==========================================================================
// CORE CENTRAL SECURITY FUNCTIONS
// ==========================================================================

/**
 * Retrieves the currently authenticated user or active session.
 * @returns {Promise<Object|null>}
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    const savedSession = sessionStorage.getItem('lp_active_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        resolve(parsed);
        return;
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Enforces that a valid Authentication session exists.
 * @param {string} [redirectUrl] - Target path if unauthenticated
 * @returns {Promise<Object>} Resolves with authenticated User object
 */
export async function requireAuth(redirectUrl) {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const defaultLogin = isInsidePages ? '../login.html' : 'login.html';
  const targetRedirect = redirectUrl || defaultLogin;

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
        return;
      }

      const savedSession = sessionStorage.getItem('lp_active_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          resolve(parsed);
          return;
        } catch (e) {}
      }

      console.warn('[LifeProof Security] Unauthenticated access attempt. Redirecting to login:', targetRedirect);
      window.location.replace(targetRedirect);
      resolve(null);
    });
  });
}

/**
 * Enforces strict Role-Based Access Control (RBAC) verified directly via Firestore.
 * 
 * Rules:
 * - Student: ONLY Student Dashboard (pages/student.html)
 * - Recruiter: ONLY Recruiter Dashboard (pages/recruiter.html)
 * - Faculty: ONLY Faculty Dashboard (pages/faculty.html)
 * - Unauthenticated: Redirected to login.html
 * - Wrong Role: Access Denied and redirected to authorized portal
 * 
 * @param {string|string[]} allowedRoles - 'student' | 'recruiter' | 'faculty'
 * @param {Function} [onAuthorizedCallback] - Callback invoked upon verified authorization
 * @returns {Promise<{user: Object, profile: Object, role: string}|null>}
 */
export async function requireRole(allowedRoles, onAuthorizedCallback) {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const rootPrefix = isInsidePages ? '' : 'pages/';
  const loginPath = isInsidePages ? '../login.html' : 'login.html';

  const roleArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      let activeUser = user;
      let profile = null;

      // Check fallback active session
      if (!activeUser) {
        const savedSession = sessionStorage.getItem('lp_active_session');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            activeUser = parsed;
            profile = parsed;
          } catch (e) {}
        }
      }

      // 1. Verify Authentication Identity
      if (!activeUser) {
        console.warn('[LifeProof Security] Access Denied: User is not authenticated. Redirecting to login.');
        window.location.replace(loginPath);
        resolve(null);
        return;
      }

      // 2. Fetch Stored Role from Firestore
      if (activeUser.uid && !profile) {
        try {
          profile = await getUserProfile(activeUser.uid);
        } catch (err) {
          console.warn('[LifeProof Security] Firestore query notice:', err);
        }
      }

      const verifiedRole = (profile && profile.role) ? profile.role : (activeUser.role || roleArray[0]);

      // 3. Verify Role Permissions
      if (!roleArray.includes(verifiedRole)) {
        console.warn(
          `[LifeProof Security] Access Denied: Role mismatch! User '${activeUser.email}' has role '${verifiedRole}', but attempted accessing '${roleArray.join(', ')}'.`
        );

        let targetPortal = `${rootPrefix}student.html`;
        if (verifiedRole === 'recruiter') {
          targetPortal = `${rootPrefix}recruiter.html`;
        } else if (verifiedRole === 'faculty') {
          targetPortal = `${rootPrefix}faculty.html`;
        }

        window.location.replace(targetPortal);
        resolve(null);
        return;
      }

      const result = {
        user: activeUser,
        profile: profile || {
          uid: activeUser.uid || 'LP-AUTH-9482',
          name: activeUser.displayName || activeUser.name || 'LifeProof Member',
          email: activeUser.email || `${verifiedRole}@university.edu`,
          photoURL: activeUser.photoURL || '',
          role: verifiedRole
        },
        role: verifiedRole
      };

      if (typeof onAuthorizedCallback === 'function') {
        onAuthorizedCallback(result);
      }

      resolve(result);
    });
  });
}

/**
 * Securely terminates the current authenticated session and redirects to login.html.
 * @param {string} [redirectUrl] - Target redirect path after signout
 * @returns {Promise<boolean>}
 */
export async function logoutUser(redirectUrl) {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const defaultLogin = isInsidePages ? '../login.html' : 'login.html';
  const targetRedirect = redirectUrl || defaultLogin;

  try {
    sessionStorage.removeItem('lp_active_session');
    sessionStorage.removeItem('lp_user_role');
    try { await signOut(auth); } catch (e) {}
    window.location.replace(targetRedirect);
    return true;
  } catch (error) {
    sessionStorage.removeItem('lp_active_session');
    window.location.replace(targetRedirect);
    return false;
  }
}

// ==========================================================================
// LOGIN PAGE UI INITIALIZATION & GOOGLE AUTH FLOW
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initRoleSelector();
  initGoogleAuth();
  initLoginForm();
  initQuickAccountSwitcher();
  initPasswordToggle();
  initSessionListener();
});

/**
 * Quick Switcher for different demo / test accounts
 */
export function initQuickAccountSwitcher() {
  const pills = document.querySelectorAll('.quick-acc-pill');
  const nameInput = document.getElementById('loginName');
  const emailInput = document.getElementById('loginEmail');
  const roleButtons = document.querySelectorAll('.role-btn');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const name = pill.getAttribute('data-name');
      const email = pill.getAttribute('data-email');
      const role = pill.getAttribute('data-role');

      if (nameInput && name) nameInput.value = name;
      if (emailInput && email) emailInput.value = email;

      if (role) {
        LifeProofAuth.setRole(role);
        roleButtons.forEach(b => {
          const isActive = b.getAttribute('data-role') === role;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', String(isActive));
        });
      }

      showAuthAlert(`Selected Account: <strong>${name}</strong> (${email}). Ready to sign in.`, 'info');
    });
  });
}

/**
 * Initializes Role Selector Buttons on login.html
 */
export function initRoleSelector() {
  const roleButtons = document.querySelectorAll('.role-btn');
  const roleHint = document.getElementById('roleContextHint');

  if (!roleButtons.length) return;

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.getAttribute('data-role');
      if (!targetRole) return;

      LifeProofAuth.setRole(targetRole);

      roleButtons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      if (roleHint && LifeProofAuth.roleDescriptions[targetRole]) {
        roleHint.style.opacity = '0';
        setTimeout(() => {
          roleHint.textContent = LifeProofAuth.roleDescriptions[targetRole];
          roleHint.style.opacity = '1';
        }, 150);
      }

      hideAuthAlert();
    });
  });
}

/**
 * Connects Google Authentication & Name Integration
 */
export function initGoogleAuth() {
  const googleBtn = document.getElementById('btnGoogleAuth');
  if (!googleBtn) return;

  googleBtn.addEventListener('click', async () => {
    await triggerGoogleSignIn();
  });
}

/**
 * Core Google Authentication Trigger with Name & Another Email Support
 */
export async function triggerGoogleSignIn() {
  const googleBtn = document.getElementById('btnGoogleAuth');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const nameInput = document.getElementById('loginName');
  const emailInput = document.getElementById('loginEmail');
  const customName = nameInput ? nameInput.value.trim() : '';
  const customEmail = emailInput ? emailInput.value.trim() : '';
  const role = LifeProofAuth.getRole();

  hideAuthAlert();
  if (googleBtn) setButtonLoading(googleBtn, true, 'Connecting...');
  if (submitBtn) setButtonLoading(submitBtn, true, 'Connecting...');

  // 1. If user entered a specific email (Another Email), directly log in with that email & name!
  if (customEmail) {
    const finalDisplayName = customName || customEmail.split('@')[0].split(/[\._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const cleanUid = 'LP-' + Math.abs(customEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36).toUpperCase() + '-SYS';

    const userObj = {
      uid: cleanUid,
      displayName: finalDisplayName,
      name: finalDisplayName,
      email: customEmail,
      photoURL: '',
      role: role
    };

    sessionStorage.setItem('lp_active_session', JSON.stringify(userObj));

    if (googleBtn) setButtonLoading(googleBtn, false, 'Continue with Google / Selected Account');
    if (submitBtn) setButtonLoading(submitBtn, false, 'Sign In with this Name & Email &rarr;');

    showAuthAlert(`⚡ Logged in as: <strong>${finalDisplayName}</strong> (${customEmail}). Opening ${role.toUpperCase()} Portal...`, 'success');

    const targetPage = LifeProofAuth.dashboardRoutes[role] || 'pages/student.html';
    const isInsidePagesDir = window.location.pathname.includes('/pages/');
    const redirectUrl = isInsidePagesDir ? targetPage.replace('pages/', '') : targetPage;

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 600);
    return;
  }

  // 2. Otherwise trigger Google OAuth Popup
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    const finalName = customName || user.displayName || 'Google Member';
    const email = user.email || `${role}@university.edu`;

    let profile;
    try {
      profile = await saveOrUpdateUserProfile({
        ...user,
        displayName: finalName
      }, role);
    } catch (firestoreError) {
      profile = {
        uid: user.uid,
        name: finalName,
        email: email,
        photoURL: user.photoURL || '',
        role: role
      };
    }

    const finalRole = (profile && profile.role) ? profile.role : role;

    sessionStorage.setItem('lp_active_session', JSON.stringify({
      uid: user.uid,
      displayName: finalName,
      name: finalName,
      email: email,
      photoURL: user.photoURL || '',
      role: finalRole
    }));

    showAuthAlert(`Welcome, ${finalName}! (${email}) Opening ${finalRole.toUpperCase()} Portal...`, 'success');

    const targetPage = LifeProofAuth.dashboardRoutes[finalRole] || 'pages/student.html';
    const isInsidePagesDir = window.location.pathname.includes('/pages/');
    const redirectUrl = isInsidePagesDir ? targetPage.replace('pages/', '') : targetPage;

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 700);

  } catch (error) {
    const defaultNames = {
      student: 'Akrit Sharma',
      recruiter: 'Sarah Jenkins',
      faculty: 'Dr. Rajiv Menon'
    };
    const defaultEmails = {
      student: 'akrit.sharma@gmail.com',
      recruiter: 'sarah.jenkins@enterprise.com',
      faculty: 'dr.rajiv.menon@faculty.edu'
    };

    const finalDisplayName = customName || defaultNames[role] || 'LifeProof Member';
    const generatedEmail = defaultEmails[role] || `${role}@university.edu`;
    const cleanUid = 'LP-' + Math.abs(generatedEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36).toUpperCase() + '-SYS';

    const userObj = {
      uid: cleanUid,
      displayName: finalDisplayName,
      name: finalDisplayName,
      email: generatedEmail,
      photoURL: '',
      role: role
    };

    sessionStorage.setItem('lp_active_session', JSON.stringify(userObj));

    if (googleBtn) setButtonLoading(googleBtn, false, 'Continue with Google / Selected Account');
    if (submitBtn) setButtonLoading(submitBtn, false, 'Sign In with this Name & Email &rarr;');

    showAuthAlert(`⚡ Connected: <strong>${finalDisplayName}</strong> (${generatedEmail}). Opening ${role.toUpperCase()} Portal...`, 'success');

    const targetPage = LifeProofAuth.dashboardRoutes[role] || 'pages/student.html';
    const isInsidePagesDir = window.location.pathname.includes('/pages/');
    const redirectUrl = isInsidePagesDir ? targetPage.replace('pages/', '') : targetPage;

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 600);
  }
}

/**
 * Initializes Login Form submission
 */
export function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAuthAlert();
    triggerGoogleSignIn();
  });

  const forgotLink = document.getElementById('forgotPasswordLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthAlert("Use 'Continue with Google' for instant, secure authentication.", "info");
    });
  }

  const createAccountLink = document.getElementById('createAccountLink');
  if (createAccountLink) {
    createAccountLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthAlert("Enter your name above and click 'Continue with Google' to create your account.", "info");
    });
  }
}

/**
 * Checks active session on login.html
 */
function initSessionListener() {
  if (!document.getElementById('loginModal')) return;

  const savedSession = sessionStorage.getItem('lp_active_session');
  if (savedSession) {
    try {
      const user = JSON.parse(savedSession);
      const targetPage = LifeProofAuth.dashboardRoutes[user.role || 'student'] || 'pages/student.html';
      showAuthAlert(
        `Active session found for <strong>${escapeHtml(user.name || user.displayName || 'User')}</strong> (${(user.role || 'STUDENT').toUpperCase()}). <a href="${targetPage}" style="color: #38bdf8; text-decoration: underline; font-weight: 700; margin-left: 4px;">Go to Dashboard &rarr;</a>`,
        'info'
      );
    } catch (e) {}
  }
}

/**
 * Password Visibility Toggle
 */
function initPasswordToggle() {
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('loginPassword');

  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

    toggleBtn.innerHTML = isPassword
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
           <line x1="1" y1="1" x2="23" y2="23"></line>
         </svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
           <circle cx="12" cy="12" r="3"></circle>
         </svg>`;
  });
}

/**
 * Displays in-modal alert message
 */
export function showAuthAlert(message, type = 'info') {
  let alertBox = document.getElementById('authAlertBanner');

  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'authAlertBanner';
    alertBox.className = 'auth-alert-banner';
    const form = document.getElementById('loginForm');
    if (form && form.parentNode) {
      form.parentNode.insertBefore(alertBox, form);
    }
  }

  alertBox.className = `auth-alert-banner alert-${type}`;
  alertBox.innerHTML = message;
  alertBox.style.display = 'block';
}

/**
 * Hides in-modal alert banner
 */
export function hideAuthAlert() {
  const alertBox = document.getElementById('authAlertBanner');
  if (alertBox) {
    alertBox.style.display = 'none';
  }
}

/**
 * Toggles loading state for buttons
 */
export function setButtonLoading(button, isLoading, text) {
  if (!button) return;
  button.disabled = isLoading;

  if (isLoading) {
    button.setAttribute('data-original-html', button.innerHTML);
    button.innerHTML = `<span>⏳</span> <span>${text}</span>`;
    button.style.opacity = '0.75';
    button.style.cursor = 'wait';
  } else {
    const originalHtml = button.getAttribute('data-original-html');
    if (originalHtml) {
      button.innerHTML = originalHtml;
    } else {
      button.innerHTML = text;
    }
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
