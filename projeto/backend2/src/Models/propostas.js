const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('propostas', {
    idproposta: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idtuser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'empresas',
        key: 'iduser'
      }
    },
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'empresas',
        key: 'iduser'
      }
    },
    idempresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'empresas',
        key: 'iduser'
      }
    },
    idtproposta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipoproposta',
        key: 'idtproposta'
      }
    },
    idtcontrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipocontrato',
        key: 'idtcontrato'
      }
    },
    categoria: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    localizacao: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    data_submissao: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vaga: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    validada: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    data_validacao: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    validado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ativa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    atribuida_estudante: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    id_estudante_atribuido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizadores',
        key: 'iduser'
      }
    },
    data_atribuicao: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'propostas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_propostas",
        unique: true,
        fields: [
          { name: "idproposta" },
        ]
      },
      {
        name: "propostas_pk",
        unique: true,
        fields: [
          { name: "idproposta" },
        ]
      },
      {
        name: "reference_5_fk",
        fields: [
          { name: "idtuser" },
          { name: "iduser" },
          { name: "idempresa" },
        ]
      },
      {
        name: "reference_6_fk",
        fields: [
          { name: "idtproposta" },
        ]
      },
      {
        name: "relationship_8_fk",
        fields: [
          { name: "idtcontrato" },
        ]
      },
    ]
  });
};
