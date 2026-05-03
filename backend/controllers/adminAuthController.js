const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'bika_secret_key_2026';

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nama: admin.nama,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify Admin Token
exports.verifyAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id, {
      attributes: ['id', 'username', 'nama', 'role']
    });

    if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan' });

    res.json({ admin });
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Register Admin (Seed / Internal use)
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, nama, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword,
      nama,
      role: role || 'admin'
    });

    res.status(201).json({
      message: 'Admin berhasil dibuat',
      admin: {
        id: admin.id,
        username: admin.username,
        nama: admin.nama,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const { User, Content, Quiz } = require('../models');
    const totalUsers = await User.count();
    const totalContents = await Content.count();
    const totalQuizzes = await Quiz.count();

    res.json({
      totalUsers,
      totalContents,
      totalQuizzes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
