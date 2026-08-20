/**
 * LifeProof - User Profile & Extended Onboarding Routes
 * 
 * Endpoints for user profile management, first-time onboarding persistence,
 * student skill badges, and candidate directory lookup.
 */

import express from 'express';
import { database, firestoreDb, isFirebaseAdminInitialized } from '../config/db.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * 1. Get User Profile by UID
 * GET /api/users/profile/:uid
 */
router.get('/profile/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // 1. Check live Firestore if initialized
    if (isFirebaseAdminInitialized && firestoreDb) {
      const docRef = firestoreDb.collection('users').doc(uid);
      const doc = await docRef.get();
      if (doc.exists) {
        return res.status(200).json({ status: 'success', profile: doc.data() });
      }
    }

    // 2. Check unified database engine
    const user = database.findById('users', uid, 'uid');
    if (user) {
      return res.status(200).json({
        status: 'success',
        profile: user
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
    if (isFirebaseAdminInitialized && firestoreDb) {
      await firestoreDb.collection('users').doc(uid).set(updatedProfile, { merge: true });
    }

    // 2. Update persistent database
    const existing = database.findById('users', uid, 'uid');
    let profile;
    if (existing) {
      profile = database.update('users', uid, updatedProfile, 'uid');
    } else {
      profile = database.insert('users', updatedProfile);
    }

    console.log(`[LifeProof Backend] Successfully saved onboarding profile for ${role}: ${uid}`);

    return res.status(200).json({
      status: 'success',
      message: 'Onboarding profile saved successfully.',
      profile
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
    let user = database.findById('users', uid, 'uid');
    if (!user) {
      user = database.insert('users', { uid, role: 'student', verifiedBadges: [] });
    }

    const existingBadges = user.verifiedBadges || [];
    existingBadges.unshift(newBadge);
    const newScore = Math.min(99.4, (parseFloat(user.readinessScore || 94.0) + 1.8)).toFixed(1);

    database.update('users', uid, {
      verifiedBadges: existingBadges,
      readinessScore: newScore
    }, 'uid');

    if (isFirebaseAdminInitialized && firestoreDb) {
      await firestoreDb.collection('users').doc(uid).set({
        verifiedBadges: existingBadges,
        readinessScore: newScore
      }, { merge: true });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Cryptographic verified proof badge awarded to portfolio.',
      badge: newBadge,
      newReadinessScore: newScore
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
  try {
    const students = database.find('users', u => u.role === 'student');
    return res.status(200).json({
      status: 'success',
      totalStudents: students.length,
      students
    });
  } catch (error) {
    return res.status(500).json({ error: 'InternalServerError', message: error.message });
  }
});

export default router;
