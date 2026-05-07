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
    const users = await User.findAll({ attributes: ['createdAt'] });
    const contents = await Content.findAll({ attributes: ['createdAt', 'kategori'] });
    const quizzes = await Quiz.findAll({ attributes: ['createdAt'] });

    const totalUsers = users.length;
    const totalContents = contents.length;
    const totalQuizzes = quizzes.length;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const userSpark = new Array(12).fill(0);
    const contentSpark = new Array(12).fill(0);
    const quizSpark = new Array(12).fill(0);

    const categoryCount = { lowongan: 0, tutorial: 0, usaha: 0, keuangan: 0 };
    let activeContentsThisMonth = 0;
    let activeContentsLastMonth = 0;

    users.forEach(u => {
      const d = new Date(u.createdAt);
      if (d.getFullYear() === currentYear) userSpark[d.getMonth()]++;
    });

    contents.forEach(c => {
      if (c.kategori && categoryCount[c.kategori] !== undefined) {
        categoryCount[c.kategori]++;
      }
      const d = new Date(c.createdAt);
      if (d.getFullYear() === currentYear) {
        contentSpark[d.getMonth()]++;
        if (d.getMonth() === currentMonth) activeContentsThisMonth++;
        if (d.getMonth() === currentMonth - 1) activeContentsLastMonth++;
      }
    });

    quizzes.forEach(q => {
      const d = new Date(q.createdAt);
      if (d.getFullYear() === currentYear) quizSpark[d.getMonth()]++;
    });

    res.json({
      totalUsers,
      totalContents,
      totalQuizzes,
      currentYear,
      userSpark,
      contentSpark,
      quizSpark,
      barData: contentSpark,
      activityData: userSpark,
      categories: [
        { label: 'Lowongan', count: categoryCount.lowongan, color: '#6C63FF' },
        { label: 'Tutorial', count: categoryCount.tutorial, color: '#00D9FF' },
        { label: 'Usaha', count: categoryCount.usaha, color: '#FF6B9D' }
      ],
      activeContentsThisMonth,
      activeContentsLastMonth
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GetAllUsers untuk mengelola pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const { User } = require('../models');
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DeleteUser untuk mengelola pengguna
exports.deleteUser = async (req, res) => {
  try {
    const { User } = require('../models');
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
