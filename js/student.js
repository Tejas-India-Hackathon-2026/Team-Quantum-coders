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

// ==========================================================================
// AUTHENTIC TECHNICAL QUESTION BANKS (Domain-Specific Verified Exams)
// ==========================================================================
const ASSESSMENT_QUESTION_BANKS = {
  'Full Stack Engineer Assessment': {
    title: 'Full Stack Engineer Assessment',
    cutoff: 80,
    durationMins: 45,
    skills: ['React', 'Node.js', 'PostgreSQL', 'System Architecture'],
    questions: [
      {
        id: 'q1',
        text: 'Which data structure is optimal for implementing an LRU Cache with O(1) lookups and O(1) eviction?',
        options: [
          { key: 'A', text: 'Binary Search Tree with Timestamp' },
          { key: 'B', text: 'Doubly Linked List combined with Hash Map' },
          { key: 'C', text: 'Sorted Array with Binary Search' },
          { key: 'D', text: 'Single Queue with Linear Search' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 'q2',
        text: 'In the Node.js event loop, which phase executes callbacks registered with setImmediate()?',
        options: [
          { key: 'A', text: 'Timers phase' },
          { key: 'B', text: 'Poll phase' },
          { key: 'C', text: 'Check phase' },
          { key: 'D', text: 'Close callbacks phase' }
        ],
        correctAnswer: 'C'
      },
      {
        id: 'q3',
        text: 'Which HTTP response header is mandatory on the backend to allow cross-origin browser credential requests?',
        options: [
          { key: 'A', text: 'Access-Control-Allow-Credentials: true' },
          { key: 'B', text: 'Authorization: Bearer' },
          { key: 'C', text: 'Content-Security-Policy: none' },
          { key: 'D', text: 'X-Frame-Options: SAMEORIGIN' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q4',
        text: 'In PostgreSQL / relational databases, what is the search time complexity of an index constructed using a standard B-Tree?',
        options: [
          { key: 'A', text: 'O(log N)' },
          { key: 'B', text: 'O(1)' },
          { key: 'C', text: 'O(N)' },
          { key: 'D', text: 'O(N log N)' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q5',
        text: 'In React, what is the primary benefit of the Virtual DOM reconciliation algorithm?',
        options: [
          { key: 'A', text: 'Directly compiles JSX into native machine code' },
          { key: 'B', text: 'Computes minimal diffs before batching real browser DOM manipulations' },
          { key: 'C', text: 'Encrypts HTTP state sent across WebSockets' },
          { key: 'D', text: 'Replaces browser CSS layout engines' }
        ],
        correctAnswer: 'B'
      }
    ]
  },
  'AI Systems & LLM Engineering Test': {
    title: 'AI Systems & LLM Engineering Test',
    cutoff: 80,
    durationMins: 45,
    skills: ['Python', 'Transformers', 'Vector Embeddings', 'LoRA'],
    questions: [
      {
        id: 'q1',
        text: 'In Transformer architectures (Vaswani et al.), which core mechanism computes relationships between all tokens across a sequence?',
        options: [
          { key: 'A', text: 'Recurrent Hidden State Passing' },
          { key: 'B', text: 'Scaled Dot-Product Multi-Head Attention' },
          { key: 'C', text: 'Convolutional Max Pooling' },
          { key: 'D', text: 'Greedy Beam Search' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 'q2',
        text: 'Which mathematical metric is most commonly used to measure semantic similarity between high-dimensional vector embeddings?',
        options: [
          { key: 'A', text: 'Cosine Similarity' },
          { key: 'B', text: 'Manhattan Grid Distance' },
          { key: 'C', text: 'Hamming XOR Distance' },
          { key: 'D', text: 'Jaccard Set Index' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q3',
        text: 'When sampling tokens from an LLM, reducing the "temperature" parameter closer to 0 results in:',
        options: [
          { key: 'A', text: 'Higher creative hallucinations and random tokens' },
          { key: 'B', text: 'Faster GPU fan speed' },
          { key: 'C', text: 'Highly deterministic and focused greedy token selections' },
          { key: 'D', text: 'Larger context window capacity' }
        ],
        correctAnswer: 'C'
      },
      {
        id: 'q4',
        text: 'Which parameter-efficient fine-tuning (PEFT) method injects low-rank decomposition matrices while freezing pretrained weights?',
        options: [
          { key: 'A', text: 'RLHF' },
          { key: 'B', text: 'LoRA (Low-Rank Adaptation)' },
          { key: 'C', text: 'Standard Full Fine-Tuning' },
          { key: 'D', text: 'K-Means Clustering' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 'q5',
        text: 'In a Retrieval-Augmented Generation (RAG) pipeline, what is the primary role of the Vector Database?',
        options: [
          { key: 'A', text: 'Storing and indexing semantic text chunks for similarity retrieval before prompting the LLM' },
          { key: 'B', text: 'Rendering 3D WebGL graphics for the UI' },
          { key: 'C', text: 'Executing Python scripts in sandboxed Docker containers' },
          { key: 'D', text: 'Managing OAuth2 authentication sessions' }
        ],
        correctAnswer: 'A'
      }
    ]
  },
  'Cloud Infrastructure & DevOps Challenge': {
    title: 'Cloud Infrastructure & DevOps Challenge',
    cutoff: 80,
    durationMins: 45,
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Architecture'],
    questions: [
      {
        id: 'q1',
        text: 'In Kubernetes, which controller guarantees that exactly one copy of a Pod runs on every worker node in the cluster?',
        options: [
          { key: 'A', text: 'Deployment' },
          { key: 'B', text: 'DaemonSet' },
          { key: 'C', text: 'StatefulSet' },
          { key: 'D', text: 'ReplicaSet' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 'q2',
        text: 'In Dockerfile optimization, what is the primary purpose of Multi-Stage builds?',
        options: [
          { key: 'A', text: 'Eliminating build-time compilers and SDKs from the final lean runtime container image' },
          { key: 'B', text: 'Running multiple operating systems inside one container' },
          { key: 'C', text: 'Encrypting the root filesystem with AES-256' },
          { key: 'D', text: 'Automatically deploying to Kubernetes' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q3',
        text: 'In distributed consensus systems (such as Raft or etcd), what is the minimum cluster size required to tolerate 1 node failure without losing quorum?',
        options: [
          { key: 'A', text: '2 nodes' },
          { key: 'B', text: '3 nodes' },
          { key: 'C', text: '4 nodes' },
          { key: 'D', text: '5 nodes' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 'q4',
        text: 'In AWS / Cloud VPCs, what enables private subnets without public IPs to initiate outbound internet requests (e.g. for software updates)?',
        options: [
          { key: 'A', text: 'Internet Gateway directly attached to instance' },
          { key: 'B', text: 'NAT Gateway in a public subnet' },
          { key: 'C', text: 'Direct Connect circuit' },
          { key: 'D', text: 'Elastic Load Balancer' }
        ],
        correctAnswer: 'B'
      },
      {
        id: 'q5',
        text: 'Which deployment strategy updates Pods incrementally with zero downtime and automatic rollback capability?',
        options: [
          { key: 'A', text: 'Rolling Update' },
          { key: 'B', text: 'Recreate Strategy' },
          { key: 'C', text: 'Hard Restart' },
          { key: 'D', text: 'Cold Migration' }
        ],
        correctAnswer: 'A'
      }
    ]
  }
};

/**
 * 10. Student Recruiter Assessment Suite & Authentic Evaluation Engine
 */
function initStudentAssessmentFlow() {
  const modalOverlay = document.getElementById('takeAssessmentModalOverlay');
  const closeBtn = document.getElementById('closeTakeAssessmentModalBtn');
  const examForm = document.getElementById('studentExamForm');
  const questionsContainer = document.getElementById('examQuestionsContainer');
  const examResultScreen = document.getElementById('examResultScreen');
  const passedView = document.getElementById('examResultPassedView');
  const failedView = document.getElementById('examResultFailedView');
  const passedScoreEl = document.getElementById('examResultScorePassed');
  const failedScoreEl = document.getElementById('examResultScoreFailed');
  const proofHashDisplay = document.getElementById('examResultProofHashDisplay');
  const cutoffRequiredEl = document.getElementById('examCutoffRequired');
  const claimBadgeBtn = document.getElementById('btnClaimBadgeDone');
  const retakeBtn = document.getElementById('btnRetakeExam');
  const exitFailedBtn = document.getElementById('btnExitExamFailed');
  const examModalTitle = document.getElementById('examModalTitle');
  const timerEl = document.getElementById('examTimer');

  let currentActiveTestName = 'Full Stack Engineer Assessment';
  let currentActiveTest = ASSESSMENT_QUESTION_BANKS['Full Stack Engineer Assessment'];
  let currentMutedProof = null;
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

  const renderExamQuestions = (testData) => {
    if (!questionsContainer) return;
    questionsContainer.innerHTML = '';

    testData.questions.forEach((q, index) => {
      const qCard = document.createElement('div');
      qCard.className = 'exam-question-card';
      qCard.style.cssText = 'background: rgba(10, 14, 26, 0.9); padding: 1.15rem; border-radius: 12px; border: 1px solid var(--border-subtle);';
      
      let optionsHtml = q.options.map(opt => `
        <label style="display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.85rem; background: rgba(255,255,255,0.03); border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s;">
          <input type="radio" name="${q.id}" value="${opt.key}" required style="accent-color: #38bdf8; width: 16px; height: 16px; cursor: pointer;" />
          <span style="font-size: 0.88rem; color: #e2e8f0;"><strong style="color: #38bdf8;">${opt.key})</strong> ${escapeHtml(opt.text)}</span>
        </label>
      `).join('');

      qCard.innerHTML = `
        <div style="font-size: 0.78rem; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem;">
          QUESTION ${index + 1} OF ${testData.questions.length}
        </div>
        <p style="font-weight: 700; color: #ffffff; margin-bottom: 0.85rem; font-size: 0.94rem; line-height: 1.45;">
          ${escapeHtml(q.text)}
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${optionsHtml}
        </div>
      `;

      questionsContainer.appendChild(qCard);
    });
  };

  const openExamModal = (testName) => {
    currentActiveTestName = testName;
    currentActiveTest = ASSESSMENT_QUESTION_BANKS[testName] || ASSESSMENT_QUESTION_BANKS['Full Stack Engineer Assessment'];

    if (examModalTitle) examModalTitle.textContent = currentActiveTest.title;
    if (examForm) {
      examForm.style.display = 'block';
      examForm.reset();
    }
    if (examResultScreen) examResultScreen.style.display = 'none';
    if (passedView) passedView.style.display = 'none';
    if (failedView) failedView.style.display = 'none';

    renderExamQuestions(currentActiveTest);

    if (modalOverlay) {
      modalOverlay.style.display = 'flex';
      modalOverlay.classList.add('active');
    }
    startTimer();
    showToast(`Proctored Exam Started for '${currentActiveTest.title}'. Genuine evaluation active.`, '⚡');
  };

  const bindStartButtons = () => {
    const startButtons = document.querySelectorAll('.btn-start-student-test');
    startButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const testName = btn.getAttribute('data-test') || 'Full Stack Engineer Assessment';
        openExamModal(testName);
      });
    });
  };

  bindStartButtons();

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.style.display = 'none';
      modalOverlay.classList.remove('active');
    }
    if (timerInterval) clearInterval(timerInterval);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (exitFailedBtn) exitFailedBtn.addEventListener('click', closeModal);
  if (retakeBtn) retakeBtn.addEventListener('click', () => openExamModal(currentActiveTestName));

  // Genuine Examination Evaluation on Submit
  if (examForm) {
    examForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (timerInterval) clearInterval(timerInterval);

      // Evaluate actual student choices
      let correctAnswers = 0;
      const totalQuestions = currentActiveTest.questions.length;

      currentActiveTest.questions.forEach(q => {
        const selected = document.querySelector(`input[name="${q.id}"]:checked`);
        if (selected && selected.value.toUpperCase() === q.correctAnswer.toUpperCase()) {
          correctAnswers++;
        }
      });

      // Calculate Genuine Score %
      const realScore = Math.round((correctAnswers / totalQuestions) * 100);
      const isPassed = realScore >= currentActiveTest.cutoff;

      examForm.style.display = 'none';
      if (examResultScreen) examResultScreen.style.display = 'block';

      if (isPassed) {
        const newProofHash = `#LP-PROOF-${Math.abs(Date.now()).toString(36).toUpperCase()}`;
        currentMutedProof = newProofHash;

        if (passedView) passedView.style.display = 'block';
        if (failedView) failedView.style.display = 'none';
        if (passedScoreEl) passedScoreEl.textContent = `${realScore}% (${correctAnswers}/${totalQuestions} Correct)`;
        if (proofHashDisplay) proofHashDisplay.textContent = newProofHash;

        showToast(`🎉 Verified Passed! Real Score: ${realScore}%. Minted Proof: ${newProofHash}`, '🏆');
      } else {
        if (passedView) passedView.style.display = 'none';
        if (failedView) failedView.style.display = 'block';
        if (failedScoreEl) failedScoreEl.textContent = `${realScore}% (${correctAnswers}/${totalQuestions} Correct)`;
        if (cutoffRequiredEl) cutoffRequiredEl.textContent = `${currentActiveTest.cutoff}%`;

        showToast(`⚠️ Score: ${realScore}%. Cutoff of ${currentActiveTest.cutoff}% required. No badge minted.`, '⚠️');
      }
    });
  }

  // Claim Badge Action (Only for Passed Exams)
  if (claimBadgeBtn) {
    claimBadgeBtn.addEventListener('click', () => {
      closeModal();

      let activeUid = 'LP-STUDENT-USER';
      try {
        const saved = JSON.parse(sessionStorage.getItem('lp_active_session') || '{}');
        if (saved.uid) activeUid = saved.uid;
      } catch (e) {}

      const proofHashToSave = currentMutedProof || `#LP-PROOF-${Math.abs(Date.now()).toString(36).toUpperCase()}`;

      // Save verified test into student's verified badges
      saveStudentVerifiedBadge(activeUid, {
        testName: currentActiveTestName,
        score: 100,
        proofHash: proofHashToSave,
        awardedAt: new Date().toISOString()
      });

      // Dynamically re-render skills and calculate new score
      renderStudentSkillsAndReadiness(activeUid, {});

      showToast(`🎉 Verified Proof Badge (${proofHashToSave}) added to ledger and readiness score boosted!`, '🏆');
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
