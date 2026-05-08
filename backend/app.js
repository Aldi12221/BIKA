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

const mysql = require('mysql2/promise');

// Fungsi untuk memastikan database ada
async function initDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'database_bika'}\`;`);
    await connection.end();
    console.log(`Database '${process.env.DB_NAME || 'database_bika'}' ready.`);

    // Sync Database & Jalankan Server
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server BiKA running on: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Initialization failed:', err);
  }
}

initDb();