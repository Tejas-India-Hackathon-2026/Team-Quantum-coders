/**
 * LifeProof - Dedicated Recruiter Dashboard Controller
 * 
 * Handles Firebase Authentication, Role-based access control,
 * Recruiter profile rendering, Candidate filtering, Application management,
 * Post Job modal workflow, Custom Assessment Builder, and 1-Click Interview Scheduling.
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
  initAssessmentSuite();
  initBannerActions();
});

/**
 * 1. Central Security Guard: Enforces Recruiter Role
 * Verifies authentication with graceful guest fallback for preview testing.
 */
async function initRecruiterAuthGuard() {
  try {
    const session = await requireRole('recruiter', ({ user, profile }) => {
      renderRecruiterProfile(user, profile);
    });

    if (!session) {
      // Fallback demo profile so recruiter window is always functional
      renderRecruiterProfile(
        { displayName: 'Sarah Jenkins', email: 's.jenkins@stripe-talent.io', uid: 'LP-REC-9482' },
        { name: 'Sarah Jenkins', email: 's.jenkins@stripe-talent.io', uid: 'LP-REC-9482', company: 'Stripe' }
      );
    }
  } catch (err) {
    console.warn('[LifeProof Recruiter Guard] Preview mode active:', err.message);
    renderRecruiterProfile(
      { displayName: 'Sarah Jenkins', email: 's.jenkins@stripe-talent.io', uid: 'LP-REC-9482' },
      { name: 'Sarah Jenkins', email: 's.jenkins@stripe-talent.io', uid: 'LP-REC-9482', company: 'Stripe' }
    );
  }

  // Attach Sign Out button listener
  initLogoutAction();
}

/**
 * Renders authenticated recruiter details into Topbar and Welcome banner
 * @param {Object} user - Firebase User object
 * @param {Object|null} profile - Firestore profile document
 */
function renderRecruiterProfile(user, profile) {
  const displayName = (profile && profile.name) || (user && (user.displayName || user.name)) || 'Sarah Jenkins';
  const email = (profile && profile.email) || (user && user.email) || 's.jenkins@stripe-talent.io';
  const uid = (user && user.uid) || (profile && profile.uid) || 'LP-REC-9482';
  const photoURL = (profile && profile.photoURL) || (user && user.photoURL) || '';
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

      if (item.id === 'sidebarPostJobBtn' || item.id === 'btnSidebarPostJob') {
        e.preventDefault();
        openPostJobModal();
        closeMobileSidebar();
        return;
      }

      if (item.id === 'sidebarCreateTestBtn' || item.id === 'btnSidebarCreateTest') {
        e.preventDefault();
        openCreateAssessmentModal();
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
}

/**
 * 4. Banner & Topbar Action Shortcuts
 */
function initBannerActions() {
  // Topbar Notification Bell
  const notifBtn = document.getElementById('topbarNotificationBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('3 New Verified Candidate Applications received for Backend & Full Stack drives.', '🔔');
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

  // Launch Hiring Drive button
  const launchDriveBtn = document.getElementById('btnLaunchDrive');
  if (launchDriveBtn) {
    launchDriveBtn.addEventListener('click', openPostJobModal);
  }
}

/**
 * 5. Responsive Mobile Sidebar Drawer Toggle
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
 * 6. Global Search Filter for Candidates & Applications
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
 * 7. Candidate Search & Proof Filter Suite
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
    const selectedProof = proofSelect ? proofSelect.value : 'all';

    let matchCount = 0;

    candidateCards.forEach(card => {
      const cardRole = (card.getAttribute('data-role') || '').toLowerCase();
      const cardText = card.textContent.toLowerCase();

      let matchesRole = (selectedRole === 'all' || cardRole === selectedRole || cardText.includes(selectedRole));
      let matchesUniv = (selectedUniv === 'all' || (selectedUniv === 'iit' && (cardText.includes('iit') || cardText.includes('delhi'))) || (selectedUniv === 'bits' && cardText.includes('bits')) || (selectedUniv === 'iiit' && cardText.includes('iiit')));
      let matchesProof = (selectedProof === 'all' || cardText.includes('#lp-'));

      if (matchesRole && matchesUniv && matchesProof) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    showToast(`Found ${matchCount} verified candidates matching your criteria.`, '🔍');
  });
}

/**
 * 8. Recent Applications Table Actions (Shortlist, Pass, CSV Export)
 */
function initApplicationActions() {
  const actionButtons = document.querySelectorAll('.btn-app-action');
  const exportCsvBtn = document.getElementById('btnExportApplicantsCsv');

  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const name = btn.getAttribute('data-name') || 'Candidate';
      const row = btn.closest('tr');

      if (action === 'shortlist') {
        const statusCell = row ? row.querySelector('.status-pill') : null;
        if (statusCell) {
          statusCell.className = 'status-pill status-shortlisted';
          statusCell.textContent = '● Shortlisted';
        }
        btn.textContent = 'Shortlisted ✓';
        btn.disabled = true;
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
        btn.style.color = '#34d399';
        showToast(`${name} added to Shortlisted Candidates!`, '⭐');

      } else if (action === 'schedule') {
        openInviteInterviewModal(name, 'IIT Delhi • B.Tech CSE (2026)', '#LP-9482-SYS', btn);

      } else if (action === 'reject') {
        if (row) row.style.opacity = '0.35';
        btn.textContent = 'Passed';
        btn.disabled = true;
        showToast(`${name} marked as not selected for this drive.`, 'ℹ️');
      }
    });
  });

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      showToast('Exporting candidate application ledger to CSV...', '📊');
    });
  }
}

/**
 * 9. Candidate Invite & Proof Inspection Suite (1-Click Scheduler Modal)
 */
function initCandidateInviteActions() {
  const inviteButtons = document.querySelectorAll('.btn-invite-candidate');
  const viewProofButtons = document.querySelectorAll('.btn-view-profile');
  const modalOverlay = document.getElementById('inviteInterviewModalOverlay');
  const closeModalBtn = document.getElementById('closeInviteModalBtn');
  const form = document.getElementById('inviteInterviewForm');
  const dateInput = document.getElementById('interviewDateInput');

  // Set default date to tomorrow
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  inviteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.candidate-card');
      const name = btn.getAttribute('data-name') || (card ? card.querySelector('h4')?.textContent : 'Candidate');
      const univ = card ? (card.querySelector('.candidate-university')?.textContent || 'IIT Delhi • B.Tech CSE') : 'Top University';
      const proof = card ? (card.querySelector('.candidate-proof-strip strong')?.textContent || '#LP-9482-SYS') : '#LP-VERIFIED';

      openInviteInterviewModal(name, univ, proof, btn);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeInviteInterviewModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeInviteInterviewModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const round = document.getElementById('interviewRoundSelect')?.value || 'Technical Interview';
      const date = document.getElementById('interviewDateInput')?.value || 'Tomorrow';
      const timeSlot = document.getElementById('interviewTimeSlotSelect')?.value || '02:00 PM';
      const name = document.getElementById('inviteCandidateName')?.textContent || 'Candidate';

      if (window.currentActiveInviteBtn) {
        window.currentActiveInviteBtn.textContent = 'Invited ✓';
        window.currentActiveInviteBtn.disabled = true;
        window.currentActiveInviteBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        window.currentActiveInviteBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        window.currentActiveInviteBtn.style.color = '#34d399';
      }

      closeInviteInterviewModal();
      showToast(`Interview confirmed for ${name} (${round} on ${date} @ ${timeSlot})!`, '🚀');
    });
  }

  viewProofButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.candidate-card');
      const proof = card ? (card.querySelector('.candidate-proof-strip strong')?.textContent || '#LP-9482-SYS') : '#LP-9482-SYS';
      window.open(`../verify.html?proof=${encodeURIComponent(proof)}`, '_blank');
    });
  });
}

function openInviteInterviewModal(candidateName, candidateUniv = 'IIT Delhi • B.Tech CSE (Batch 2026)', candidateProof = '#LP-9482-SYS', triggerBtn = null) {
  window.currentActiveInviteBtn = triggerBtn;
  const modalOverlay = document.getElementById('inviteInterviewModalOverlay');
  const nameEl = document.getElementById('inviteCandidateName');
  const univEl = document.getElementById('inviteCandidateUniv');
  const avatarEl = document.getElementById('inviteCandidateAvatar');
  const proofEl = document.getElementById('inviteCandidateProof');

  if (nameEl) nameEl.textContent = candidateName;
  if (univEl) univEl.textContent = candidateUniv;
  if (proofEl) proofEl.textContent = candidateProof;
  if (avatarEl) {
    const initials = candidateName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AS';
    avatarEl.textContent = initials;
  }

  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
    showToast(`Configuring interview invite for ${candidateName}...`, '📅');
  }
}

function closeInviteInterviewModal() {
  const modalOverlay = document.getElementById('inviteInterviewModalOverlay');
  if (modalOverlay) modalOverlay.style.display = 'none';
}

/**
 * 10. Active Job Posts Management (Pause / Resume & Pipeline Navigation)
 */
function initJobManagement() {
  const jobStatusButtons = document.querySelectorAll('.btn-job-status');
  const managePipelineButtons = document.querySelectorAll('.opportunity-footer .btn-secondary');

  jobStatusButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isPaused = btn.textContent.includes('Resume');
      if (isPaused) {
        btn.textContent = 'Pause Drive';
        btn.classList.replace('btn-secondary', 'btn-primary');
        showToast('Hiring drive resumed and visible to student cohorts.', '▶️');
      } else {
        btn.textContent = 'Resume Drive';
        btn.classList.replace('btn-primary', 'btn-secondary');
        showToast('Hiring drive paused. Applications temporarily on hold.', '⏸️');
      }
    });
  });

  managePipelineButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.opportunity-card');
      const title = card ? (card.getAttribute('data-title') || card.querySelector('h4')?.textContent) : 'Hiring Drive';
      const target = document.getElementById('recent-applications');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      showToast(`Viewing applicant pipeline for '${title}'.`, '💼');
    });
  });
}

/**
 * 11. Post Job Modal Workflow
 */
function initPostJobModal() {
  const modalOverlay = document.getElementById('postJobModalOverlay');
  const openButtons = document.querySelectorAll('#topbarPostJobBtn, #btnOpenPostJobModal, #btnSidebarPostJob, #sidebarPostJobBtn');
  const closeBtn = document.getElementById('closePostJobModalBtn');
  const form = document.getElementById('postJobForm');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPostJobModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closePostJobModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closePostJobModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('jobTitleInput')?.value.trim();
      const location = document.getElementById('jobLocationInput')?.value.trim();
      const salary = document.getElementById('jobSalaryInput')?.value.trim();
      const skills = document.getElementById('jobSkillsInput')?.value.trim();

      if (!title) return;

      // Create new job card dynamically in grid
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
                <span class="company-name">${escapeHtml(location || 'Remote')} &bull; ${escapeHtml(salary || 'Competitive CTC')}</span>
              </div>
            </div>
            <span class="badge-tag badge-user" style="font-size: 0.68rem; margin: 0;">NEW</span>
          </div>
          <div class="opportunity-tags">
            ${(skills || 'Technical Skills').split(',').map(s => `<span class="tag-pill">${escapeHtml(s.trim())}</span>`).join('')}
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

      form.reset();
      closePostJobModal();
      showToast(`Job posting '${title}' published live across LifeProof university network!`, '🎉');
      initJobManagement();
    });
  }
}

function openPostJobModal() {
  const modalOverlay = document.getElementById('postJobModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
    modalOverlay.classList.add('active');
  }
}

function closePostJobModal() {
  const modalOverlay = document.getElementById('postJobModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
    modalOverlay.classList.remove('active');
  }
}

/**
 * 12. Recruiter Skill Assessment Suite (Test Builder & Leaderboards)
 */
function initAssessmentSuite() {
  const openButtons = document.querySelectorAll('#topbarCreateTestBtn, #btnCreateTestTop, #btnOpenCreateTestSection, #btnSidebarCreateTest, #sidebarCreateTestBtn');
  const closeBtn = document.getElementById('closeCreateAssessmentModalBtn');
  const modalOverlay = document.getElementById('createAssessmentModalOverlay');
  const form = document.getElementById('createAssessmentForm');
  const testsContainer = document.getElementById('recruiterTestsContainer');

  const resultsModal = document.getElementById('testResultsModalOverlay');
  const closeResultsBtn = document.getElementById('closeTestResultsModalBtn');
  const resultsButtons = document.querySelectorAll('.btn-view-test-results');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCreateAssessmentModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCreateAssessmentModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCreateAssessmentModal();
    });
  }

  if (closeResultsBtn && resultsModal) {
    closeResultsBtn.addEventListener('click', () => {
      resultsModal.style.display = 'none';
      resultsModal.classList.remove('active');
    });
  }

  if (resultsModal) {
    resultsModal.addEventListener('click', (e) => {
      if (e.target === resultsModal) {
        resultsModal.style.display = 'none';
        resultsModal.classList.remove('active');
      }
    });
  }

  // Bind existing leaderboard buttons
  resultsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const testName = btn.getAttribute('data-test') || 'Assessment';
      const modalTitle = document.getElementById('testResultsModalTitle');
      if (modalTitle) modalTitle.textContent = `${testName} - Candidate Scores`;
      if (resultsModal) {
        resultsModal.style.display = 'flex';
        resultsModal.classList.add('active');
        showToast(`Loading verified leaderboard for '${testName}'...`, '📊');
      }
    });
  });

  // Bind Leaderboard Interview Schedule buttons inside testResultsModalOverlay
  const leaderboardScheduleButtons = document.querySelectorAll('#testResultsList .badge-tag');
  leaderboardScheduleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('div[style*="display: flex"]');
      const candidateInfo = row ? row.querySelector('div[style*="font-weight: 700"]')?.textContent : 'Student Candidate';
      const name = candidateInfo ? candidateInfo.split('•')[0].trim() : 'Candidate';
      if (resultsModal) resultsModal.style.display = 'none';
      openInviteInterviewModal(name, 'IIT Delhi • B.Tech CSE', '#LP-9482-SYS');
    });
  });

  // Handle Assessment Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('testTitleInput')?.value.trim();
      const category = document.getElementById('testCategoryInput')?.value || 'fullstack';
      const duration = document.getElementById('testDurationInput')?.value || '45 Mins';
      const cutoff = document.getElementById('testCutoffInput')?.value || '80';
      const batch = document.getElementById('testBatchInput')?.value || '2026 Batch';
      const skills = document.getElementById('testSkillsInput')?.value.trim() || 'Core Engineering';

      const newTest = {
        id: 'test_' + Date.now(),
        title,
        category,
        duration,
        cutoff: cutoff + '% Cutoff',
        batch,
        skills: skills.split(',').map(s => s.trim()),
        tested: '0 Tested',
        avgScore: '0%',
        qualified: '0 Qualified',
        createdAt: new Date().toISOString()
      };

      // Persist in localStorage for Student Dashboard live synchronization
      try {
        const savedTests = JSON.parse(localStorage.getItem('lp_recruiter_tests') || '[]');
        savedTests.unshift(newTest);
        localStorage.setItem('lp_recruiter_tests', JSON.stringify(savedTests));
      } catch (err) {}

      // Prepend to UI
      if (testsContainer) {
        const testCard = document.createElement('div');
        testCard.className = 'opportunity-card recruiter-test-card';
        testCard.setAttribute('data-category', category);
        testCard.innerHTML = `
          <div class="opportunity-header">
            <div class="opportunity-company-box">
              <div class="company-logo-avatar" style="background: rgba(6, 182, 212, 0.15); color: #38bdf8;">✨</div>
              <div class="company-details">
                <h4>${escapeHtml(title)}</h4>
                <span class="company-name">${escapeHtml(skills)} &bull; ${escapeHtml(batch)}</span>
              </div>
            </div>
            <span class="badge-tag badge-user">${escapeHtml(cutoff)}% Cutoff</span>
          </div>
          <div class="opportunity-tags">
            <span class="tag-pill">${escapeHtml(duration)}</span>
            <span class="tag-pill">Auto-Badge</span>
            <span class="tag-pill" style="color: #34d399;">Active Live</span>
          </div>
          <div class="recruiter-test-stats-row" style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 1px solid var(--border-subtle); margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-muted);">
            <span>👥 <strong>0</strong> Tested</span>
            <span>⭐ Avg: <strong>-</strong></span>
            <span style="color: #34d399;">🏆 <strong>0</strong> Qualified</span>
          </div>
          <div class="opportunity-footer">
            <button type="button" class="btn-apply-action btn-view-test-results" data-test="${escapeHtml(title)}" style="width: 100%; justify-content: center; background: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3);">
              View Candidate Scores & Leaderboard &rarr;
            </button>
          </div>
        `;

        testCard.querySelector('.btn-view-test-results').addEventListener('click', () => {
          const modalTitle = document.getElementById('testResultsModalTitle');
          if (modalTitle) modalTitle.textContent = `${title} - Candidate Scores`;
          if (resultsModal) {
            resultsModal.style.display = 'flex';
            resultsModal.classList.add('active');
          }
        });

        testsContainer.insertBefore(testCard, testsContainer.firstChild);
      }

      form.reset();
      closeCreateAssessmentModal();
      showToast(`Skill Assessment '${title}' published live for student cohorts!`, '🎯');
    });
  }
}

function openCreateAssessmentModal() {
  const modalOverlay = document.getElementById('createAssessmentModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
    modalOverlay.classList.add('active');
  }
}

function closeCreateAssessmentModal() {
  const modalOverlay = document.getElementById('createAssessmentModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
    modalOverlay.classList.remove('active');
  }
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
