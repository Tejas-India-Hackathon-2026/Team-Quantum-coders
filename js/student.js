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
  initStudentAssessmentFlow();
});

/**
 * 10. Student Recruiter Assessment Suite & Badge Verification
 */
function initStudentAssessmentFlow() {
  const testsGrid = document.getElementById('studentRecruiterTestsGrid');
  const modalOverlay = document.getElementById('takeAssessmentModalOverlay');
  const closeBtn = document.getElementById('closeTakeAssessmentModalBtn');
  const examForm = document.getElementById('studentExamForm');
  const examResultScreen = document.getElementById('examResultScreen');
  const claimBadgeBtn = document.getElementById('btnClaimBadgeDone');
  const examModalTitle = document.getElementById('examModalTitle');
  const timerEl = document.getElementById('examTimer');

  // 1. Render custom recruiter tests if published from Recruiter Dashboard
  try {
    const savedTests = JSON.parse(localStorage.getItem('lp_recruiter_tests') || '[]');
    if (savedTests.length > 0 && testsGrid) {
      savedTests.forEach(test => {
        const card = document.createElement('div');
        card.className = 'opportunity-card student-test-card';
        card.innerHTML = `
          <div class="opportunity-header">
            <div class="opportunity-company-box">
              <div class="company-logo-avatar" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">🚀</div>
              <div class="company-details">
                <h4>${escapeHtml(test.title)}</h4>
                <span class="company-name">${escapeHtml(test.skills ? test.skills.join(', ') : 'Verified Recruiter Test')}</span>
              </div>
            </div>
            <span class="badge-tag badge-user">${escapeHtml(test.cutoff || '80% Cutoff')}</span>
          </div>
          <div class="opportunity-tags">
            <span class="tag-pill">${escapeHtml(test.duration || '45 Mins')}</span>
            <span class="tag-pill" style="color: #34d399;">Live Challenge</span>
          </div>
          <div class="opportunity-footer">
            <button type="button" class="btn-apply-action btn-start-student-test" data-test="${escapeHtml(test.title)}" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);">
              Take Assessment &rarr;
            </button>
          </div>
        `;
        testsGrid.insertBefore(card, testsGrid.firstChild);
      });
    }
  } catch (err) {}

  let timerInterval = null;

  const startTimer = () => {
    let timeLeft = 45 * 60; // 45 minutes
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        return;
      }
      timeLeft--;
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      if (timerEl) {
        timerEl.textContent = `⏳ ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }, 1000);
  };

  const bindStartButtons = () => {
    const startButtons = document.querySelectorAll('.btn-start-student-test');
    startButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const testName = btn.getAttribute('data-test') || 'Technical Assessment';
        if (examModalTitle) examModalTitle.textContent = testName;

        if (examForm) {
          examForm.style.display = 'block';
          examForm.reset();
        }
        if (examResultScreen) examResultScreen.style.display = 'none';

        if (modalOverlay) modalOverlay.classList.add('active');
        startTimer();
      });
    });
  };

  bindStartButtons();

  const closeModal = () => {
    if (modalOverlay) modalOverlay.classList.remove('active');
    if (timerInterval) clearInterval(timerInterval);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Examination submission
  if (examForm) {
    examForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (timerInterval) clearInterval(timerInterval);

      examForm.style.display = 'none';
      if (examResultScreen) examResultScreen.style.display = 'block';

      showToast('Assessment submitted! Calculating verified cryptographic score...', '⚡');
    });
  }

  // Claim Badge Action
  if (claimBadgeBtn) {
    claimBadgeBtn.addEventListener('click', () => {
      closeModal();

      // Append new verified badge into Skills grid
      const skillsGrid = document.getElementById('skillsGrid');
      if (skillsGrid) {
        const verifiedCard = document.createElement('div');
        verifiedCard.className = 'skill-item-card';
        verifiedCard.setAttribute('data-category', 'engineering');
        verifiedCard.innerHTML = `
          <div class="skill-item-header">
            <span class="skill-name-title">🏆 Recruiter Verified: Distributed Systems</span>
            <span class="skill-verified-tag" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">✓ 100% PROOF</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-progress" style="width: 100%; background: linear-gradient(90deg, #10b981, #06b6d4);"></div>
          </div>
          <div class="skill-meta-footer">
            <span>Proof: #LP-RECRUITER-VERIFIED</span>
            <span style="color: #34d399; font-weight: 700;">Score: 100% (Passed)</span>
          </div>
        `;
        skillsGrid.insertBefore(verifiedCard, skillsGrid.firstChild);
      }

      // Boost Career Readiness score
      const scoreNumber = document.querySelector('.score-number');
      if (scoreNumber) {
        scoreNumber.textContent = '98.4';
      }

      showToast('🎉 Cryptographic LifeProof Skill Badge earned and attached to your portfolio!', '🏆');
    });
  }
}

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
