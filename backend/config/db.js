const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'database_bika', 
  process.env.DB_USER || 'root',          
  process.env.DB_PASSWORD || '',          
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 4000, // TiDB menggunakan port 4000
    dialect: 'mysql',
    logging: false, 
    // TAMBAHKAN BAGIAN DI BAWAH INI:
    dialectOptions: {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
