/**
 * LifeProof - Enterprise Jobs, Internships & Application Tracking Routes
 * 
 * Endpoints for job listings, recruiter job posting, and student application pipelines.
 */

import express from 'express';
import { db, isFirebaseAdminInitialized } from '../config/firebaseAdmin.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-Memory Live Jobs Store with Firestore sync
const initialJobs = [
  {
    id: 'job_101',
    title: 'Senior Distributed Backend Engineer',
    company: 'Stripe',
    logo: '💳',
    location: 'Bengaluru (Hybrid)',
    type: 'Full-Time SDE',
    salary: '₹28 - 38 LPA',
    batch: '2025 & 2026 Batch',
    skills: ['Go', 'Node.js', 'PostgreSQL', 'Distributed Systems', 'Redis'],
    matchScore: '98% Match',
    postedAt: '2 days ago',
    applicantsCount: 42,
    status: 'active'
  },
  {
    id: 'job_102',
    title: 'Full Stack Frontend Architect',
    company: 'Microsoft',
    logo: '💻',
    location: 'Hyderabad (On-Site)',
    type: 'Full-Time SDE',
    salary: '₹26 - 34 LPA',
    batch: '2026 Batch',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'GraphQL'],
    matchScore: '96% Match',
    postedAt: '1 day ago',
    applicantsCount: 68,
    status: 'active'
  },
  {
    id: 'job_103',
    title: 'High-Throughput FinTech Intern',
    company: 'Razorpay',
    logo: '⚡',
    location: 'Bengaluru / Remote',
    type: '6-Month Internship',
    salary: '₹65,000 / month',
    batch: '2026 & 2027 Batch',
    skills: ['Node.js', 'Python', 'AWS', 'Docker', 'REST APIs'],
    matchScore: '94% Match',
    postedAt: 'Just now',
    applicantsCount: 115,
    status: 'active'
  },
  {
    id: 'job_104',
    title: 'Cloud Infrastructure & SRE Engineer',
    company: 'Google Cloud Partner',
    logo: '🌐',
    location: 'Gurugram (Hybrid)',
    type: 'Full-Time SDE',
    salary: '₹30 - 42 LPA',
    batch: '2025 & 2026 Batch',
    skills: ['Kubernetes', 'Terraform', 'GCP', 'CI/CD', 'Prometheus'],
    matchScore: '92% Match',
    postedAt: '3 days ago',
    applicantsCount: 37,
    status: 'active'
  }
];

const jobsStore = new Map(initialJobs.map(j => [j.id, j]));
const applicationsStore = new Map(); // key: studentUid, value: array of applications

/**
 * 1. List All Active Jobs & Opportunities
 * GET /api/jobs
 */
router.get('/', (req, res) => {
  const { search, type } = req.query;
  let list = Array.from(jobsStore.values());

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(j => 
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (type) {
    list = list.filter(j => j.type.toLowerCase().includes(type.toLowerCase()));
  }

  return res.status(200).json({
    status: 'success',
    totalJobs: list.length,
    jobs: list
  });
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

  jobsStore.set(newJob.id, newJob);

  if (isFirebaseAdminInitialized && db) {
    try {
      await db.collection('jobs').doc(newJob.id).set(newJob);
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

  const job = jobsStore.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'NotFound', message: 'Job not found.' });
  }

  // Increment applicant count
  job.applicantsCount = (job.applicantsCount || 0) + 1;
  jobsStore.set(jobId, job);

  const application = {
    applicationId: 'app_' + Date.now(),
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

  const studentApps = applicationsStore.get(studentUid) || [];
  studentApps.unshift(application);
  applicationsStore.set(studentUid, studentApps);

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
  const { studentUid } = req.params;
  const apps = applicationsStore.get(studentUid) || [];

  return res.status(200).json({
    status: 'success',
    totalApplications: apps.length,
    applications: apps
  });
});

export default router;
