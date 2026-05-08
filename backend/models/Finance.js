const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Finance = db.define('Finance', {
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
  }
});

module.exports = Finance;
