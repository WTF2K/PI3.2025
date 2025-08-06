const { tipocontrato } = require('../Models');
const { autenticarJWT } = require('../Middleware/authMiddleware');

exports.getAll = async (req, res) => {
  try {
    const contratos = await tipocontrato.findAll();
    res.json(contratos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const contrato = await tipocontrato.findByPk(req.params.id);
    if (!contrato) return res.status(404).json({ message: 'Tipo de contrato não encontrado.' });
    res.json(contrato);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const novoContrato = await tipocontrato.create(req.body);
    res.status(201).json(novoContrato);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await tipocontrato.update(req.body, {
      where: { idtcontrato: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Tipo de contrato não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await tipocontrato.destroy({
      where: { idtcontrato: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Tipo de contrato não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
