// src/middleware/adminMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../Models");
const utilizadores = db.utilizadores;

// Middleware para verificar se o utilizador é admin (idtuser = 1)
async function verificarAdmin(req, res, next) {
  try {
    // Primeiro verifica se tem token válido
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const token = tokenFromHeader || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seuSegredoAqui');
    
    // Busca o utilizador na base de dados para verificar se é admin
    const utilizador = await utilizadores.findOne({
      where: { iduser: decoded.iduser }
    });

    if (!utilizador) {
      return res.status(404).json({ mensagem: "Utilizador não encontrado" });
    }

    // Verifica se é admin (idtuser = 1)
    if (utilizador.idtuser !== 1) {
      return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores podem aceder a esta funcionalidade." });
    }

    // Adiciona informações do utilizador à request
    req.user = {
      iduser: utilizador.iduser,
      idtuser: utilizador.idtuser,
      nome: utilizador.nome,
      email: utilizador.email
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ mensagem: "Token inválido" });
    }
    console.error("Erro no middleware admin:", err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

// Middleware para verificar se o utilizador é admin ou gestor (idtuser = 1 ou 2)
async function verificarAdminOuGestor(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const token = tokenFromHeader || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seuSegredoAqui');
    
    const utilizador = await utilizadores.findOne({
      where: { iduser: decoded.iduser }
    });

    if (!utilizador) {
      return res.status(404).json({ mensagem: "Utilizador não encontrado" });
    }

    // Verifica se é admin (1) ou gestor (2)
    if (utilizador.idtuser !== 1 && utilizador.idtuser !== 2) {
      return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores e gestores podem aceder a esta funcionalidade." });
    }

    req.user = {
      iduser: utilizador.iduser,
      idtuser: utilizador.idtuser,
      nome: utilizador.nome,
      email: utilizador.email
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ mensagem: "Token inválido" });
    }
    console.error("Erro no middleware admin/gestor:", err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

module.exports = {
  verificarAdmin,
  verificarAdminOuGestor
};