/**
 * LifeProof - Enterprise Jobs, Internships & Application Tracking Routes
 * 
 * Endpoints for job listings, recruiter job posting, and student application pipelines.
 */

import express from 'express';
import { database, firestoreDb, isFirebaseAdminInitialized } from '../config/db.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * 1. List All Active Jobs & Opportunities
 * GET /api/jobs
 */
router.get('/', (req, res) => {
  try {
    const { search, type } = req.query;
    let list = database.getCollection('jobs');

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(j => 
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company && j.company.toLowerCase().includes(q)) ||
        (Array.isArray(j.skills) && j.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    if (type) {
      list = list.filter(j => j.type && j.type.toLowerCase().includes(type.toLowerCase()));
    }

    return res.status(200).json({
      status: 'success',
      totalJobs: list.length,
      jobs: list
    });
  } catch (error) {
    return res.status(500).json({ error: 'InternalServerError', message: error.message });
  }
});

/**
 * 2. Post New Job (Recruiter Action)
 * POST /api/jobs/create
 */
router.post('/create', async (req, res) => {
  const { title, location, salary, skills, company, batch, type } = req.body;

  if (!title || !skills) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'Job title and required skills are required fields.'
    });
  }

  const newJob = {
    id: 'job_' + Date.now(),
    title,
    company: company || 'Enterprise Hiring Partner',
    logo: '🚀',
    location: location || 'Bengaluru (Hybrid)',
    type: type || 'Full-Time SDE',
    salary: salary || 'Competitive Package',
    batch: batch || '2026 Batch',
    skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
    matchScore: '95% Match',
    postedAt: 'Just now',
    applicantsCount: 0,
    status: 'active'
  };

  database.insert('jobs', newJob);

  if (isFirebaseAdminInitialized && firestoreDb) {
    try {
      await firestoreDb.collection('jobs').doc(newJob.id).set(newJob);
    } catch (e) {}
  }

  return res.status(201).json({
    status: 'success',
    message: 'Job posting published to LifeProof university network.',
    job: newJob
  });
});

/**
 * 3. Apply to a Job (Student Action)
 * POST /api/jobs/apply
 */
router.post('/apply', (req, res) => {
  const { jobId, studentUid, studentName, studentEmail, proofHash } = req.body;

  if (!jobId || !studentUid) {
    return res.status(400).json({
      error: 'BadRequest',
      message: 'Job ID and Student UID are required.'
    });
  }

  const job = database.findById('jobs', jobId);
  if (!job) {
    return res.status(404).json({ error: 'NotFound', message: 'Job not found.' });
  }

  // Increment applicant count in DB
  const newApplicantsCount = (job.applicantsCount || 0) + 1;
  database.update('jobs', jobId, { applicantsCount: newApplicantsCount });

  const application = {
    id: 'app_' + Date.now(),
    jobId,
    jobTitle: job.title,
    company: job.company,
    salary: job.salary,
    studentUid,
    studentName: studentName || 'LifeProof Student',
    studentEmail: studentEmail || 'student@university.edu',
    proofHash: proofHash || '#LP-9482-VERIFIED',
    appliedAt: new Date().toISOString(),
    status: 'Under Recruiter Review'
  };

  database.insert('applications', application);

  return res.status(200).json({
    status: 'success',
    message: `Application submitted successfully for ${job.title} at ${job.company}!`,
    application
  });
});

/**
 * 4. Get Student Applications
 * GET /api/jobs/my-applications/:studentUid
 */
router.get('/my-applications/:studentUid', (req, res) => {
  try {
    const { studentUid } = req.params;
    const apps = database.find('applications', a => a.studentUid === studentUid);

    return res.status(200).json({
      status: 'success',
      totalApplications: apps.length,
      applications: apps
    });
  } catch (error) {
    return res.status(500).json({ error: 'InternalServerError', message: error.message });
  }
});

export default router;
