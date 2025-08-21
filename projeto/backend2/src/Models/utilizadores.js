const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('utilizadores', {
    idtuser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipoutilizador',
        key: 'idtuser'
      }
    },
    nome: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    email: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    data_criacao: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    iduser: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    curso: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    interesses: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    competencias: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    percurso: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    pedido_remocao: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    data_remocao: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'utilizadores',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_utilizadores",
        unique: true,
        fields: [
          { name: "idtuser" },
          { name: "iduser" },
        ]
      },
      {
        name: "reference_3_fk",
        fields: [
          { name: "idtuser" },
        ]
      },
      {
        name: "utilizadores_pk",
        unique: true,
        fields: [
          { name: "idtuser" },
          { name: "iduser" },
        ]
      },
    ]
  });
};
