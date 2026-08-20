/**
 * LifeProof - Intelligent University & Career Platform
 * Main Backend API Server (Node.js & Express)
 * 
 * Step 1: Base Server Architecture, Middleware & Healthcheck
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

import { database } from './config/db.js';
import auditLedger from './services/auditLogger.js';

// Load environment configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================================================
// 1. GLOBAL MIDDLEWARE SETUP
// ==========================================================================

// Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*', // Allows local dev frontend & preview servers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-email', 'x-user-name']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware (Development)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[LifeProof Backend] ${timestamp} | ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================================================
// 2. API ROUTES MOUNTING
// ==========================================================================

// Authentication & Session Routes
app.use('/api/auth', authRoutes);

// User Profile & Onboarding Routes
app.use('/api/users', userRoutes);

// Enterprise Jobs & Applications Routes
app.use('/api/jobs', jobRoutes);

// Recruiter Skill Assessments & Exam Verification Routes
app.use('/api/assessments', assessmentRoutes);

// Faculty Academic Intelligence & NAAC/NIRF Telemetry Routes
app.use('/api/faculty', facultyRoutes);

// AI Resume Parser & ATS Optimization Routes
app.use('/api/resume', resumeRoutes);

// Step 8: Public Cryptographic Proof Verification & Badge Lookup API
app.use('/api/badges', badgeRoutes);

// Step 9: AI Career Path, Skill Gap & Talent Matching API
app.use('/api/career', careerRoutes);

// Step 10: Immutable Cryptographic Audit Ledger API
app.use('/api/audit', auditRoutes);

/**
 * Database & Ledger Telemetry Endpoint
 * GET /api/database/status
 */
app.get('/api/database/status', (req, res) => {
  const stats = database.getStats();
  const auditStats = auditLedger.getStats();
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    database: stats,
    auditLedger: auditStats
  });
});

/**
 * Healthcheck & Telemetry Endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'LifeProof Career & University Ecosystem API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    features: {
      auth: 'Modular RBAC (Student, Recruiter, Faculty)',
      assessments: 'Recruiter Custom Test Engine & Proof Badges',
      telemetry: 'Real-time Career Readiness Analytics'
    }
  });
});

/**
 * Root Welcome Route
 * GET /
 */
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>LifeProof API Server</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b0f19; color: #f3f4f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 16px; text-align: center; max-width: 480px; }
        h1 { color: #38bdf8; margin-bottom: 0.5rem; }
        p { color: #9ca3af; font-size: 0.95rem; }
        .badge { display: inline-block; background: rgba(16,185,129,0.2); color: #34d399; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; margin-top: 1rem; }
        code { color: #c084fc; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🛡️ LifeProof API Server</h1>
        <p>Enterprise University & Career Verification Backend is running.</p>
        <div class="badge">● SERVER ACTIVE (PORT ${PORT})</div>
        <p style="margin-top: 1.5rem; font-size: 0.82rem;">Healthcheck: <code>/api/health</code></p>
      </div>
    </body>
    </html>
  `);
});

// ==========================================================================
// 3. 404 & ERROR HANDLING MIDDLEWARE
// ==========================================================================

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist on LifeProof API Server.`,
    availableEndpoints: [
      'GET  /api/health',
      'POST /api/auth/session-check',
      'GET  /api/users/profile/:uid',
      'POST /api/users/onboarding',
      'GET  /api/jobs',
      'POST /api/jobs/apply',
      'GET  /api/assessments',
      'POST /api/assessments/submit',
      'GET  /api/faculty/analytics',
      'GET  /api/faculty/student-feed',
      'POST /api/faculty/export-report'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[LifeProof Error Handler]:', err);
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred on the LifeProof server.'
  });
});

// ==========================================================================
// 4. SERVER LISTENER
// ==========================================================================

app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🛡️  LifeProof Backend Server running on http://localhost:${PORT}`);
  console.log(`⚡ Healthcheck available at: http://localhost:${PORT}/api/health`);
  console.log(`🚀 Step 1 Complete: Server initialized successfully.`);
  console.log('================================================================');
});

export default app;
