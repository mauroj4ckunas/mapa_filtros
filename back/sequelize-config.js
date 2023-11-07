require('dotenv').config(); 

const { Sequelize } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  });

module.exports = sequelize;
