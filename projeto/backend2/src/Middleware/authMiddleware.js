// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function autenticarJWT(req, res, next) {
  // Tenta buscar o token nos headers ou nos cookies
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1]; // "Bearer token"
  const token = tokenFromHeader || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'seuSegredoAqui', (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensagem: "Token inválido" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = {
  autenticarJWT,
};
