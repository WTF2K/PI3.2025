const { tipoproposta } = require('../Models');
const { autenticarJWT } = require('../Middleware/authMiddleware');

exports.getAll = async (req, res) => {
  try {
    const propostas = await tipoproposta.findAll();
    res.json(propostas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const proposta = await tipoproposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Tipo de proposta não encontrado.' });
    res.json(proposta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const novaProposta = await tipoproposta.create(req.body);
    res.status(201).json(novaProposta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await tipoproposta.update(req.body, {
      where: { idtproposta: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Tipo de proposta não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await tipoproposta.destroy({
      where: { idtproposta: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Tipo de proposta não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
