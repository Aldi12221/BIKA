const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Business = db.define('Business', {
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  },
  gambar: {
    type: DataTypes.TEXT('long')
  },
  isi_konten: {
    type: DataTypes.TEXT('long')
  },
  link_eksternal: {
    type: DataTypes.STRING
  },
  file_tambahan: {
    type: DataTypes.TEXT('long') // JSON string for multiple attachments
  }
});

module.exports = Business;
