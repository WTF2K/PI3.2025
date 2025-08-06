const db = require('../Models'); // ajusta o caminho se for diferente
const empresas = db.empresas;
//const { autenticarJWT } = require('../Middleware/authMiddleware');


exports.getAll = async (req, res) => {
  try {
    const lista = await empresas.findAll();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const empresa = await empresas.findOne({
      where: { idempresa: req.params.id }
    });

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    res.status(200).json(empresa);
  } catch (err) {
    console.error('Erro ao procurar empresa por ID:', err);
    res.status(500).json({ error: 'Erro ao procurar empresa.' });
  }
};



//criar empresa
exports.create = async (req, res) => {
  const { idtuser, iduser, nome, descricao, localizacao } = req.body;

  if (!idtuser || !iduser) {
    return res.status(400).json({ message: 'idtuser e iduser são obrigatórios.' });
  }

  try {
    const novaEmpresa = await empresas.create({
      idtuser,
      iduser,
      nome,
      descricao,
      localizacao
    });
    res.status(201).json(novaEmpresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a empresa existe
    const empresaExistente = await empresas.findOne({ where: { idempresa: id } });
    if (!empresaExistente) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    // Atualizar os campos com os dados enviados no body
    await empresas.update(req.body, { where: { idempresa: id } });

    // Obter os dados atualizados
    const empresaAtualizada = await empresas.findOne({ where: { idempresa: id } });

    res.status(200).json({
      message: 'Empresa atualizada com sucesso.',
      dados: empresaAtualizada
    });
  } catch (err) {
    console.error('Erro ao atualizar a empresa:', err);
    res.status(500).json({
      error: 'Erro ao atualizar a empresa.',
      detalhes: err.message
    });
  }
};



exports.delete = async (req, res) => {
  try {
    const deleted = await empresas.destroy({
      where: { idempresa: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Empresa não encontrada.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
