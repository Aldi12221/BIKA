const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, User, Quiz, Job, Tutorial, Business, Finance } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'bika_secret_key_2026';

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('DEBUG LOGIN -> Body:', req.body);

    if (!username || !password) {
      console.log('DEBUG LOGIN -> Missing username or password');
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      console.log('DEBUG LOGIN -> Admin not found for username:', username);
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('DEBUG LOGIN -> Password match result:', isMatch);

    if (!isMatch) {
      console.log('DEBUG LOGIN -> Password mismatch for:', username);
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
    const [users, quizzes, jobs, tutorials, businesses, finances] = await Promise.all([
      User.findAll({ attributes: ['createdAt'] }),
      Quiz.findAll({ attributes: ['createdAt'] }),
      Job.findAll({ attributes: ['createdAt'] }),
      Tutorial.findAll({ attributes: ['createdAt'] }),
      Business.findAll({ attributes: ['createdAt'] }),
      Finance.findAll({ attributes: ['createdAt'] })
    ]);

    const totalUsers = users.length;
    const totalQuizzes = quizzes.length;
    const totalContents = jobs.length + tutorials.length + businesses.length + finances.length;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const userSpark = new Array(12).fill(0);
    const contentSpark = new Array(12).fill(0);
    const quizSpark = new Array(12).fill(0);

    let activeContentsThisMonth = 0;
    let activeContentsLastMonth = 0;

    users.forEach(u => {
      const d = new Date(u.createdAt);
      if (d.getFullYear() === currentYear) userSpark[d.getMonth()]++;
    });

    // Gabungkan semua konten untuk sparkline dan statistik bulanan
    const allContents = [...jobs, ...tutorials, ...businesses, ...finances];
    allContents.forEach(c => {
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
        { label: 'Lowongan', count: jobs.length, color: '#6C63FF' },
        { label: 'Tutorial', count: tutorials.length, color: '#00D9FF' },
        { label: 'Usaha', count: businesses.length, color: '#FF6B9D' },
        { label: 'Keuangan', count: finances.length, color: '#FFD700' }
      ],
      activeContentsThisMonth,
      activeContentsLastMonth
    });
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GetAllUsers untuk mengelola pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DeleteUser untuk mengelola pengguna
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ══════════════════════════════════════════
// CRUD Admin Management
// ══════════════════════════════════════════

// GetAllAdmins — list semua admin (tanpa password)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'username', 'nama', 'role', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GetAdminById
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: ['id', 'username', 'nama', 'role', 'createdAt', 'updatedAt']
    });
    if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UpdateAdmin — update nama, username, role, dan password (opsional)
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const { username, nama, role, password } = req.body;

    // Cek username unik jika diubah
    if (username && username !== admin.username) {
      const existing = await Admin.findOne({ where: { username } });
      if (existing) return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    if (username) admin.username = username;
    if (nama) admin.nama = nama;
    if (role) admin.role = role;
    if (password && password.trim() !== '') {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.json({
      message: 'Admin berhasil diupdate',
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

// DeleteAdmin — hapus admin (tidak bisa hapus diri sendiri)
exports.deleteAdmin = async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    const currentAdminId = req.admin?.id;

    if (targetId === currentAdminId) {
      return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri' });
    }

    const admin = await Admin.findByPk(targetId);
    if (!admin) return res.status(404).json({ message: 'Admin tidak ditemukan' });

    await admin.destroy();
    res.json({ message: 'Admin berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
