const express = require('express');
const router = express.Router();
const { getDB } = require('../database');
const { authenticateToken } = require('./auth');

// GET /api/commissions (Requires Auth)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    const commissions = await db.all(
      'SELECT * FROM commissions WHERE user_id = ? ORDER BY created_at DESC',
      req.user.id
    );

    const summary = await db.get(
      `SELECT 
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as totalPaid,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as totalPending
       FROM commissions WHERE user_id = ?`,
      req.user.id
    );

    res.json({
      commissions,
      summary: {
        totalPaid: summary.totalPaid || 0,
        totalPending: summary.totalPending || 0,
        totalEarned: (summary.totalPaid || 0) + (summary.totalPending || 0)
      }
    });

  } catch (error) {
    console.error('Fetch commissions error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memuat data komisi' });
  }
});

module.exports = router;
