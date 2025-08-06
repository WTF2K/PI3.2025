const { tiponotificacao } = require('../Models');
const { autenticarJWT } = require('../Middleware/authMiddleware');

exports.getAll = async (req, res) => {
  try {
    const lista = await tiponotificacao.findAll();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const registo = await tiponotificacao.findOne({
      where: {
        idnotas: req.params.idnotas,
        idtuser: req.params.idtuser,
        iduser: req.params.iduser,
        idtnote: req.params.idtnote,
      },
    });

    if (!registo) return res.status(404).json({ message: 'Tipo de notificação não encontrado.' });
    res.json(registo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const novo = await tiponotificacao.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await tiponotificacao.update(req.body, {
      where: {
        idnotas: req.params.idnotas,
        idtuser: req.params.idtuser,
        iduser: req.params.iduser,
        idtnote: req.params.idtnote,
      },
    });

    if (!updated) return res.status(404).json({ message: 'Tipo de notificação não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await tiponotificacao.destroy({
      where: {
        idnotas: req.params.idnotas,
        idtuser: req.params.idtuser,
        iduser: req.params.iduser,
        idtnote: req.params.idtnote,
      },
    });

    if (!deleted) return res.status(404).json({ message: 'Tipo de notificação não encontrado.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
