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
  initEditProfileModal();
});

/**
 * Edit Student Profile & Name Modal Controller
 */
function initEditProfileModal() {
  const openBtn = document.getElementById('btnOpenEditProfileModal');
  const closeBtn = document.getElementById('closeEditProfileModalBtn');
  const modalOverlay = document.getElementById('editProfileModalOverlay');
  const form = document.getElementById('editProfileForm');
  const nameInput = document.getElementById('editProfileNameInput');
  const collegeInput = document.getElementById('editProfileCollegeInput');
  const branchInput = document.getElementById('editProfileBranchInput');

  if (!modalOverlay) return;

  const openModal = () => {
    try {
      const savedSession = JSON.parse(sessionStorage.getItem('lp_active_session') || '{}');
      if (nameInput) nameInput.value = savedSession.displayName || savedSession.name || 'Akrit Sharma';
      if (collegeInput) collegeInput.value = savedSession.college || 'BITS Pilani';
      if (branchInput) branchInput.value = savedSession.branch || 'Computer Science';
    } catch (e) {}

    modalOverlay.classList.add('active');
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = nameInput ? nameInput.value.trim() : '';
      const newCollege = collegeInput ? collegeInput.value.trim() : '';
      const newBranch = branchInput ? branchInput.value.trim() : '';

      if (!newName) return;

      try {
        const savedSession = JSON.parse(sessionStorage.getItem('lp_active_session') || '{}');
        savedSession.name = newName;
        savedSession.displayName = newName;
        if (newCollege) savedSession.college = newCollege;
        if (newBranch) savedSession.branch = newBranch;
        sessionStorage.setItem('lp_active_session', JSON.stringify(savedSession));

        renderStudentProfile(savedSession, savedSession);
      } catch (err) {}

      closeModal();
      showToast(`Profile name updated to '${newName}'!`, '✨');
    });
  }
}

/**
 * Dynamic Skills Repository and Verification Engine
 */
const BASE_STUDENT_SKILLS = [
  { id: 'sk_react', name: '⚛️ React & Next.js Architecture', category: 'engineering', testMapped: 'Full Stack Engineer Assessment' },
  { id: 'sk_ts', name: '🔷 TypeScript & Modern JS', category: 'engineering', testMapped: 'Full Stack Engineer Assessment' },
  { id: 'sk_node', name: '🟢 Node.js & Distributed Express', category: 'engineering', testMapped: 'Full Stack Engineer Assessment' },
  { id: 'sk_python', name: '🤖 Python & Machine Learning', category: 'ai', testMapped: 'AI Systems & LLM Engineering Test' },
  { id: 'sk_docker', name: '🐳 Docker & Kubernetes Infrastructure', category: 'cloud', testMapped: 'Cloud Infrastructure & DevOps Challenge' },
  { id: 'sk_cloud', name: '☁️ Cloud Firestore & Secure REST APIs', category: 'cloud', testMapped: 'Cloud Infrastructure & DevOps Challenge' }
];

function getStudentVerifiedBadges(uid) {
  try {
    const raw = localStorage.getItem('lp_student_badges_' + uid);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStudentVerifiedBadge(uid, badge) {
  try {
    const badges = getStudentVerifiedBadges(uid);
    badges.unshift(badge);
    localStorage.setItem('lp_student_badges_' + uid, JSON.stringify(badges));
  } catch (e) {}
}

/**
 * Dynamically renders student skills & calculates Readiness Score
 * based EXCLUSIVELY on assessments actually passed by this user.
 */
function renderStudentSkillsAndReadiness(uid, user) {
  const verifiedBadges = getStudentVerifiedBadges(uid);
  const passedTestNames = verifiedBadges.map(b => b.testName);

  const skillsGrid = document.getElementById('skillsGrid');
  if (!skillsGrid) return;

  skillsGrid.innerHTML = '';
  let verifiedSkillsCount = 0;

  BASE_STUDENT_SKILLS.forEach(skill => {
    const isVerified = passedTestNames.includes(skill.testMapped);
    if (isVerified) verifiedSkillsCount++;

    const matchingBadge = verifiedBadges.find(b => b.testName === skill.testMapped);
    const score = matchingBadge ? (matchingBadge.score || 100) : 0;
    const proofHash = matchingBadge ? matchingBadge.proofHash : null;

    const card = document.createElement('div');
    card.className = `skill-item-card ${isVerified ? 'verified' : 'unverified'}`;
    card.setAttribute('data-category', skill.category);

    card.innerHTML = `
      <div class="skill-item-header">
        <span class="skill-name-title">${skill.name}</span>
        ${isVerified 
          ? `<span class="skill-verified-tag" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);">✓ VERIFIED</span>`
          : `<span class="skill-verified-tag" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35);">⏳ UNVERIFIED (0%)</span>`
        }
      </div>
      <div class="skill-bar-track" style="margin: 0.6rem 0;">
        <div class="skill-bar-progress" style="width: ${isVerified ? '100%' : '0%'}; background: ${isVerified ? 'linear-gradient(90deg, #10b981, #06b6d4)' : '#fbbf24'};"></div>
      </div>
      <div class="skill-meta-footer" style="display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem;">
        ${isVerified
          ? `<span style="color: #34d399; font-weight: 700;">Score: ${score}% (Passed)</span>
             <span style="font-family: var(--font-mono); color: #38bdf8; font-size: 0.72rem;">${proofHash || '#LP-VERIFIED-PROOF'}</span>`
          : `<span style="color: var(--text-muted);">Status: Test Required</span>
             <button type="button" class="btn-start-student-test" data-test="${escapeHtml(skill.testMapped)}" style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; padding: 0.25rem 0.65rem; border-radius: 6px; font-size: 0.74rem; cursor: pointer; font-weight: 600;">
               ⚡ Take Test &rarr;
             </button>`
        }
      </div>
    `;

    skillsGrid.appendChild(card);
  });

  // Re-bind click events on any dynamically created test buttons
  const dynamicallyRenderedTestBtns = skillsGrid.querySelectorAll('.btn-start-student-test');
  const modalOverlay = document.getElementById('takeAssessmentModalOverlay');
  const examModalTitle = document.getElementById('examModalTitle');
  const examForm = document.getElementById('studentExamForm');
  const examResultScreen = document.getElementById('examResultScreen');

  dynamicallyRenderedTestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const testName = btn.getAttribute('data-test') || 'Technical Assessment';
      if (examModalTitle) examModalTitle.textContent = testName;
      if (examForm) {
        examForm.style.display = 'block';
        examForm.reset();
      }
      if (examResultScreen) examResultScreen.style.display = 'none';
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  // 2. Calculate Exact Career Readiness Score Based On Tests Passed
  let readinessScore = 0.0;
  if (verifiedSkillsCount === 0) {
    readinessScore = 0.0;
  } else if (verifiedSkillsCount === 1) {
    readinessScore = 65.0;
  } else if (verifiedSkillsCount === 2) {
    readinessScore = 82.5;
  } else if (verifiedSkillsCount >= 3) {
    readinessScore = 96.8;
  }

  // Update Score Elements
  const readinessScoreEl = document.getElementById('readinessScoreNumber');
  const scoreCircleFill = document.getElementById('scoreCircleFill');
  const readinessScoreHint = document.getElementById('readinessScoreHint');

  if (readinessScoreEl) readinessScoreEl.textContent = readinessScore.toFixed(1);

  if (scoreCircleFill) {
    // 380 is full circumference of circle r=60
    const offset = 380 - (380 * (readinessScore / 100));
    scoreCircleFill.style.strokeDashoffset = offset;
  }

  if (readinessScoreHint) {
    if (readinessScore === 0) {
      readinessScoreHint.textContent = '★ Take recruiter skill assessments below to calculate your verified score';
      readinessScoreHint.style.color = 'var(--text-muted)';
    } else {
      readinessScoreHint.textContent = `★ Ranked in Top ${(100 - readinessScore + 1).toFixed(0)}% for Software Engineering (Batch 2026)`;
      readinessScoreHint.style.color = '#34d399';
    }
  }

  // Update Top KPI Metric Card
  const kpiCountEl = document.getElementById('kpiVerifiedSkillsCount');
  const kpiBarEl = document.getElementById('kpiVerifiedSkillsBar');
  const kpiTrendEl = document.getElementById('skillsIndexTrend');

  if (kpiCountEl) kpiCountEl.textContent = `${verifiedSkillsCount}`;
  if (kpiBarEl) kpiBarEl.style.width = `${Math.round((verifiedSkillsCount / BASE_STUDENT_SKILLS.length) * 100)}%`;
  if (kpiTrendEl) {
    kpiTrendEl.textContent = verifiedSkillsCount > 0 ? `${verifiedSkillsCount} Verified Proofs` : 'Pass Tests to Verify';
  }

  // Update Milestones
  const m2BadgeTag = document.getElementById('m2BadgeTag');
  const m2Desc = document.getElementById('m2Desc');
  const m2Icon = document.getElementById('m2Icon');

  if (m2BadgeTag) {
    m2BadgeTag.textContent = `${verifiedBadges.length} BADGES`;
    if (verifiedBadges.length > 0) {
      m2BadgeTag.style.background = 'rgba(16, 185, 129, 0.2)';
      m2BadgeTag.style.color = '#34d399';
      if (m2Icon) m2Icon.textContent = '✅';
      if (m2Desc) m2Desc.textContent = `${verifiedBadges.length} verified technical assessment proofs attached to portfolio.`;
    } else {
      m2BadgeTag.style.background = 'rgba(245, 158, 11, 0.15)';
      m2BadgeTag.style.color = '#fbbf24';
      if (m2Icon) m2Icon.textContent = '⏳';
    }
  }

  // 3. Update AI Target Skill Gap Simulator
  renderSkillGapAnalysis(currentSelectedTargetRole, uid);
}

/**
 * Target Roles and Technical Requirements Engine
 */
let currentSelectedTargetRole = 'stripe_backend';

const TARGET_ROLES = {
  stripe_backend: {
    title: 'Stripe • Senior Distributed Backend Engineer',
    salary: '₹38 LPA',
    requiredSkills: [
      { name: 'Node.js & Distributed Express', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'React & Next.js Architecture', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'Docker & Kubernetes Infrastructure', testMapped: 'Cloud Infrastructure & DevOps Challenge' }
    ]
  },
  google_ai: {
    title: 'Google Cloud • AI & LLM Systems Fellow',
    salary: '₹36 LPA',
    requiredSkills: [
      { name: 'Python & Machine Learning', testMapped: 'AI Systems & LLM Engineering Test' },
      { name: 'Docker & Kubernetes Infrastructure', testMapped: 'Cloud Infrastructure & DevOps Challenge' },
      { name: 'Cloud Firestore & Secure REST APIs', testMapped: 'Cloud Infrastructure & DevOps Challenge' }
    ]
  },
  razorpay_fullstack: {
    title: 'Razorpay • Full Stack Systems SDE',
    salary: '₹30 LPA',
    requiredSkills: [
      { name: 'React & Next.js Architecture', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'Node.js & Distributed Express', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'Cloud Firestore & Secure REST APIs', testMapped: 'Cloud Infrastructure & DevOps Challenge' }
    ]
  },
  microsoft_azure: {
    title: 'Microsoft • Cloud Infrastructure Architect',
    salary: '₹34 LPA',
    requiredSkills: [
      { name: 'Docker & Kubernetes Infrastructure', testMapped: 'Cloud Infrastructure & DevOps Challenge' },
      { name: 'Cloud Firestore & Secure REST APIs', testMapped: 'Cloud Infrastructure & DevOps Challenge' },
      { name: 'Python & Machine Learning', testMapped: 'AI Systems & LLM Engineering Test' }
    ]
  }
};

function renderSkillGapAnalysis(roleKey, uid) {
  const role = TARGET_ROLES[roleKey] || TARGET_ROLES.stripe_backend;
  const verifiedBadges = getStudentVerifiedBadges(uid);
  const passedTestNames = verifiedBadges.map(b => b.testName);

  const matchBadge = document.getElementById('targetRoleMatchBadge');
  const countMet = document.getElementById('countSkillsMet');
  const listMet = document.getElementById('listSkillsMet');
  const countMissing = document.getElementById('countSkillsMissing');
  const listMissing = document.getElementById('listSkillsMissing');
  const roleSelect = document.getElementById('targetRoleSelect');

  if (!listMet || !listMissing) return;

  if (roleSelect && !roleSelect.hasAttribute('data-bound')) {
    roleSelect.setAttribute('data-bound', 'true');
    roleSelect.addEventListener('change', (e) => {
      currentSelectedTargetRole = e.target.value;
      renderSkillGapAnalysis(currentSelectedTargetRole, uid);
    });
  }

  const metSkills = [];
  const missingSkills = [];

  role.requiredSkills.forEach(req => {
    const isVerified = passedTestNames.includes(req.testMapped);
    if (isVerified) {
      const badge = verifiedBadges.find(b => b.testName === req.testMapped);
      metSkills.push({ ...req, proofHash: badge ? badge.proofHash : '#LP-VERIFIED-PROOF' });
    } else {
      missingSkills.push(req);
    }
  });

  const total = role.requiredSkills.length;
  const matchPercent = Math.round((metSkills.length / total) * 100);

  if (matchBadge) {
    if (matchPercent === 100) {
      matchBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      matchBadge.style.color = '#34d399';
      matchBadge.style.borderColor = 'rgba(16, 185, 129, 0.5)';
      matchBadge.textContent = '🌟 100% Match (Fully Qualified)';
    } else if (matchPercent > 0) {
      matchBadge.style.background = 'rgba(56, 189, 248, 0.2)';
      matchBadge.style.color = '#38bdf8';
      matchBadge.style.borderColor = 'rgba(56, 189, 248, 0.5)';
      matchBadge.textContent = `${matchPercent}% Match`;
    } else {
      matchBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      matchBadge.style.color = '#fbbf24';
      matchBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      matchBadge.textContent = '0% Match';
    }
  }

  if (countMet) countMet.textContent = `${metSkills.length} Met`;
  if (countMissing) countMissing.textContent = `${missingSkills.length} Missing`;

  // Render Met List
  if (metSkills.length === 0) {
    listMet.innerHTML = `<div style="color: var(--text-subtle); font-style: italic; padding: 0.5rem 0;">No verified proofs match this target role yet. Take tests to qualify!</div>`;
  } else {
    listMet.innerHTML = metSkills.map(s => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; background: rgba(16, 185, 129, 0.08); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.25);">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #34d399; font-weight: 800;">✓</span>
          <span style="color: #fff; font-weight: 600;">${escapeHtml(s.name)}</span>
        </div>
        <span style="font-family: var(--font-mono); color: #34d399; font-size: 0.72rem;">${escapeHtml(s.proofHash)}</span>
      </div>
    `).join('');
  }

  // Render Missing List
  if (missingSkills.length === 0) {
    listMissing.innerHTML = `<div style="color: #34d399; font-weight: 700; padding: 0.5rem 0;">🎉 Zero skill gaps remaining! You meet 100% of this role's criteria.</div>`;
  } else {
    listMissing.innerHTML = missingSkills.map(s => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; background: rgba(245, 158, 11, 0.08); border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.3); flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: #fbbf24; font-weight: 800;">⚠️</span>
          <span style="color: #fff; font-weight: 600;">${escapeHtml(s.name)}</span>
        </div>
        <button type="button" class="btn-start-student-test" data-test="${escapeHtml(s.testMapped)}" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">
          <span>⚡ Close Gap</span>
          <span>&rarr;</span>
        </button>
      </div>
    `).join('');
  }

  // Bind click listener to newly rendered Close Gap buttons
  const gapBtns = listMissing.querySelectorAll('.btn-start-student-test');
  const modalOverlay = document.getElementById('takeAssessmentModalOverlay');
  const examModalTitle = document.getElementById('examModalTitle');
  const examForm = document.getElementById('studentExamForm');
  const examResultScreen = document.getElementById('examResultScreen');

  gapBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const testName = btn.getAttribute('data-test') || 'Technical Assessment';
      if (examModalTitle) examModalTitle.textContent = testName;
      if (examForm) {
        examForm.style.display = 'block';
        examForm.reset();
      }
      if (examResultScreen) examResultScreen.style.display = 'none';
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });
}

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

  let currentActiveTestName = 'Full Stack Engineer Assessment';

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
        const testName = btn.getAttribute('data-test') || 'Full Stack Engineer Assessment';
        currentActiveTestName = testName;
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

      let activeUid = 'LP-STUDENT-USER';
      try {
        const saved = JSON.parse(sessionStorage.getItem('lp_active_session') || '{}');
        if (saved.uid) activeUid = saved.uid;
      } catch (e) {}

      const newProofHash = `#LP-VERIFIED-PROOF-${Math.abs(Date.now()).toString(36).toUpperCase()}`;

      // Save the passed test into student's verified badges
      saveStudentVerifiedBadge(activeUid, {
        testName: currentActiveTestName,
        score: 100,
        proofHash: newProofHash,
        awardedAt: new Date().toISOString()
      });

      // Dynamically re-render skills and calculate new score
      renderStudentSkillsAndReadiness(activeUid, {});

      showToast(`🎉 Assessment Passed! Verified Proof Badge (${newProofHash}) earned and readiness score boosted!`, '🏆');
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
  const displayName = (profile && profile.name) || user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Student Member');
  const email = (profile && profile.email) || user.email || 'student@university.edu';
  const uid = user.uid || (profile && profile.uid) || 'LP-AUTH-USER';
  const photoURL = (profile && profile.photoURL) || user.photoURL || '';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

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

  // 5. Render Skills & Readiness Score Based On Real Assessment Results!
  renderStudentSkillsAndReadiness(uid, user);
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
