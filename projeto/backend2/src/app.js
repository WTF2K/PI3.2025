const express = require("express");
const app = express();
const db = require("./Models");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');




// Configurar CORS - apenas esta configuração
const allowedOrigins = [
  "http://localhost:5173",
  "https://pint3-2025-1.onrender.com"
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
  .sync()
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
    console.log("Failed to sync db: " + err.message);
  });



// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
