'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const env = process.env.NODE_ENV || 'PRODUCTION'; 
const config = {
  username: process.env[`${env.toUpperCase()}_USERNAME`],
  password: process.env[`${env.toUpperCase()}_PASSWORD`],
  database: process.env[`${env.toUpperCase()}_DATABASE`],
  host: process.env[`${env.toUpperCase()}_HOST`],
  dialect: process.env[`${env.toUpperCase()}_DIALECT`],
};

let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
