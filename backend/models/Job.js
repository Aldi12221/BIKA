const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Job = db.define('Job', {
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
  perusahaan: {
    type: DataTypes.STRING
  },
  lokasi: {
    type: DataTypes.STRING
  },
  tipe_pekerjaan: {
    type: DataTypes.STRING
  },
  link_eksternal: {
    type: DataTypes.STRING
  }
});

module.exports = Job;
