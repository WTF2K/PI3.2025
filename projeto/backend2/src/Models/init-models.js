var DataTypes = require("sequelize").DataTypes;
var _empresas = require("./empresas");
var _notificacoes = require("./notificacoes");
var _propostas = require("./propostas");
var _tipocontrato = require("./tipocontrato");
var _tiponotificacao = require("./tiponotificacao");
var _tipoproposta = require("./tipoproposta");
var _tipoutilizador = require("./tipoutilizador");
var _utilizadores = require("./utilizadores");
var _favoritos = require("./favoritos");

function initModels(sequelize) {
  var empresas = _empresas(sequelize, DataTypes);
  var notificacoes = _notificacoes(sequelize, DataTypes);
  var propostas = _propostas(sequelize, DataTypes);
  var tipocontrato = _tipocontrato(sequelize, DataTypes);
  var tiponotificacao = _tiponotificacao(sequelize, DataTypes);
  var tipoproposta = _tipoproposta(sequelize, DataTypes);
  var tipoutilizador = _tipoutilizador(sequelize, DataTypes);
  var utilizadores = _utilizadores(sequelize, DataTypes);
  var favoritos = _favoritos(sequelize, DataTypes);

  utilizadores.belongsToMany(utilizadores, { as: 'iduser_utilizadores', through: empresas, foreignKey: "idtuser", otherKey: "iduser" });
  utilizadores.belongsToMany(utilizadores, { as: 'idtuser_utilizadores', through: empresas, foreignKey: "iduser", otherKey: "idtuser" });
  propostas.belongsTo(empresas, { as: "idempresa_empresa", foreignKey: "idempresa"});
  empresas.hasMany(propostas, { as: "proposta", foreignKey: "idempresa"});
  propostas.belongsTo(empresas, { as: "idtuser_empresa", foreignKey: "idtuser"});
  empresas.hasMany(propostas, { as: "idtuser_proposta", foreignKey: "idtuser"});
  propostas.belongsTo(empresas, { as: "iduser_empresa", foreignKey: "iduser"});
  empresas.hasMany(propostas, { as: "iduser_proposta", foreignKey: "iduser"});
  tiponotificacao.belongsTo(notificacoes, { as: "idnotas_notificaco", foreignKey: "idnotas"});
  notificacoes.hasMany(tiponotificacao, { as: "tiponotificacaos", foreignKey: "idnotas"});
  propostas.belongsTo(tipocontrato, { as: "idtcontrato_tipocontrato", foreignKey: "idtcontrato"});
  tipocontrato.hasMany(propostas, { as: "proposta", foreignKey: "idtcontrato"});
  propostas.belongsTo(tipoproposta, { as: "idtproposta_tipopropostum", foreignKey: "idtproposta"});
  tipoproposta.hasMany(propostas, { as: "proposta", foreignKey: "idtproposta"});
  utilizadores.belongsTo(tipoutilizador, { as: "idtuser_tipoutilizador", foreignKey: "idtuser"});
  tipoutilizador.hasMany(utilizadores, { as: "utilizadores", foreignKey: "idtuser"});
  empresas.belongsTo(utilizadores, { as: "idtuser_utilizadore", foreignKey: "idtuser"});
  utilizadores.hasMany(empresas, { as: "empresas", foreignKey: "idtuser"});
  empresas.belongsTo(utilizadores, { as: "iduser_utilizadore", foreignKey: "iduser"});
  utilizadores.hasMany(empresas, { as: "iduser_empresas", foreignKey: "iduser"});
  tiponotificacao.belongsTo(utilizadores, { as: "idtuser_utilizadore", foreignKey: "idtuser"});
  utilizadores.hasMany(tiponotificacao, { as: "tiponotificacaos", foreignKey: "idtuser"});
  tiponotificacao.belongsTo(utilizadores, { as: "iduser_utilizadore", foreignKey: "iduser"});
  utilizadores.hasMany(tiponotificacao, { as: "iduser_tiponotificacaos", foreignKey: "iduser"});
  favoritos.belongsTo(utilizadores, { as: "iduser_utilizadore", foreignKey: "iduser"});
  utilizadores.hasMany(favoritos, { as: "favoritos", foreignKey: "iduser"});
  favoritos.belongsTo(propostas, { as: "idproposta_propostum", foreignKey: "idproposta"});
  propostas.hasMany(favoritos, { as: "favoritos", foreignKey: "idproposta"});
 

  return {
    empresas,
    notificacoes,
    propostas,
    tipocontrato,
    tiponotificacao,
    tipoproposta,
    tipoutilizador,
    utilizadores,
    favoritos,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
