const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foto: {
    type: DataTypes.STRING
  },
  cv_path: {
    type: DataTypes.STRING // Menyimpan path file PDF atau link drive
  },
  portofolio_link: {
    type: DataTypes.STRING
  }
});

module.exports = User;