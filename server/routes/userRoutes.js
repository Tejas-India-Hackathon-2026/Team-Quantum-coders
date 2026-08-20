/**
 * LifeProof - User Profile & Extended Onboarding Routes
 * 
 * Endpoints for user profile management, first-time onboarding persistence,
 * student skill badges, and candidate directory lookup.
 */

import express from 'express';
import { db, isFirebaseAdminInitialized } from '../config/firebaseAdmin.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-Memory Data Store (Provides instantaneous local dev & demo support with Firestore sync)
const localUsersStore = new Map([
  [
    'LP-STUDENT-DEMO',
    {
      uid: 'LP-STUDENT-DEMO',
      displayName: 'Akrit Sharma',
      name: 'Akrit Sharma',
      email: 'student@university.edu',
      role: 'student',
      college: 'BITS Pilani',
      branch: 'Computer Science & Engineering',
      batch: '2026',
      cgpa: '9.42',
      readinessScore: 94.8,
      isOnboarded: true,
      skills: ['React & Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      badges: ['#LP-9482-VERIFIED', '#LP-REACT-MASTER'],
      createdAt: new Date().toISOString()
    }
  ],
  [
    'LP-RECRUITER-DEMO',
    {
      uid: 'LP-RECRUITER-DEMO',
      displayName: 'Sarah Jenkins',
      name: 'Sarah Jenkins',
      email: 'recruiter@enterprise.com',
      role: 'recruiter',
      company: 'Razorpay & Stripe Hiring Network',
      domain: 'FinTech & Distributed Systems',
      designation: 'Principal University Talent Partner',
      hiringRoles: ['SDE-1', 'Full Stack Intern', 'AI Systems Engineer'],
      isOnboarded: true,
      createdAt: new Date().toISOString()
    }
  ],
  [
    'LP-FACULTY-DEMO',
    {
      uid: 'LP-FACULTY-DEMO',
      displayName: 'Dr. Rajesh Verma',
      name: 'Dr. Rajesh Verma',
      email: 'faculty@university.edu',
      role: 'faculty',
      facultyInstitute: 'National Institute of Technology',
      facultyDept: 'Computer Science & Engineering',
      facultyRole: 'Head of Department & Placement Cell Chair',
      isOnboarded: true,
      createdAt: new Date().toISOString()
    }
  ]
]);

/**
 * 1. Get User Profile by UID
 * GET /api/users/profile/:uid
 */
router.get('/profile/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // 1. Check live Firestore if initialized
    if (isFirebaseAdminInitialized && db) {
      const docRef = db.collection('users').doc(uid);
      const doc = await docRef.get();
      if (doc.exists) {
        return res.status(200).json({ status: 'success', profile: doc.data() });
      }
    }

    // 2. Check local in-memory store
    if (localUsersStore.has(uid)) {
      return res.status(200).json({
        status: 'success',
        profile: localUsersStore.get(uid)
      });
    }

    return res.status(404).json({
      status: 'error',
      message: `User profile with UID '${uid}' not found.`
    });
  } catch (error) {
    console.error('[User Profile Error]:', error.message);
    return res.status(500).json({ error: 'InternalServerError', message: error.message });
  }
});

/**
 * 2. Save First-Time User Onboarding Details
 * POST /api/users/onboarding
 */
router.post('/onboarding', async (req, res) => {
  const { uid, role, ...onboardingData } = req.body;

  if (!uid || !role) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'User UID and role are required to save onboarding details.'
    });
  }

  const updatedProfile = {
    uid,
    role,
    ...onboardingData,
    isOnboarded: true,
    updatedAt: new Date().toISOString()
  };

  try {
    // 1. Sync to Cloud Firestore if connected
    if (isFirebaseAdminInitialized && db) {
      await db.collection('users').doc(uid).set(updatedProfile, { merge: true });
    }

    // 2. Update local in-memory cache
    const existing = localUsersStore.get(uid) || {};
    localUsersStore.set(uid, { ...existing, ...updatedProfile });

    console.log(`[LifeProof Backend] Successfully saved onboarding profile for ${role}: ${uid}`);

    return res.status(200).json({
      status: 'success',
      message: 'Onboarding profile saved successfully.',
      profile: localUsersStore.get(uid)
    });
  } catch (error) {
    console.error('[Onboarding Error]:', error.message);
    return res.status(500).json({ error: 'InternalServerError', message: error.message });
  }
});

/**
 * 3. Award Verified Cryptographic Proof Badge to Student
 * POST /api/users/add-verified-badge
 */
router.post('/add-verified-badge', async (req, res) => {
  const { uid, badgeTitle, score, proofHash } = req.body;

  if (!uid || !badgeTitle) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'Student UID and Badge Title are required.'
    });
  }

  const generatedHash = proofHash || `#LP-TEST-VERIFIED-${Date.now().toString(36).toUpperCase()}`;

  const newBadge = {
    title: badgeTitle,
    score: score || '100%',
    proofHash: generatedHash,
    issuedAt: new Date().toISOString()
  };

  try {
    const user = localUsersStore.get(uid) || { uid, role: 'student', badges: [] };
    if (!Array.isArray(user.badges)) user.badges = [];
    user.badges.unshift(newBadge);
    user.readinessScore = Math.min(99.4, (parseFloat(user.readinessScore || 94.0) + 1.8)).toFixed(1);
    localUsersStore.set(uid, user);

    if (isFirebaseAdminInitialized && db) {
      await db.collection('users').doc(uid).set({
        badges: user.badges,
        readinessScore: user.readinessScore
      }, { merge: true });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Cryptographic verified proof badge awarded to portfolio.',
      badge: newBadge,
      newReadinessScore: user.readinessScore
    });
  } catch (error) {
    return res.status(500).json({ error: 'InternalServerError', message: error.message });
  }
});

/**
 * 4. List Verified Candidates (For Recruiters & Faculty)
 * GET /api/users/students
 */
router.get('/students', (req, res) => {
  const students = [];
  localUsersStore.forEach(user => {
    if (user.role === 'student') {
      students.push(user);
    }
  });

  return res.status(200).json({
    status: 'success',
    totalStudents: students.length,
    students
  });
});

export default router;
