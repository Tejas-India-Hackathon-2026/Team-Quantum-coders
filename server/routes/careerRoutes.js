/**
 * LifeProof - AI Career Path, Skill Gap & Talent Recommendation API
 * 
 * Provides automated skill gap analysis, role matching,
 * and market-driven competency recommendations.
 */

import express from 'express';
import { database } from '../config/db.js';
import auditLedger from '../services/auditLogger.js';

const router = express.Router();

// Benchmark Technical Roles Catalog
const BENCHMARK_ROLES = {
  stripe_backend: {
    id: 'stripe_backend',
    title: 'Senior Distributed Backend Engineer',
    company: 'Stripe',
    salary: '₹28 - 38 LPA',
    requiredSkills: [
      { name: 'Node.js & Distributed Express', category: 'Backend Systems', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'React & Next.js Architecture', category: 'Frontend Platform', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'Docker & Kubernetes Infrastructure', category: 'DevOps & Cloud', testMapped: 'Cloud Infrastructure & DevOps Challenge' }
    ]
  },
  google_ai: {
    id: 'google_ai',
    title: 'Google Cloud AI & LLM Systems Fellow',
    company: 'Google Cloud',
    salary: '₹28 - 36 LPA',
    requiredSkills: [
      { name: 'Python & Machine Learning', category: 'Artificial Intelligence', testMapped: 'AI Systems & LLM Engineering Test' },
      { name: 'Docker & Kubernetes Infrastructure', category: 'Cloud Infrastructure', testMapped: 'Cloud Infrastructure & DevOps Challenge' },
      { name: 'Cloud Firestore & Secure REST APIs', category: 'Data Architecture', testMapped: 'Cloud Infrastructure & DevOps Challenge' }
    ]
  },
  razorpay_fullstack: {
    id: 'razorpay_fullstack',
    title: 'Full Stack Systems SDE',
    company: 'Razorpay',
    salary: '₹20 - 30 LPA',
    requiredSkills: [
      { name: 'React & Next.js Architecture', category: 'Frontend', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'Node.js & Distributed Express', category: 'Backend Systems', testMapped: 'Full Stack Engineer Assessment' },
      { name: 'Cloud Firestore & Secure REST APIs', category: 'Cloud APIs', testMapped: 'Cloud Infrastructure & DevOps Challenge' }
    ]
  },
  microsoft_azure: {
    id: 'microsoft_azure',
    title: 'Cloud Infrastructure & Distributed Architect',
    company: 'Microsoft',
    salary: '₹26 - 34 LPA',
    requiredSkills: [
      { name: 'Docker & Kubernetes Infrastructure', category: 'Cloud Platform', testMapped: 'Cloud Infrastructure & DevOps Challenge' },
      { name: 'Cloud Firestore & Secure REST APIs', category: 'Distributed APIs', testMapped: 'Cloud Infrastructure & DevOps Challenge' },
      { name: 'Python & Machine Learning', category: 'Data & AI', testMapped: 'AI Systems & LLM Engineering Test' }
    ]
  }
};

/**
 * @route   GET /api/career/roles
 * @desc    Fetch all benchmark target roles with required competencies
 * @access  Public
 */
router.get('/roles', (req, res) => {
  return res.status(200).json({
    success: true,
    count: Object.keys(BENCHMARK_ROLES).length,
    roles: Object.values(BENCHMARK_ROLES)
  });
});

/**
 * @route   POST /api/career/skill-gap-analysis
 * @desc    Compute real-time AI skill gap between student verified proofs and target role
 * @access  Public / Authenticated
 */
router.post('/skill-gap-analysis', (req, res) => {
  try {
    const { studentUid, roleKey } = req.body;

    if (!studentUid) {
      return res.status(400).json({ success: false, message: 'studentUid is required.' });
    }

    const selectedKey = roleKey || 'stripe_backend';
    const targetRole = BENCHMARK_ROLES[selectedKey] || BENCHMARK_ROLES.stripe_backend;

    // Fetch student profile & verified badges
    const user = database.findById('users', studentUid, 'uid');
    const userBadges = database.find('badges', b => b.studentUid === studentUid);
    const passedTestNames = (userBadges || []).map(b => b.testTitle);

    const metSkills = [];
    const missingSkills = [];

    targetRole.requiredSkills.forEach(reqSkill => {
      const isMet = passedTestNames.some(tName => tName && tName.toLowerCase() === reqSkill.testMapped.toLowerCase());
      if (isMet) {
        const badge = userBadges.find(b => b.testTitle && b.testTitle.toLowerCase() === reqSkill.testMapped.toLowerCase());
        metSkills.push({
          ...reqSkill,
          verified: true,
          proofHash: badge ? badge.proofHash : '#LP-VERIFIED-PROOF',
          score: badge ? badge.score : 100
        });
      } else {
        missingSkills.push({
          ...reqSkill,
          verified: false,
          recommendedTest: reqSkill.testMapped,
          action: 'Test Required'
        });
      }
    });

    const totalRequired = targetRole.requiredSkills.length;
    const matchPercentage = Math.round((metSkills.length / totalRequired) * 100);

    // Record in Audit Ledger
    auditLedger.recordAudit('SKILL_GAP_EVALUATED', studentUid, {
      role: targetRole.title,
      matchPercentage,
      metCount: metSkills.length,
      missingCount: missingSkills.length
    });

    return res.status(200).json({
      success: true,
      studentUid,
      targetRole: {
        id: targetRole.id,
        title: targetRole.title,
        company: targetRole.company,
        salary: targetRole.salary
      },
      matchPercentage,
      status: matchPercentage === 100 ? 'FULLY_QUALIFIED' : matchPercentage > 0 ? 'PARTIAL_FIT' : 'UNQUALIFIED',
      metSkills,
      missingSkills,
      evaluatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to perform skill gap analysis',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/career/trending-skills
 * @desc    Aggregate most in-demand technical skills across current active job postings
 * @access  Public
 */
router.get('/trending-skills', (req, res) => {
  try {
    const jobs = database.getCollection('jobs');
    const skillCountMap = {};

    jobs.forEach(j => {
      if (Array.isArray(j.skills)) {
        j.skills.forEach(s => {
          const clean = s.trim();
          skillCountMap[clean] = (skillCountMap[clean] || 0) + 1;
        });
      }
    });

    const sorted = Object.entries(skillCountMap)
      .map(([skill, count]) => ({ skill, demandCount: count, demandPercentage: Math.round((count / jobs.length) * 100) }))
      .sort((a, b) => b.demandCount - a.demandCount);

    return res.status(200).json({
      success: true,
      totalActiveJobs: jobs.length,
      trendingSkills: sorted
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
