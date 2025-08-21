const db = require('../Models'); // ajusta o caminho se for diferente
const propostas = db.propostas;
const empresas = db.empresas;

exports.getAll = async (req, res) => {
  try {
    const lista = await propostas.findAll({
      include: [
        {
          model: empresas,
          as: 'empresa', // nome do alias (vais definir já a seguir na associação)
          attributes: ['nome'] // só queremos o nome da empresa
        }
      ]
    });
    res.json(lista);
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
      vaga
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

// Obter propostas pendentes de validação
exports.getPendentes = async (req, res) => {
  try {
    const propostasPendentes = await propostas.findAll({
      where: { validada: false },
      include: [
        {
          model: empresas,
          as: 'empresa',
          attributes: ['nome']
        }
      ]
    });
    res.json(propostasPendentes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
