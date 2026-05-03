const { Sequelize } = require('sequelize');
require('dotenv').config(); // Mengambil variabel dari file .env

/**
 * Konfigurasi Koneksi Database
 * Pastikan kamu sudah membuat database di MySQL sesuai dengan DB_NAME di .env
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'database_bika', // Nama database
  process.env.DB_USER || 'root',          // Username database
  process.env.DB_PASSWORD || '',          // Password database
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set ke true jika ingin melihat query SQL di terminal
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Fungsi untuk mengetes koneksi (Callback style dengan .then)
sequelize.authenticate()
  .then(() => {
    console.log('Koneksi ke database MySQL berhasil terhubung.');
  })
  .catch(err => {
    console.error('Tidak dapat terhubung ke database:', err);
  });

module.exports = sequelize;