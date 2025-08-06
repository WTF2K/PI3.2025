const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tipoproposta', {
    idtproposta: {
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
    tableName: 'tipoproposta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tipoproposta",
        unique: true,
        fields: [
          { name: "idtproposta" },
        ]
      },
      {
        name: "tipoproposta_pk",
        unique: true,
        fields: [
          { name: "idtproposta" },
        ]
      },
    ]
  });
};
