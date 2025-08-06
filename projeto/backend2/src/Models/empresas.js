const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('empresas', {
    idtuser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'utilizadores',
        key: 'iduser'
      }
    },
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'utilizadores',
        key: 'iduser'
      }
    },
    nome: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    localizacao: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    idempresa: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'empresas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "empresas_pk",
        unique: true,
        fields: [
          { name: "idtuser" },
          { name: "iduser" },
          { name: "idempresa" },
        ]
      },
      {
        name: "pk_empresas",
        unique: true,
        fields: [
          { name: "idtuser" },
          { name: "iduser" },
          { name: "idempresa" },
        ]
      },
      {
        name: "reference_4_fk",
        fields: [
          { name: "idtuser" },
          { name: "iduser" },
        ]
      },
    ]
  });
};
