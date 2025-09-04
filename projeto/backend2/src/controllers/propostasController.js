const db = require('../Models'); // ajusta o caminho se for diferente
const propostas = db.propostas;
const empresas = db.empresas;

exports.getAll = async (req, res) => {
  try {
    const lista = await propostas.findAll();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NOVO: Obter propostas por empresa
exports.getByEmpresa = async (req, res) => {
  try {
    const { idempresa } = req.params;
    
    const propostasEmpresa = await propostas.findAll({
      where: { idempresa: idempresa },
      order: [['data_submissao', 'DESC']]
    });
    
    res.json(propostasEmpresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NOVO: Obter propostas ativas por empresa
exports.getAtivasByEmpresa = async (req, res) => {
  try {
    const { idempresa } = req.params;
    
    const propostasAtivas = await propostas.findAll({
      where: { 
        idempresa: idempresa,
        ativa: true,
        atribuida_estudante: false
      },
      order: [['data_submissao', 'DESC']]
    });
    
    res.json(propostasAtivas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NOVO: Obter propostas atribuídas por empresa
exports.getAtribuidasByEmpresa = async (req, res) => {
  try {
    const { idempresa } = req.params;
    
    const propostasAtribuidas = await propostas.findAll({
      where: { 
        idempresa: idempresa,
        atribuida_estudante: true
      },
      order: [['data_atribuicao', 'DESC']]
    });
    
    res.json(propostasAtribuidas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const proposta = await propostas.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada.' });
    res.json(proposta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      idtuser,
      iduser,
      idempresa,
      idtproposta,
      idtcontrato,
      categoria,
      localizacao,
      data_submissao,
      nome,
      descricao,
      vaga
    } = req.body;

    // Validação básica — podes ajustar conforme o que é obrigatório no teu caso
    /*if (!nome || !descricao || !idtproposta || !idtcontrato) {
      return res.status(400).json({
        error: "Campos obrigatórios em falta: 'nome', 'descricao', 'idtproposta' e 'idtcontrato' são necessários."
      });
    }*/

     

    // Criar a nova proposta
    const novaProposta = await propostas.create({
      idtuser,
      iduser,
      idempresa,
      idtproposta,
      idtcontrato,
      categoria,
      localizacao,
      data_submissao,
      nome,
      descricao,
      vaga,
      ativa: true,
      atribuida_estudante: false
    });

    res.status(201).json(novaProposta);

  } catch (err) {
    console.error('Erro ao criar proposta:', err);

    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: 'Erro de chave estrangeira: verifica se os IDs relacionados existem.'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de proposta inválido." });
    }

    const {
      idtuser,
      iduser,
      idempresa,
      idtproposta,
      idtcontrato,
      categoria,
      localizacao,
      data_submissao,
      nome,
      descricao,
      vaga
    } = req.body;

    const dadosAtualizar = {};

    if (idtuser !== undefined) dadosAtualizar.idtuser = parseInt(idtuser);
    if (iduser !== undefined) dadosAtualizar.iduser = parseInt(iduser);
    if (idempresa !== undefined) dadosAtualizar.idempresa = parseInt(idempresa);
    if (idtproposta !== undefined) dadosAtualizar.idtproposta = parseInt(idtproposta);
    if (idtcontrato !== undefined) dadosAtualizar.idtcontrato = parseInt(idtcontrato);
    if (categoria !== undefined) dadosAtualizar.categoria = categoria;
    if (localizacao !== undefined) dadosAtualizar.localizacao = localizacao;
    if (data_submissao !== undefined) dadosAtualizar.data_submissao = data_submissao;
    if (nome !== undefined) dadosAtualizar.nome = nome;
    if (descricao !== undefined) dadosAtualizar.descricao = descricao;
    if (vaga !== undefined) dadosAtualizar.vaga = vaga;

    const [updated] = await propostas.update(dadosAtualizar, {
      where: { idproposta: id }
    });

    if (!updated) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    res.status(200).json({ message: "Proposta atualizada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar proposta: " + err.message });
  }
};

// NOVO: Ativar/Desativar proposta
exports.toggleStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de proposta inválido." });
    }

    const proposta = await propostas.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    // Se a proposta está atribuída a um estudante, não pode ser desativada
    if (proposta.atribuida_estudante && proposta.ativa) {
      return res.status(400).json({ 
        message: "Não é possível desativar uma proposta que foi atribuída a um estudante." 
      });
    }

    const novoStatus = !proposta.ativa;
    
    const [updated] = await propostas.update(
      { ativa: novoStatus },
      { where: { idproposta: id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    res.status(200).json({ 
      message: novoStatus ? "Proposta ativada com sucesso." : "Proposta desativada com sucesso.",
      ativa: novoStatus
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao alterar status da proposta: " + err.message });
  }
};

// NOVO: Tornar proposta disponível novamente (reativar)
exports.reativar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de proposta inválido." });
    }

    const proposta = await propostas.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    // Só pode reativar se não estiver atribuída a um estudante
    if (proposta.atribuida_estudante) {
      return res.status(400).json({ 
        message: "Não é possível reativar uma proposta que foi atribuída a um estudante." 
      });
    }

    const [updated] = await propostas.update(
      { 
        ativa: true,
        atribuida_estudante: false,
        id_estudante_atribuido: null,
        data_atribuicao: null
      },
      { where: { idproposta: id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    res.status(200).json({ message: "Proposta reativada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao reativar proposta: " + err.message });
  }
};

// NOVO: Atribuir proposta a um estudante
exports.atribuirEstudante = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { id_estudante } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de proposta inválido." });
    }

    if (!id_estudante || isNaN(id_estudante)) {
      return res.status(400).json({ error: "ID do estudante inválido." });
    }

    const proposta = await propostas.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    if (!proposta.ativa) {
      return res.status(400).json({ message: "Não é possível atribuir uma proposta inativa." });
    }

    if (proposta.atribuida_estudante) {
      return res.status(400).json({ message: "Esta proposta já foi atribuída a um estudante." });
    }

    const [updated] = await propostas.update(
      { 
        atribuida_estudante: true,
        id_estudante_atribuido: id_estudante,
        data_atribuicao: new Date().toISOString().split('T')[0],
        ativa: false // Desativa automaticamente quando atribuída
      },
      { where: { idproposta: id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    res.status(200).json({ message: "Proposta atribuída ao estudante com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atribuir proposta: " + err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await propostas.destroy({
      where: { idproposta: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Proposta não encontrada.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validar proposta (aprovar)
exports.validar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { validada, validado_por } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID de proposta inválido." });
    }

    const dadosAtualizar = {
      validada: validada,
      data_validacao: new Date().toISOString().split('T')[0],
      validado_por: validado_por || null
    };

    const [updated] = await propostas.update(dadosAtualizar, {
      where: { idproposta: id }
    });

    if (!updated) {
      return res.status(404).json({ message: "Proposta não encontrada." });
    }

    res.status(200).json({ message: "Proposta validada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao validar proposta: " + err.message });
  }
};

// Obter propostas pendentes de validação (ainda sem data_validacao)
exports.getPendentes = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const propostasPendentes = await propostas.findAll({
      where: {
        [Op.or]: [
          { validada: null },
          { validada: false }
        ],
        data_validacao: { [Op.is]: null }
      }
    });
    res.json(propostasPendentes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
