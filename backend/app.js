const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // Koneksi DB
require('./models'); // Memastikan Relasi Model Terdaftar
const apiRoutes = require('./routes/api'); // Semua Route API

const app = express();

// Middleware
app.use(cors()); // Mengizinkan akses dari React (Frontend)
app.use(express.json()); // Parsing body request format JSON

// Gunakan Routes
// Semua endpoint akan diawali dengan /api (contoh: /api/quizzes)
app.use('/api', apiRoutes);

// Error Handling Global (Opsional tapi sangat berguna)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server!' });
});

// Sync Database & Jalankan Server
// 'alter: true' akan mengupdate tabel jika kamu menambah kolom di Model tanpa menghapus data
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server BiKA running on: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });