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
  link_eksternal: {
    type: DataTypes.STRING // Contoh: Link kuis luar atau link lowongan
  }
});

module.exports = Content;