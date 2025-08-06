const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacoes', {
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lida: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    data_envio: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    idnotas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'notificacoes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "notificacoes_pk",
        unique: true,
        fields: [
          { name: "idnotas" },
        ]
      },
      {
        name: "pk_notificacoes",
        unique: true,
        fields: [
          { name: "idnotas" },
        ]
      },
    ]
  });
};
