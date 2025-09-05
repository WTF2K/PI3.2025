const dbConfig = require("../config/db.config.js");
const initModels = require("./init-models");


const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = initModels(sequelize);

//const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.empresas = require("./empresas.js")(sequelize, Sequelize);
db.notificacoes = require("./notificacoes.js")(sequelize, Sequelize);
db.propostas = require("./propostas.js")(sequelize, Sequelize);
db.tipocontrato = require("./tipocontrato.js")(sequelize, Sequelize);
db.tiponotificacao = require("./tiponotificacao.js")(sequelize, Sequelize);
db.tipoproposta = require("./tipoproposta.js")(sequelize, Sequelize);
db.tipoutilizador = require("./tipoutilizador.js")(sequelize, Sequelize);
db.utilizadores = require("./utilizadores.js")(sequelize, Sequelize);
db.favoritos = require("./favoritos.js")(sequelize, Sequelize);

db.empresas.hasMany(db.propostas, {
  foreignKey: 'idempresa',
  sourceKey: 'idempresa',
  as: 'propostas'
});

db.propostas.belongsTo(db.empresas, {
  foreignKey: 'idempresa',
  targetKey: 'idempresa',
  as: 'empresa'
});

db.utilizadores.belongsTo(db.tipoutilizador, { as: "idtuser_tipoutilizador", foreignKey: "idtuser"});
db.tipoutilizador.hasMany(db.utilizadores, { as: "utilizadores", foreignKey: "idtuser"});

module.exports = db;   