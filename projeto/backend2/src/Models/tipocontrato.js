const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tipocontrato', {
    idtcontrato: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descricao: {
      type: DataTypes.CHAR(256),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tipocontrato',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tipocontrato",
        unique: true,
        fields: [
          { name: "idtcontrato" },
        ]
      },
      {
        name: "tipo_contrato_pk",
        unique: true,
        fields: [
          { name: "idtcontrato" },
        ]
      },
    ]
  });
};
