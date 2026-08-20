/**
 * LifeProof - Immutable Audit Ledger & Event Telemetry API
 * 
 * Step 9: Live Cryptographic Audit Inspection & Verification
 */

import express from 'express';
import auditLedger from '../services/auditLogger.js';

const router = express.Router();

/**
 * @route   GET /api/audit/stats
 * @desc    Fetch audit ledger health, total blocks, and hash integrity
 * @access  Public
 */
router.get('/stats', (req, res) => {
  try {
    const stats = auditLedger.getStats();
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/audit/ledger
 * @desc    Fetch recent immutable audit transaction blocks
 * @access  Public
 */
router.get('/ledger', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const blocks = auditLedger.getChain(limit);

    return res.status(200).json({
      success: true,
      count: blocks.length,
      blocks
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/audit/block/:index
 * @desc    Fetch a specific transaction block by index
 * @access  Public
 */
router.get('/block/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    const block = auditLedger.chain.find(b => b.index === index);

    if (!block) {
      return res.status(404).json({ success: false, message: `Block #${index} not found in audit chain.` });
    }

    return res.status(200).json({
      success: true,
      block
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
