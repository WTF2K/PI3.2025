const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tiponotificacao', {
    idnotas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'notificacoes',
        key: 'idnotas'
      }
    },
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
    descricao: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    idtnote: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'tiponotificacao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tiponotificacao",
        unique: true,
        fields: [
          { name: "idnotas" },
          { name: "idtuser" },
          { name: "iduser" },
          { name: "idtnote" },
        ]
      },
      {
        name: "reference_9_fk",
        fields: [
          { name: "idnotas" },
        ]
      },
      {
        name: "reference_9_fk2",
        fields: [
          { name: "idtuser" },
          { name: "iduser" },
        ]
      },
      {
        name: "tiponotificacao_pk",
        unique: true,
        fields: [
          { name: "idnotas" },
          { name: "idtuser" },
          { name: "iduser" },
          { name: "idtnote" },
        ]
      },
    ]
  });
};
