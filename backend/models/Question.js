const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Question = sequelize.define('Question', {
  teks_soal: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  opsi_a: { type: DataTypes.STRING, allowNull: false },
  opsi_b: { type: DataTypes.STRING, allowNull: false },
  opsi_c: { type: DataTypes.STRING, allowNull: false },
  opsi_d: { type: DataTypes.STRING, allowNull: false },
  jawaban_benar: {
    type: DataTypes.ENUM('a', 'b', 'c', 'd'),
    allowNull: false
  }
});

module.exports = Question;