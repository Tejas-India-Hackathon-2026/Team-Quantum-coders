/**
 * LifeProof - Dedicated Student Dashboard Controller
 * 
 * Manages Firebase Authentication session guard, profile rendering,
 * sidebar navigation, search filtering, skills tabs, job applications,
 * and secure Firebase sign-out.
 */

import {
  requireRole,
  logoutUser
} from './auth.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initStudentAuthGuard();
  initSidebarNavigation();
  initMobileSidebarToggle();
  initGlobalSearch();
  initSkillCategoryTabs();
  initOpportunityInteractions();
  initResumeActions();
  initNotificationToast();
});

/**
 * 1. Central Security Guard: Enforces Student Role
 * Only verified Student users can access this dashboard; unauthorized users are redirected.
 */
async function initStudentAuthGuard() {
  await requireRole('student', ({ user, profile }) => {
    renderStudentProfile(user, profile);
  });

  // Attach Sign Out button listener
  initLogoutAction();
}

/**
 * Renders authenticated user details into Topbar and Welcome banner
 * @param {Object} user - Firebase User object
 * @param {Object|null} profile - Firestore profile document
 */
function renderStudentProfile(user, profile) {
  const displayName = (profile && profile.name) || user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Akrit Sharma');
  const email = (profile && profile.email) || user.email || 'student@university.edu';
  const uid = user.uid || (profile && profile.uid) || 'LP-AUTH-9482';
  const photoURL = (profile && profile.photoURL) || user.photoURL || '';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AS';

  // 1. Update Student Name Elements
  const nameElements = document.querySelectorAll('.auth-user-name, #topbarStudentName, #welcomeStudentName');
  nameElements.forEach(el => {
    el.textContent = displayName;
  });

  // 2. Update Email Elements
  const emailElements = document.querySelectorAll('.auth-user-email, #welcomeStudentEmail');
  emailElements.forEach(el => {
    el.textContent = email;
  });

  // 3. Update UID Elements
  const uidElements = document.querySelectorAll('.auth-user-uid, #welcomeStudentUid');
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

      showToast('Signing out of LifeProof...', '🚪');
      await logoutUser('../login.html');
    } catch (error) {
      console.error('[LifeProof Student] Sign out error:', error);
      showToast('Error signing out. Please try again.', '⚠️');
      logoutBtn.innerHTML = `<span class="sidebar-item-icon">🚪</span> <span>Sign Out</span>`;
      logoutBtn.style.opacity = '1';
      logoutBtn.disabled = false;
    }
  });
}

/**
 * 3. Sidebar Navigation Item Active State & Smooth Scrolling
 */
function initSidebarNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .sidebar-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetHref = item.getAttribute('href');

      // Update active state
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Close mobile sidebar drawer if open
      closeMobileSidebar();

      // Smooth scroll if internal anchor
      if (targetHref && targetHref.startsWith('#')) {
        const targetElement = document.querySelector(targetHref);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
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
 * 5. Global Search Filter for Jobs, Internships, and Skills
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('dashboardSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    const skillCards = document.querySelectorAll('.skill-item-card');

    // Filter Opportunity Cards
    opportunityCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const isMatch = text.includes(query);
      card.style.display = isMatch ? 'flex' : 'none';
    });

    // Filter Skill Cards
    skillCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const isMatch = text.includes(query);
      card.style.display = isMatch ? 'block' : 'none';
    });
  });
}

/**
 * 6. Skill Category Tabs Filtering
 */
function initSkillCategoryTabs() {
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-item-card');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Add Skill Modal trigger simulation
  const addSkillBtn = document.getElementById('btnAddSkillBtn');
  if (addSkillBtn) {
    addSkillBtn.addEventListener('click', () => {
      showToast('Skill proof submission modal will open here.', '⚡');
    });
  }
}

/**
 * 7. Job & Internship Application Actions
 */
function initOpportunityInteractions() {
  const applyButtons = document.querySelectorAll('.btn-apply-action');

  applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const roleName = btn.getAttribute('data-role') || 'Position';

      if (btn.classList.contains('applied')) {
        showToast(`Already applied to ${roleName}!`, 'ℹ️');
        return;
      }

      btn.classList.add('applied');
      btn.textContent = 'Applied ✓';
      showToast(`Application submitted successfully for ${roleName}!`, '🎉');
    });
  });

  // Join Call buttons
  const callButtons = document.querySelectorAll('.btn-join-call');
  callButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const meetUrl = btn.getAttribute('data-meet') || 'https://meet.google.com';
      showToast(`Opening video interview link: ${meetUrl}`, '🎥');
      setTimeout(() => {
        window.open(meetUrl, '_blank');
      }, 400);
    });
  });
}

/**
 * 8. Resume Section Interactive Triggers
 */
function initResumeActions() {
  const downloadBtn = document.getElementById('btnDownloadResume');
  const uploadBtn = document.getElementById('btnUploadResume');
  const scanBtn = document.getElementById('btnScanResume');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast('Downloading ATS Verified Resume PDF...', '📄');
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      showToast('Select a new PDF or DOCX file to update your resume.', '📁');
    });
  }

  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      showToast('AI Scanner: ATS Score is 92/100 (Optimal). All keywords verified!', '✨');
    });
  }
}

/**
 * 9. Topbar Notification Trigger & In-App Toast Helper
 */
function initNotificationToast() {
  const notifBtn = document.getElementById('topbarNotificationBtn');
  const sidebarNotifLink = document.getElementById('sidebarNotificationLink');

  const showNotif = (e) => {
    if (e) e.preventDefault();
    showToast('3 New Notifications: Stripe interview reminder, Microsoft shortlist update, Skill badge verified.', '🔔');
  };

  if (notifBtn) notifBtn.addEventListener('click', showNotif);
  if (sidebarNotifLink) sidebarNotifLink.addEventListener('click', showNotif);
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
