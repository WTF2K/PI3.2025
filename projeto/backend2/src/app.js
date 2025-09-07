const express = require("express");
const app = express();
const db = require("./Models");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');




// Configurar CORS - permitir origem do Frontend (env)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Middleware para aceitar JSON
app.use(express.json());

app.use(cookieParser());

// Chamar Rotas
const empresaRota = require("./routes/empresasRoutes");
const notificacoesRota = require("./routes/notificacoesRoutes");
const propostas = require("./routes/propostasRoutes");
const tipoContrato = require("./routes/tipocontratoRoutes");
const tipoNotificacao = require("./routes/tiponotificacaoRoutes");
const tipoProposta = require("./routes/tipopropostaRoutes");
const authentication = require("./routes/authRoutes");
const tipoUtilizador = require("./routes/tipoutilizadorRoutes");
const utilizador = require("./routes/utilizadoresRoutes");

// Usar Rotas
app.use("/api/empresas", empresaRota);
app.use("/api/notificacoes", notificacoesRota);
app.use("/api/propostas", propostas);
app.use("/api/tipocontrato", tipoContrato);
app.use("/api/tiponotificacao", tipoNotificacao);
app.use("/api/tipoproposta", tipoProposta);
app.use("/api/tipoutilizador", tipoUtilizador);
app.use("/api/utilizadores", utilizador);
app.use("/api/auth", authentication);

db.sequelize
  .authenticate()
  .then(() => console.log('Database connection established.'))
  .then(async () => {
    // Executar SQLs necessários para criar tabelas base
    try {
      // Limpar tabelas existentes que podem ter estrutura incorreta
      await db.sequelize.query(`DROP TABLE IF EXISTS favoritos CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS tiponotificacao CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS notificacoes CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS propostas CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS empresas CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS utilizadores CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS tipoutilizador CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS tipoproposta CASCADE;`);
      await db.sequelize.query(`DROP TABLE IF EXISTS tipocontrato CASCADE;`);
      await db.sequelize.query(`
        -- Criar tabela tipoutilizador se não existir
        CREATE TABLE IF NOT EXISTS tipoutilizador (
          idtuser INTEGER PRIMARY KEY,
          descricao VARCHAR(50) NOT NULL
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela utilizadores
        CREATE TABLE utilizadores (
          iduser SERIAL,
          idtuser INTEGER REFERENCES tipoutilizador(idtuser),
          nome VARCHAR(256),
          email VARCHAR(256) UNIQUE,
          senha VARCHAR(255),
          data_criacao DATE,
          curso VARCHAR(256),
          ano INTEGER,
          idade INTEGER,
          interesses VARCHAR(256),
          competencias VARCHAR(256),
          percurso VARCHAR(256),
          ativo BOOLEAN DEFAULT TRUE,
          pedido_remocao BOOLEAN DEFAULT FALSE,
          data_remocao DATE,
          telefone VARCHAR(20),
          PRIMARY KEY (idtuser, iduser)
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela empresas
        CREATE TABLE empresas (
          idtuser INTEGER NOT NULL,
          iduser INTEGER NOT NULL,
          idempresa SERIAL,
          nome VARCHAR(256),
          descricao TEXT,
          localizacao VARCHAR(256),
          PRIMARY KEY (idtuser, iduser, idempresa),
          FOREIGN KEY (idtuser, iduser) REFERENCES utilizadores(idtuser, iduser)
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela tipoproposta se não existir
        CREATE TABLE IF NOT EXISTS tipoproposta (
          idtproposta INTEGER PRIMARY KEY,
          nome VARCHAR(100) NOT NULL
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela tipocontrato se não existir
        CREATE TABLE IF NOT EXISTS tipocontrato (
          idtcontrato INTEGER PRIMARY KEY,
          descricao VARCHAR(100) NOT NULL
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela propostas
        CREATE TABLE propostas (
          idproposta SERIAL PRIMARY KEY,
          idtuser INTEGER,
          iduser INTEGER,
          idempresa INTEGER,
          idtproposta INTEGER REFERENCES tipoproposta(idtproposta),
          idtcontrato INTEGER REFERENCES tipocontrato(idtcontrato),
          categoria VARCHAR(256),
          localizacao VARCHAR(256),
          data_submissao DATE,
          nome TEXT,
          descricao TEXT,
          vaga TEXT,
          validada BOOLEAN DEFAULT FALSE,
          data_validacao DATE,
          validado_por INTEGER,
          ativa BOOLEAN DEFAULT TRUE,
          atribuida_estudante BOOLEAN DEFAULT FALSE,
          id_estudante_atribuido INTEGER,
          data_atribuicao DATE
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela notificacoes
        CREATE TABLE notificacoes (
          idnotas SERIAL PRIMARY KEY,
          mensagem TEXT,
          lida VARCHAR(3),
          data_envio DATE
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela tiponotificacao
        CREATE TABLE tiponotificacao (
          idnotas INTEGER NOT NULL,
          idtuser INTEGER NOT NULL,
          iduser INTEGER NOT NULL,
          idtnote VARCHAR(10) NOT NULL,
          descricao VARCHAR(256),
          PRIMARY KEY (idnotas, idtuser, iduser, idtnote)
        );
      `);
      
      await db.sequelize.query(`
        -- Criar tabela favoritos
        CREATE TABLE favoritos (
          idfavorito SERIAL PRIMARY KEY,
          idtuser INTEGER NOT NULL,
          iduser INTEGER NOT NULL,
          idproposta INTEGER NOT NULL REFERENCES propostas(idproposta),
          data_favorito DATE NOT NULL DEFAULT CURRENT_DATE,
          UNIQUE(idtuser, iduser, idproposta)
        );
      `);
      
      console.log("Base tables created successfully.");
    } catch (err) {
      console.log("Error creating base tables:", err.message);
    }
  })
  .then(() => db.sequelize.sync())
  .then(async () => {
    console.log("Synced db.");

    const tipocontratoModel = db.tipocontrato;
    if (!tipocontratoModel) {
      throw new Error("Modelo tipocontrato não encontrado no db");
    }
    const tiposContratoPreDefinidos = [
      { idtcontrato: 1, descricao: "Estágio" },
      { idtcontrato: 2, descricao: "Definitivo" },
      { idtcontrato: 3, descricao: "Temporário" },
      { idtcontrato: 4, descricao: "Contrato-Programa" },
      { idtcontrato: 5, descricao: "Outro" },
    ];
    for (const tipo of tiposContratoPreDefinidos) {
      const [record, created] = await tipocontratoModel.findOrCreate({
        where: { idtcontrato: tipo.idtcontrato },
        defaults: { descricao: tipo.descricao },
      });
      if (created) {
        console.log(`Tipo de contrato inserido: ${tipo.descricao}`);
      }
    }

    const tipopropostaModel = db.tipoproposta;
    if (!tipopropostaModel) {
      throw new Error("Modelo tipoproposta não encontrado no db");
    }
    const tiposPropostaPreDefinidos = [
      { idtproposta: 1, nome: "Estágio Curricular" },
      { idtproposta: 2, nome: "Projeto Final" },
      { idtproposta: 3, nome: "Estágio Profissional" },
      { idtproposta: 4, nome: "Emprego" },
    ];
    for (const tipo of tiposPropostaPreDefinidos) {
      const [record, created] = await tipopropostaModel.findOrCreate({
        where: { idtproposta: tipo.idtproposta },
        defaults: { nome: tipo.nome },
      });
      if (created) {
        console.log(`Tipo de proposta inserido: ${tipo.nome}`);
      }
    }

    const utilizadorModel = db.utilizadores;
    if (!utilizadorModel) {
      throw new Error("Modelo utilizadores não encontrado no db");
    }

    // Verifica se já existe um admin (idtuser = 1)
    const adminExistente = await utilizadorModel.findOne({
      where: { idtuser: 1 }
    });

    if (adminExistente) {
      console.log("Já existe um utilizador admin. Nenhum novo admin foi criado.");
    } else {
      // Encripta a senha
      const senhaOriginal = "12345";
      const senhaEncriptada = await bcrypt.hash(senhaOriginal, 10);

      // Cria o utilizador admin
      const novoAdmin = await utilizadorModel.create({
        idtuser: 1,
        nome: "admin1",
        email: "admin1@gmail.com",
        senha: senhaEncriptada
      });

      console.log(`Utilizador admin criado com ID: ${novoAdmin.iduser}`);
    }

    const tiponotificacaoModel = db.tiponotificacao;
    if (!tiponotificacaoModel) {
      throw new Error("Modelo tiponotificacao não encontrado no db");
    }
    // ⚠️ IDs referenciados (idnotas, idtuser, iduser) devem existir na base de dados
    const tiposNotificacaoPreDefinidos = [
      {
        idnotas: 1,
        idtuser: 4, // Exemplo: estudante
        iduser: 2, // ID de utilizador correspondente
        idtnote: "ALERTA",
        descricao: "Nova proposta disponível",
      },
    ];
    for (const tipo of tiposNotificacaoPreDefinidos) {
      const [record, created] = await tiponotificacaoModel.findOrCreate({
        where: {
          idnotas: tipo.idnotas,
          idtuser: tipo.idtuser,
          iduser: tipo.iduser,
          idtnote: tipo.idtnote,
        },
        defaults: {
          descricao: tipo.descricao,
        },
      });
      if (created) {
        console.log(`Tipo de notificação inserido: ${tipo.descricao}`);
      }
    }
  })
  .catch((err) => {
    console.log("Failed to sync db: " + (err && err.message ? err.message : JSON.stringify(err)));
  });



// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
