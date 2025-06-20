'use strict';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
import config from '../../config/config.js';

const db_config = config[env];
const db = {};

let sequelize;
if (db_config.use_env_variable) {
  sequelize = new Sequelize(process.env[db_config.use_env_variable], db_config);
} else {
  sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, db_config);
}

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  );

await Promise.all(
  modelFiles.map(async (file) => {
    const { default: model } = await import(path.join(__dirname, file));
    db[model.name] = model;
  })
);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
