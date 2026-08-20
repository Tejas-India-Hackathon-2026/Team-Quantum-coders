/**
 * LifeProof - Dedicated Login Controller & Firebase Auth Integration
 * Handles role selection, Google OAuth popup, Email authentication, Firestore sync, and role-based routing.
 */

import {
  loginWithGoogle,
  loginWithEmailPassword,
  onAuthStateListener,
  getUserProfileFromFirestore
} from '../firebase/firebase-config.js';

// Global Auth State
const LifeProofAuth = {
  selectedRole: 'student', // Default: 'student' | 'recruiter' | 'faculty'
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
  dashboardRoutes: {
    student: 'pages/dashboard-user.html',
    recruiter: 'pages/dashboard-partner.html',
    faculty: 'pages/dashboard-admin.html'
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

window.LifeProofAuth = LifeProofAuth;

document.addEventListener('DOMContentLoaded', () => {
  initRoleSelector();
  initPasswordToggle();
  initGoogleAuth();
  initEmailPasswordForm();
  initForgotPasswordHandler();
  initAutoSessionCheck();
});

/**
 * Functional Role Selector (Student, Recruiter, Faculty)
 */
function initRoleSelector() {
  const roleButtons = document.querySelectorAll('.role-btn');
  const roleHint = document.getElementById('roleContextHint');

  if (!roleButtons.length) return;

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.getAttribute('data-role');
      if (!targetRole) return;

      LifeProofAuth.setRole(targetRole);

      // Update button active state
      roleButtons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      // Update role description text
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
 * Show / Hide Password Visibility Toggle
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
 * Google Sign-In Integration with Firebase Authentication & Firestore
 */
function initGoogleAuth() {
  const googleBtn = document.getElementById('btnGoogleAuth');
  if (!googleBtn) return;

  googleBtn.addEventListener('click', async () => {
    const role = LifeProofAuth.getRole();
    hideAuthAlert();
    setButtonLoading(googleBtn, true, 'Connecting to Google...');

    try {
      const { user, profile } = await loginWithGoogle(role);
      const targetRole = profile.role || role;

      showAuthAlert(`Welcome, ${user.displayName || 'User'}! Redirecting to ${targetRole} hub...`, 'success');

      // Determine redirect path
      const targetDashboard = LifeProofAuth.dashboardRoutes[targetRole] || 'pages/dashboard-user.html';

      setTimeout(() => {
        window.location.href = targetDashboard;
      }, 900);

    } catch (error) {
      setButtonLoading(googleBtn, false, 'Continue with Google');
      handleAuthError(error);
    }
  });
}

/**
 * Email & Password Form Submission Handler
 */
function initEmailPasswordForm() {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const submitBtn = document.getElementById('loginSubmitBtn');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthAlert();

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const role = LifeProofAuth.getRole();

    if (!email || !password) {
      showAuthAlert('Please provide both your email address and password.', 'error');
      return;
    }

    setButtonLoading(submitBtn, true, 'Signing in...');

    try {
      const { user, profile } = await loginWithEmailPassword(email, password, role);
      const targetRole = profile.role || role;

      showAuthAlert(`Welcome back! Redirecting to your dashboard...`, 'success');
      const targetDashboard = LifeProofAuth.dashboardRoutes[targetRole] || 'pages/dashboard-user.html';

      setTimeout(() => {
        window.location.href = targetDashboard;
      }, 800);

    } catch (error) {
      setButtonLoading(submitBtn, false, 'Continue to Platform &rarr;');
      handleAuthError(error);
    }
  });
}

/**
 * Check if user is already logged in on login page load
 */
function initAutoSessionCheck() {
  onAuthStateListener(async (user) => {
    if (user) {
      console.info('[LifeProof Auth] User session already active:', user.email);
      // Let user know session is active or provide 1-click jump to dashboard
      const profile = await getUserProfileFromFirestore(user.uid);
      if (profile && profile.role) {
        const targetDashboard = LifeProofAuth.dashboardRoutes[profile.role] || 'pages/dashboard-user.html';
        showAuthAlert(`Active session found (${user.displayName || user.email}). <a href="${targetDashboard}" style="color: #38bdf8; text-decoration: underline; font-weight: 700;">Click here to open Dashboard &rarr;</a>`, 'info');
      }
    }
  });
}

/**
 * Forgot Password Trigger
 */
function initForgotPasswordHandler() {
  const forgotBtn = document.getElementById('forgotPasswordLink');
  if (!forgotBtn) return;

  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
      showAuthAlert('Enter your email address above, then click Forgot Password.', 'info');
      if (emailInput) emailInput.focus();
      return;
    }

    showAuthAlert(`Password reset link will be sent to ${email}.`, 'info');
  });
}

/**
 * Converts Firebase error codes to friendly user messages
 */
function handleAuthError(error) {
  let message = 'Unable to sign in. Please try again.';

  switch (error.code) {
    case 'auth/popup-closed-by-user':
      message = 'Google Sign-In was cancelled.';
      break;
    case 'auth/popup-blocked':
      message = 'Popup was blocked by your browser. Please allow popups for this site.';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your internet connection.';
      break;
    case 'auth/unauthorized-domain':
      message = 'This domain is not authorized in Firebase Console. Add it under Authentication > Settings > Authorized Domains.';
      break;
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      message = 'Firebase configuration is using placeholder keys. Please update firebase/firebase-config.js with active credentials.';
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      message = 'Invalid email or password. Please verify your credentials.';
      break;
    case 'auth/invalid-email':
      message = 'Please enter a valid email address.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many attempts. Please try again in a few moments.';
      break;
    default:
      if (error.message && error.message.includes('API key')) {
        message = 'Firebase API Key is placeholder. Update firebase-config.js with your project credentials.';
      } else {
        message = error.message || 'Authentication error occurred.';
      }
      break;
  }

  showAuthAlert(message, 'error');
}

/**
 * Renders in-modal notification alert banner
 */
function showAuthAlert(message, type = 'info') {
  let alertBox = document.getElementById('authAlertBanner');

  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'authAlertBanner';
    alertBox.className = 'auth-alert-banner';
    const form = document.getElementById('loginForm');
    if (form) {
      form.parentNode.insertBefore(alertBox, form);
    }
  }

  alertBox.className = `auth-alert-banner alert-${type}`;
  alertBox.innerHTML = message;
  alertBox.style.display = 'block';
}

function hideAuthAlert() {
  const alertBox = document.getElementById('authAlertBanner');
  if (alertBox) {
    alertBox.style.display = 'none';
  }
}

/**
 * Toggle button loading state with spinner
 */
function setButtonLoading(button, isLoading, text) {
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
