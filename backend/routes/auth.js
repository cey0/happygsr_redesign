const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_happygsr_key_2026';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Mohon lengkapi semua field!' });
    }

    const db = await getDB();

    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate referral code
    const sanitizedName = name.replace(/\s+/g, '').toUpperCase().substring(0, 5);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const referralCode = `GSR-${sanitizedName}-${randomNum}`;

    // Insert user
    const result = await db.run(`
      INSERT INTO users (name, email, phone, password, role, token_balance, referral_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, name, email, phone, hashedPassword, 'member', 50, referralCode); // New users get 50 GSR tokens free!

    const userId = result.lastID;
    
    // Generate token
    const token = jwt.sign({ id: userId, email, role: 'member' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        phone,
        role: 'member',
        token_balance: 50,
        referral_code: referralCode
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Mohon masukkan email/phone dan password!' });
    }

    const db = await getDB();
    
    // Find user by email or phone
    const user = await db.get(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      emailOrPhone, emailOrPhone
    );

    if (!user) {
      return res.status(400).json({ message: 'Akun tidak ditemukan!' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password salah!' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token_balance: user.token_balance,
        referral_code: user.referral_code
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = await getDB();
    const user = await db.get(
      'SELECT id, name, email, phone, role, token_balance, referral_code FROM users WHERE id = ?',
      req.user.id
    );

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = {
  router,
  authenticateToken
};
