const { tipoutilizador } = require('../Models');
const { autenticarJWT } = require('../Middleware/authMiddleware');

exports.getAll = async (req, res) => {
  try {
    const tipos = await tipoutilizador.findAll();
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const tipo = await tipoutilizador.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ message: 'Tipo de utilizador não encontrado.' });
    res.json(tipo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const novoTipo = await tipoutilizador.create(req.body);
    res.status(201).json(novoTipo);
  } catch (err) {
    console.error('Erro ao criar tipo de utilizador:', err); // mostra no terminal

    res.status(500).json({
      error: err.message,
      details: err.errors || null // mostra detalhes da validação
    });
  }
};


exports.update = async (req, res) => {
  try {
    const [updated] = await tipoutilizador.update(req.body, {
      where: { idtuser: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Tipo de utilizador não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await tipoutilizador.destroy({
      where: { idtuser: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Tipo de utilizador não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
