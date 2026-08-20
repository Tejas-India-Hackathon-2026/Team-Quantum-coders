/**
 * LifeProof - Authentication Routes
 * 
 * Endpoints for session verification, user identity, and token checks.
 */

import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Check & Normalize Authenticated Session
 * POST /api/auth/session-check
 */
router.post('/session-check', (req, res) => {
  const { user, role } = req.body;

  if (!user || !user.email) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'User details (email) required for session check.'
    });
  }

  const normalizedRole = ['student', 'recruiter', 'faculty'].includes(role) ? role : 'student';

  return res.status(200).json({
    status: 'success',
    authenticated: true,
    user: {
      uid: user.uid || 'LP-' + Date.now().toString(36).toUpperCase(),
      email: user.email,
      name: user.name || user.displayName || 'LifeProof Member',
      photoURL: user.photoURL || '',
      role: normalizedRole
    },
    permissions: {
      canTakeAssessments: normalizedRole === 'student',
      canPostJobs: normalizedRole === 'recruiter',
      canCreateAssessments: normalizedRole === 'recruiter',
      canViewTelemetry: normalizedRole === 'faculty'
    }
  });
});

/**
 * Get Current User (Protected)
 * GET /api/auth/me
 */
router.get('/me', verifyToken, (req, res) => {
  return res.status(200).json({
    status: 'success',
    user: req.user
  });
});

/**
 * Logout Endpoint
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Session successfully terminated on LifeProof API server.'
  });
});

export default router;
