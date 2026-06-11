const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Template = sequelize.define('Template', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  file_name: {
    type: DataTypes.STRING
  },
  mime_type: {
    type: DataTypes.STRING
  },
  data: {
    type: DataTypes.TEXT('long') // store data URL (base64) or raw text
  }
});

module.exports = Template;
