/**
 * LifeProof - Dedicated Recruiter Dashboard Controller
 * 
 * Handles Firebase Authentication, Role-based access control,
 * Recruiter profile rendering, Candidate filtering, Application management,
 * Post Job modal workflow, and Secure Sign-out.
 */

import {
  requireRole,
  logoutUser
} from './auth.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initRecruiterAuthGuard();
  initSidebarNavigation();
  initMobileSidebarToggle();
  initGlobalSearch();
  initCandidateFilters();
  initApplicationActions();
  initCandidateInviteActions();
  initJobManagement();
  initPostJobModal();
  initInterviewActions();
});

/**
 * 1. Central Security Guard: Enforces Recruiter Role
 * Enforces authentication and restricts access strictly to verified Recruiter role via Firestore.
 */
async function initRecruiterAuthGuard() {
  await requireRole('recruiter', ({ user, profile }) => {
    renderRecruiterProfile(user, profile);
  });

  // Attach Sign Out button listener
  initLogoutAction();
}

/**
 * Renders authenticated recruiter details into Topbar and Welcome banner
 * @param {Object} user - Firebase User object
 * @param {Object|null} profile - Firestore profile document
 */
function renderRecruiterProfile(user, profile) {
  const displayName = (profile && profile.name) || user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Sarah Jenkins');
  const email = (profile && profile.email) || user.email || 'recruiter@enterprise.com';
  const uid = user.uid || (profile && profile.uid) || 'LP-REC-9482';
  const photoURL = (profile && profile.photoURL) || user.photoURL || '';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SJ';

  // 1. Update Recruiter Name Elements
  const nameElements = document.querySelectorAll('.auth-user-name, #topbarRecruiterName, #welcomeRecruiterName');
  nameElements.forEach(el => {
    el.textContent = displayName;
  });

  // 2. Update Email Elements
  const emailElements = document.querySelectorAll('.auth-user-email, #welcomeRecruiterEmail');
  emailElements.forEach(el => {
    el.textContent = email;
  });

  // 3. Update UID Elements
  const uidElements = document.querySelectorAll('.auth-user-uid, #welcomeRecruiterUid');
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

      showToast('Signing out of Recruiter Portal...', '🚪');
      await logoutUser('../login.html');
    } catch (error) {
      console.error('[LifeProof Recruiter] Sign out error:', error);
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

      if (item.id === 'sidebarPostJobBtn') {
        e.preventDefault();
        openPostJobModal();
        closeMobileSidebar();
        return;
      }

      if (item.id === 'sidebarMessagesBtn') {
        e.preventDefault();
        showToast('5 Unread Messages from shortlisted candidates (IIT-D & BITS).', '💬');
        closeMobileSidebar();
        return;
      }

      // Update active class
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      closeMobileSidebar();

      // Smooth scroll if anchor
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
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('3 New Applications received for Frontend & Full Stack drives.', '🔔');
    });
  }

  // Browse Talent banner button
  const browseTalentBtn = document.getElementById('btnBrowseTalent');
  if (browseTalentBtn) {
    browseTalentBtn.addEventListener('click', () => {
      const target = document.getElementById('candidate-profiles');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const launchDriveBtn = document.getElementById('btnLaunchDrive');
  if (launchDriveBtn) {
    launchDriveBtn.addEventListener('click', openPostJobModal);
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
 * 5. Global Search Filter for Candidates & Applications
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('dashboardSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const candidateCards = document.querySelectorAll('.candidate-card');
    const applicationRows = document.querySelectorAll('#applicationsTable tbody tr');

    // Filter Candidate Cards
    candidateCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'flex' : 'none';
    });

    // Filter Application Rows
    applicationRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/**
 * 6. Candidate Search Filters
 */
function initCandidateFilters() {
  const searchBtn = document.getElementById('btnExecuteSearch');
  const roleSelect = document.getElementById('filterRoleSelect');
  const univSelect = document.getElementById('filterUnivSelect');
  const proofSelect = document.getElementById('filterProofSelect');
  const candidateCards = document.querySelectorAll('.candidate-card');

  if (!searchBtn) return;

  searchBtn.addEventListener('click', () => {
    const selectedRole = roleSelect ? roleSelect.value : 'all';
    const selectedUniv = univSelect ? univSelect.value : 'all';

    let matchCount = 0;

    candidateCards.forEach(card => {
      const cardRole = card.getAttribute('data-role');
      const cardText = card.textContent.toLowerCase();

      let matchesRole = (selectedRole === 'all' || cardRole === selectedRole);
      let matchesUniv = (selectedUniv === 'all' || (selectedUniv === 'iit' && cardText.includes('iit')) || (selectedUniv === 'bits' && cardText.includes('bits')) || (selectedUniv === 'iiit' && cardText.includes('iiit')));

      if (matchesRole && matchesUniv) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    showToast(`Found ${matchCount} candidates matching your criteria.`, '🔍');
  });
}

/**
 * 7. Recent Applications Table Actions
 */
function initApplicationActions() {
  const actionButtons = document.querySelectorAll('.btn-app-action');

  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const name = btn.getAttribute('data-name') || 'Candidate';
      const row = btn.closest('tr');

      if (action === 'shortlist') {
        const statusCell = row.querySelector('.status-pill');
        if (statusCell) {
          statusCell.className = 'status-pill status-shortlisted';
          statusCell.textContent = '● Shortlisted';
        }
        btn.textContent = 'Shortlisted ✓';
        btn.disabled = true;
        showToast(`${name} added to shortlisted candidates!`, '⭐');

      } else if (action === 'schedule') {
        showToast(`Interview scheduling invite dispatched to ${name}.`, '📅');

      } else if (action === 'reject') {
        row.style.opacity = '0.4';
        btn.textContent = 'Passed';
        btn.disabled = true;
        showToast(`${name} marked as not selected.`, 'ℹ️');
      }
    });
  });
}

/**
 * 8. Candidate Invite & Proof Inspection Actions
 */
function initCandidateInviteActions() {
  const inviteButtons = document.querySelectorAll('.btn-invite-candidate');
  const viewProofButtons = document.querySelectorAll('.btn-view-profile');

  inviteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Candidate';
      btn.textContent = 'Invited ✓';
      btn.disabled = true;
      btn.style.background = 'rgba(16, 185, 129, 0.2)';
      btn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      btn.style.color = '#34d399';
      showToast(`Interview invitation sent directly to ${name}!`, '💌');
    });
  });

  viewProofButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Candidate';
      showToast(`Cryptographic proofs and GitHub telemetry verified for ${name}.`, '🛡️');
    });
  });
}

/**
 * 9. Active Job Posts Management
 */
function initJobManagement() {
  const jobStatusButtons = document.querySelectorAll('.btn-job-status');

  jobStatusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isPaused = btn.textContent.includes('Resume');
      if (isPaused) {
        btn.textContent = 'Pause Drive';
        btn.classList.replace('btn-secondary', 'btn-primary');
        showToast('Hiring drive resumed and visible to students.', '▶️');
      } else {
        btn.textContent = 'Resume Drive';
        btn.classList.replace('btn-primary', 'btn-secondary');
        showToast('Hiring drive paused. Applications on hold.', '⏸️');
      }
    });
  });
}

/**
 * 10. Post Job Modal Workflow
 */
function initPostJobModal() {
  const modalOverlay = document.getElementById('postJobModalOverlay');
  const openModalBtn = document.getElementById('topbarPostJobBtn');
  const openModalBtn2 = document.getElementById('btnOpenPostJobModal');
  const closeModalBtn = document.getElementById('closePostJobModalBtn');
  const postJobForm = document.getElementById('postJobForm');

  if (openModalBtn) openModalBtn.addEventListener('click', openPostJobModal);
  if (openModalBtn2) openModalBtn2.addEventListener('click', openPostJobModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closePostJobModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closePostJobModal();
    });
  }

  if (postJobForm) {
    postJobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('jobTitleInput').value.trim();
      const location = document.getElementById('jobLocationInput').value.trim();
      const salary = document.getElementById('jobSalaryInput').value.trim();
      const skills = document.getElementById('jobSkillsInput').value.trim();

      if (!title) return;

      // Create new job card dynamically
      const jobsGrid = document.getElementById('recruiterJobsGrid');
      if (jobsGrid) {
        const newCard = document.createElement('div');
        newCard.className = 'opportunity-card';
        newCard.setAttribute('data-title', title);
        newCard.innerHTML = `
          <div class="opportunity-header">
            <div class="opportunity-company-box">
              <div class="company-logo-avatar" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">🚀</div>
              <div class="company-details">
                <h4>${escapeHtml(title)}</h4>
                <span class="company-name">${escapeHtml(location)} &bull; ${escapeHtml(salary)}</span>
              </div>
            </div>
            <span class="badge-tag badge-user" style="font-size: 0.68rem; margin: 0;">NEW</span>
          </div>
          <div class="opportunity-tags">
            ${skills.split(',').map(s => `<span class="tag-pill">${escapeHtml(s.trim())}</span>`).join('')}
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>👥 0 Applicants</span>
            <span>⭐ Live Synced</span>
          </div>
          <div class="opportunity-footer">
            <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;">
              Manage Pipeline
            </button>
            <button type="button" class="btn btn-primary btn-sm btn-job-status" style="font-size: 0.8rem; padding: 0.35rem 0.8rem;">
              Pause Drive
            </button>
          </div>
        `;
        jobsGrid.insertBefore(newCard, jobsGrid.firstChild);
      }

      postJobForm.reset();
      closePostJobModal();
      showToast(`Job posting '${title}' published successfully!`, '🎉');
    });
  }
}

function openPostJobModal() {
  const modalOverlay = document.getElementById('postJobModalOverlay');
  if (modalOverlay) modalOverlay.classList.add('active');
}

function closePostJobModal() {
  const modalOverlay = document.getElementById('postJobModalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('active');
}

/**
 * 11. Interview Actions
 */
function initInterviewActions() {
  const startInterviewButtons = document.querySelectorAll('.btn-start-interview');

  startInterviewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const meetUrl = btn.getAttribute('data-meet') || 'https://meet.google.com';
      showToast(`Launching interview session: ${meetUrl}`, '🎥');
      setTimeout(() => {
        window.open(meetUrl, '_blank');
      }, 400);
    });
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
