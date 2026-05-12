require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // Koneksi DB
const { Admin } = require('./models'); // Import model Admin
const bcrypt = require('bcryptjs');
const apiRoutes = require('./routes/api'); // Semua Route API

const app = express();

// Middleware
app.use(cors()); // Mengizinkan akses dari React (Frontend)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// DB Sync Middleware — sync sekali saat cold start di Vercel
let isDbSynced = false;
app.use(async (req, res, next) => {
  if (!isDbSynced) {
    try {
      await sequelize.sync();
      
      // Seed default admin jika belum ada
      const adminCount = await Admin.count({ where: { username: 'admin' } });
      if (adminCount === 0) {
        console.log('No admin found, creating default admin...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({
          username: 'admin',
          password: hashedPassword,
          nama: 'Default Admin',
          role: 'admin'
        });
        console.log('Default admin created: admin/admin123');
      } else {
        console.log('Admin already exists, skipping seed.');
      }

      isDbSynced = true;
      console.log('Database synced successfully.');
    } catch (err) {
      console.error('Database sync failed:', err);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  }
  next();
});

// Gunakan Routes
// Semua endpoint akan diawali dengan /api (contoh: /api/quizzes)
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BiKA API is running 🚀' });
});

// Error Handling Global
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'File terlalu besar. Maksimal ukuran upload adalah 10MB.' });
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server!' });
});

// Jalankan server hanya jika dijalankan langsung (bukan di-import oleh Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server BiKA running on: http://localhost:${PORT}`);
  });
}

// Export untuk Vercel Serverless
module.exports = app;