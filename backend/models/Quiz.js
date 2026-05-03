const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  },
  kategori: {
    type: DataTypes.ENUM('umum', 'psikotes'),
    defaultValue: 'umum'
  }
});

module.exports = Quiz;