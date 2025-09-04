const db = require("../Models");
const utilizadores = db.utilizadores;
const propostas = db.propostas;
const bcrypt = require("bcryptjs");


exports.getAllSimples = async (req, res) => {
  try {
    const lista = await utilizadores.findAll(); // sem incluir propostas
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter utilizadores: " + err.message });
  }
};


// Listar todos os utilizadores
exports.getAll = async (req, res) => {
  try {
    const lista = await utilizadores.findAll({
      //include: [{ model: propostas }], // Inclui propostas se necessário
    });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter utilizadores: " + err.message });
  }
};

// Obter utilizador por ID
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const user = await utilizadores.findOne({
      where: { iduser: id },
      //include: [{ model: propostas }],
    });

    if (!user)
      return res.status(404).json({ message: "Utilizador não encontrado." });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter utilizador: " + err.message });
  }
};

// Obter apenas gestores
exports.getGestores = async (req, res) => {
  try {
    const gestores = await utilizadores.findAll({
      where: { idtuser: 2 },
      include: [{ model: propostas }],
    });
    res.json(gestores);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter gestores: " + err.message });
  }
};

// Criar novo utilizador
exports.create = async (req, res) => {

  try {
    const {
      nome,
      email,
      senha,
      idtuser,
      curso,
      ano,
      idade,
      interesses,
      competencias,
      percurso,
    } = req.body;

    if (!nome || !email || !senha || !idtuser) {
      return res.status(400).json({ message: "Campos obrigatórios: nome, email, senha, idtuser." });
    }

    const tipo = Number(idtuser);
    const tiposValidos = [1, 2, 3, 4];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ message: "Tipo de utilizador inválido." });
    }

    const existente = await utilizadores.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ message: "Email já está em uso." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const dadosNovoUser = {
      nome,
      email,
      senha: hashedPassword,
      idtuser: tipo,
      data_criacao: new Date(),
    };

    if (tipo === 4) {
      if (curso) dadosNovoUser.curso = curso;
      if (ano) dadosNovoUser.ano = ano;
      if (idade) dadosNovoUser.idade = idade;
      if (interesses) dadosNovoUser.interesses = interesses;
      if (competencias) dadosNovoUser.competencias = competencias;
      if (percurso) dadosNovoUser.percurso = percurso;
    }

    const novoUtilizador = await utilizadores.create(dadosNovoUser);
    res.status(201).json(novoUtilizador);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar utilizador: " + err.message });
  }
};

// Atualizar utilizador existente
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de utilizador inválido." });
    }

    const {
      nome,
      email,
      senha,
      idtuser,
      curso,
      ano,
      idade,
      interesses,
      competencias,
      percurso,
    } = req.body;

    const dadosAtualizar = {};
    if (nome !== undefined) dadosAtualizar.nome = nome;
    if (email !== undefined) dadosAtualizar.email = email;
    if (senha !== undefined && senha.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);
      dadosAtualizar.senha = hashedPassword;
    }
    if (idtuser !== undefined) dadosAtualizar.idtuser = parseInt(idtuser);
    if (curso !== undefined) dadosAtualizar.curso = curso;
    if (ano !== undefined) dadosAtualizar.ano = parseInt(ano);
    if (idade !== undefined) dadosAtualizar.idade = parseInt(idade);
    if (interesses !== undefined) dadosAtualizar.interesses = interesses;
    if (competencias !== undefined) dadosAtualizar.competencias = competencias;
    if (percurso !== undefined) dadosAtualizar.percurso = percurso;

    const [updated] = await utilizadores.update(dadosAtualizar, {
      where: { iduser: id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    res.status(200).json({ message: "Utilizador atualizado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar utilizador: " + err.message });
  }
};

// Eliminar utilizador
exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const deleted = await utilizadores.destroy({ where: { iduser: id } });
    if (!deleted)
      return res.status(404).json({ message: "Utilizador não encontrado." });

    res.status(200).json({ message: "Utilizador eliminado com sucesso." });
  } catch (err) {
    console.error("Erro ao eliminar utilizador:", err);
    res.status(500).json({ error: "Erro ao eliminar utilizador: " + err.message });
  }
};

// Eliminar todos os utilizadores
exports.deleteAll = async (req, res) => {
  try {
    const deletedCount = await utilizadores.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({ message: `${deletedCount} utilizadores eliminados com sucesso.` });
  } catch (err) {
    res.status(500).json({ error: "Erro ao eliminar utilizadores: " + err.message });
  }
};

// Obter utilizador por nome
exports.getByNome = async (req, res) => {
  try {
    const nome = req.params.nome;
    const user = await utilizadores.findOne({ where: { nome } });

    if (!user) {
      return res.status(404).json({ message: "Utilizador não encontrado" });
    }

    return res.json({ idtuser: user.idtuser });
  } catch (error) {
    console.error("Erro ao obter utilizador por nome:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

// Obter apenas estudantes
exports.getEstudantes = async (req, res) => {
  try {
    const estudantes = await utilizadores.findAll({
      where: { idtuser: 4 }
    });
    res.json(estudantes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter estudantes: " + err.message });
  }
};

// Obter estudantes com pedidos de remoção
exports.getEstudantesPedidoRemocao = async (req, res) => {
  try {
    const estudantes = await utilizadores.findAll({
      where: { 
        idtuser: 4,
        pedido_remocao: true
      }
    });
    res.json(estudantes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter estudantes: " + err.message });
  }
};

// Obter estudantes inativos
exports.getEstudantesInativos = async (req, res) => {
  try {
    const estudantes = await utilizadores.findAll({
      where: { 
        idtuser: 4,
        ativo: false
      }
    });
    res.json(estudantes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter estudantes inativos: " + err.message });
  }
};

// Aprovar pedido de remoção de estudante
exports.aprovarRemocao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de utilizador inválido." });
    }

    const [updated] = await utilizadores.update({
      ativo: false,
      data_remocao: new Date().toISOString().split('T')[0],
      pedido_remocao: false
    }, {
      where: { iduser: id, idtuser: 4 }
    });

    if (!updated) {
      return res.status(404).json({ message: "Estudante não encontrado." });
    }

    res.status(200).json({ message: "Estudante removido com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao aprovar remoção: " + err.message });
  }
};

// Rejeitar pedido de remoção de estudante
exports.rejeitarPedidoRemocao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de utilizador inválido." });
    }

    const [updated] = await utilizadores.update({
      pedido_remocao: false
    }, {
      where: { iduser: id, idtuser: 4 }
    });

    if (!updated) {
      return res.status(404).json({ message: "Estudante não encontrado." });
    }

    res.status(200).json({ message: "Pedido de remoção rejeitado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao rejeitar pedido: " + err.message });
  }
};

// Estudante pede remoção (marca pedido_remocao = true)
exports.pedirRemocao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de utilizador inválido." });
    }

    const [updated] = await utilizadores.update({
      pedido_remocao: true
    }, {
      where: { iduser: id, idtuser: 4 }
    });

    if (!updated) {
      return res.status(404).json({ message: "Estudante não encontrado." });
    }

    res.status(200).json({ message: "Pedido de remoção enviado." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao enviar pedido: " + err.message });
  }
};

// Gestor reativa/ativa conta do estudante
exports.ativarConta = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de utilizador inválido." });
    }

    const [updated] = await utilizadores.update({
      ativo: true,
      pedido_remocao: false,
      data_remocao: null
    }, {
      where: { iduser: id, idtuser: 4 }
    });

    if (!updated) {
      return res.status(404).json({ message: "Estudante não encontrado." });
    }

    res.status(200).json({ message: "Conta do estudante ativada." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao ativar conta: " + err.message });
  }
};
