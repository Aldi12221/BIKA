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
    type: DataTypes.ENUM('lowongan', 'tutorial', 'usaha'),
    allowNull: false
  },
  gambar: {
    type: DataTypes.TEXT('long') // Untuk menyimpan base64 file cover / logo
  },
  perusahaan: {
    type: DataTypes.STRING // Khusus lowongan
  },
  lokasi: {
    type: DataTypes.STRING // Khusus lowongan
  },
  tipe_pekerjaan: {
    type: DataTypes.STRING // Khusus lowongan (e.g. Remote, Magang)
  },
  link_eksternal: {
    type: DataTypes.STRING
  }
});

module.exports = Content;