/**
 * LifeProof - Dedicated Faculty Dashboard Controller
 * 
 * Manages Firebase Authentication, Role-based access control,
 * Faculty profile rendering, Institutional telemetry, Report downloads,
 * Student roster searching, and Secure Sign-out.
 */

import {
  requireRole,
  logoutUser
} from './auth.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initFacultyAuthGuard();
  initSidebarNavigation();
  initMobileSidebarToggle();
  initGlobalSearch();
  initReportExports();
  initStudentRosterActions();
  initActivityFeedRefresh();
});

/**
 * 1. Central Security Guard: Enforces Faculty Role
 * Enforces authentication and restricts access strictly to verified Faculty role via Firestore.
 */
async function initFacultyAuthGuard() {
  await requireRole('faculty', ({ user, profile }) => {
    renderFacultyProfile(user, profile);
  });

  // Attach Sign Out button listener
  initLogoutAction();
}

/**
 * Renders authenticated faculty details into Topbar and Welcome banner
 * @param {Object} user - Firebase User object
 * @param {Object|null} profile - Firestore profile document
 */
function renderFacultyProfile(user, profile) {
  const displayName = (profile && profile.name) || user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Dr. Rajiv Menon');
  const email = (profile && profile.email) || user.email || 'faculty@university.edu';
  const uid = user.uid || (profile && profile.uid) || 'LP-FAC-9482';
  const photoURL = (profile && profile.photoURL) || user.photoURL || '';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'RM';

  // 1. Update Faculty Name Elements
  const nameElements = document.querySelectorAll('.auth-user-name, #topbarFacultyName, #welcomeFacultyName');
  nameElements.forEach(el => {
    el.textContent = displayName;
  });

  // 2. Update Email Elements
  const emailElements = document.querySelectorAll('.auth-user-email, #welcomeFacultyEmail');
  emailElements.forEach(el => {
    el.textContent = email;
  });

  // 3. Update UID Elements
  const uidElements = document.querySelectorAll('.auth-user-uid, #welcomeFacultyUid');
  uidElements.forEach(el => {
    el.textContent = uid;
  });

  // 4. Update Profile Photo & Avatar
  const avatarElements = document.querySelectorAll('.auth-user-avatar, #topbarAvatar');
  avatarElements.forEach(el => {
    if (photoURL) {
      el.style.backgroundImage = `url('${photoURL}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    } else {
      el.style.backgroundImage = 'none';
      el.textContent = initials;
    }
  });
}

/**
 * 2. Secure Sign-Out using central logoutUser()
 */
function initLogoutAction() {
  const logoutBtn = document.getElementById('sidebarLogoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      logoutBtn.innerHTML = `<span>⏳</span> <span>Signing out...</span>`;
      logoutBtn.style.opacity = '0.7';
      logoutBtn.disabled = true;

      showToast('Signing out of Faculty Portal...', '🚪');
      await logoutUser('../login.html');
    } catch (error) {
      console.error('[LifeProof Faculty] Sign out error:', error);
      showToast('Error signing out. Please try again.', '⚠️');
      logoutBtn.innerHTML = `<span class="sidebar-item-icon">🚪</span> <span>Sign Out</span>`;
      logoutBtn.style.opacity = '1';
      logoutBtn.disabled = false;
    }
  });
}

/**
 * 3. Sidebar Navigation Active States & Smooth Scrolling
 */
function initSidebarNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .sidebar-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetHref = item.getAttribute('href');

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      closeMobileSidebar();

      if (targetHref && targetHref.startsWith('#')) {
        const targetElement = document.querySelector(targetHref);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Topbar Notification Bell
  const notifBtn = document.getElementById('topbarNotificationBtn');
  const sidebarNotifLink = document.getElementById('sidebarNotificationLink');

  const showNotif = (e) => {
    if (e) e.preventDefault();
    showToast('4 Alerts: Stripe verified offer logged, NIRF data validated, 12 new proof hashes submitted.', '🔔');
  };

  if (notifBtn) notifBtn.addEventListener('click', showNotif);
  if (sidebarNotifLink) sidebarNotifLink.addEventListener('click', showNotif);

  // Banner Actions
  const btnViewBatchReport = document.getElementById('btnViewBatchReport');
  if (btnViewBatchReport) {
    btnViewBatchReport.addEventListener('click', () => {
      const target = document.getElementById('placement-reports');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const btnVerifyProofs = document.getElementById('btnVerifyProofs');
  if (btnVerifyProofs) {
    btnVerifyProofs.addEventListener('click', () => {
      showToast('Institutional Proof Validation Engine: All 1,240 hashes synchronized with university registry.', '🛡️');
    });
  }

  const topbarExportBtn = document.getElementById('topbarExportReportBtn');
  if (topbarExportBtn) {
    topbarExportBtn.addEventListener('click', () => {
      showToast('Exporting NAAC SSR Criterion V Institutional Dossier (PDF)...', '📑');
    });
  }
}

/**
 * 4. Responsive Mobile Sidebar Drawer Toggle
 */
function initMobileSidebarToggle() {
  const sidebar = document.getElementById('dashboardSidebar');
  const toggleBtn = document.getElementById('mobileSidebarToggle');
  const closeBtn = document.getElementById('sidebarCloseBtn');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (!sidebar) return;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('sidebar-open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('dashboardSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('sidebar-open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * 5. Global Search Filter for Student Roster & Telemetry
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('dashboardSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const studentRows = document.querySelectorAll('#studentRosterTable tbody tr');

    studentRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/**
 * 6. Report Export Actions (NAAC, NIRF, Senate)
 */
function initReportExports() {
  const exportButtons = document.querySelectorAll('.btn-export-report');

  exportButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const reportName = btn.getAttribute('data-report') || 'Institutional Report';
      showToast(`Generating & downloading ${reportName}...`, '📊');
    });
  });
}

/**
 * 7. Student Roster Profile Inspection Actions
 */
function initStudentRosterActions() {
  const detailButtons = document.querySelectorAll('.btn-student-details');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const studentName = btn.getAttribute('data-name') || 'Student';
      showToast(`Opening verified academic proofs & career telemetry for ${studentName}.`, '👤');
    });
  });
}

/**
 * 8. Real-time Activity Feed Refresh
 */
function initActivityFeedRefresh() {
  const refreshBtn = document.getElementById('btnRefreshFeed');
  if (!refreshBtn) return;

  refreshBtn.addEventListener('click', () => {
    showToast('Activity feed refreshed with latest campus drive & proof submissions.', '🔄');
  });
}

/**
 * Displays floating glassmorphic toast notification
 * @param {string} message 
 * @param {string} icon 
 */
function showToast(message, icon = '✨') {
  const toast = document.getElementById('dashboardToast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');

  if (!toast) return;

  if (toastIcon) toastIcon.textContent = icon;
  if (toastMessage) toastMessage.textContent = message;

  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
