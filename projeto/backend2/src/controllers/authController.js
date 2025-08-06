const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');
const bcrypt =  require('bcryptjs');
/*const sequelize = require('../config/database');
const initModels = require('../Models/init-models');
const models = initModels(sequelize);
const { utilizadores, tipoutilizador } = models;*/
const db = require("../Models");
const {utilizadores, tipoutilizador, empresas} = db;


const jwtSecret = process.env.JWT_SECRET || 'seuSegredoAqui';

const register = async (req, res) => {
  console.log("🔐 A função register foi chamada!");
  console.log('Login attempt:', { email, senha: senha ? '***' : 'missing' });

  // Remover espaços em branco dos campos recebidos
  const email = req.body.email?.trim();
  const senha = req.body.senha?.trim();

  try {
    const existingUser = await utilizadores.findOne({ where: { email } });
    if (existingUser) {
      console.log('User found:', user ? {
      id: user.id,
      email: user.email,
      hasPassword: !!user.senha,
      userType: user.idtuser_tipoutilizador?.nome
    } : 'No user found');
      return res.status(400).json({ error: 'Email já registado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await utilizadores.create({
      email,
      senha: hashedPassword,
    });

    return res.status(201).json({
      message: 'Utilizador registado com sucesso',
      user: { id: newUser.iduser, email: newUser.email }
    });

  } catch (error) {
    console.error('Erro ao registar utilizador:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const login = async (req, res) => {
  console.log('=== AUTH CONTROLLER LOGIN CALLED ===');
  console.log('Request body:', req.body);
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  // Remover espaços em branco dos campos recebidos
  const nome = req.body.nome?.trim();
  const email = req.body.email?.trim();
  const senha = req.body.senha?.trim();
  const idtuser = req.body.idtuser;

  if (!nome || !email || !senha || !idtuser) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha, idtuser.' });
  }

  try {
    const user = await utilizadores.findOne({
      where: { email },
      include: [{ model: tipoutilizador, as: 'idtuser_tipoutilizador' }],
      attributes: ['iduser', 'email', 'senha', 'idtuser']
    });

    console.log('User encontrado:', user);
    console.log('Senha recebida (input):', senha);

    if (!user || !user.senha) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    console.log('Password validation:', {
      providedPassword: senha ? '' : 'missing',
      storedPassword: user.senha ? '' : 'missing',
      passwordStartsWithHash: user.senha?.startsWith('$2b$') || false
    });

    const senhaValida = await bcrypt.compare(senha, user.senha.trim());
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      {
        id: user.iduser,
        id_tipo_user: user.idtuser,
        email: user.email.trim()
      },
      jwtSecret,
      { expiresIn: '365d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 ano
    });

    let extraFields = {};
    if (user.idtuser === 3) {
      // Buscar empresa associada
      const empresa = await empresas.findOne({ where: { iduser: user.iduser } });
      if (empresa) {
        extraFields.idempresa = empresa.idempresa;
        extraFields.nome = empresa.nome;
      } else {
        extraFields.idempresa = null;
        extraFields.nome = user.nome; // fallback
      }
    } else {
      extraFields.nome = user.nome; // para outros tipos de utilizador
    }

    return res.status(200).json({
      message: 'Login bem-sucedido',
      token: token,
      user: {
        id: user.iduser,
        email: user.email.trim(),
        tipo: user.idtuser,
        ...extraFields
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = { login, register };
