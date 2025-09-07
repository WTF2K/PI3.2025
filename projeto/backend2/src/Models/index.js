const dbConfig = require("../config/db.config.js");
const initModels = require("./init-models");
const Sequelize = require("sequelize");

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
  });
} else {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
    logging: false,
  });
}

const db = initModels(sequelize);
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;