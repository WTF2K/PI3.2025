const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tipoutilizador', {
    idtuser: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.CHAR(256),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tipoutilizador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tipoutilizador",
        unique: true,
        fields: [
          { name: "idtuser" },
        ]
      },
      {
        name: "tipoutilizador_pk",
        unique: true,
        fields: [
          { name: "idtuser" },
        ]
      },
    ]
  });
};
