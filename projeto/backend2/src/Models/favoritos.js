module.exports = function(sequelize, DataTypes) {
  return sequelize.define('favoritos', {
    idfavorito: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizadores',
        key: 'iduser'
      }
    },
    idproposta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propostas',
        key: 'idproposta'
      }
    },
    data_favorito: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'favoritos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "favoritos_pk",
        unique: true,
        fields: [
          { name: "idfavorito" }
        ]
      },
      {
        name: "user_proposta_unique",
        unique: true,
        fields: [
          { name: "iduser" },
          { name: "idproposta" }
        ]
      }
    ]
  });
};