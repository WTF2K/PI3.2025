const dbConfig = require("../config/db.config.js");
const initModels = require("./init-models");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.dialectOptions,
});

const db = initModels(sequelize);
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;