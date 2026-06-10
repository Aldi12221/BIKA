const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Content = sequelize.define('Content', {
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  },
  kategori: {
    type: DataTypes.ENUM('lowongan', 'tutorial', 'usaha', 'keuangan'),
    allowNull: false
  },
  gambar: {
    type: DataTypes.TEXT('long') // Untuk menyimpan base64 file cover / logo
  },
  isi_konten: {
    type: DataTypes.TEXT('long') // Untuk menyimpan isi artikel lengkap
  },
  perusahaan: {
    type: DataTypes.STRING // Khusus lowongan
  },
  lokasi: {
    type: DataTypes.STRING // Khusus lowongan (kota/kabupaten utama)
  },
  detail_lokasi: {
    type: DataTypes.STRING // Detail lokasi (kecamatan, jalan, dll)
  },
  is_magang: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tipe_pekerjaan: {
    type: DataTypes.STRING // Khusus lowongan (e.g. Remote, Magang)
  },
  link_eksternal: {
    type: DataTypes.STRING
  },
  file_tambahan: {
    type: DataTypes.TEXT('long')
  }
});

module.exports = Content;