const { notificacoes } = require('../Models');
const { autenticarJWT } = require('../Middleware/authMiddleware');

exports.getAll = async (req, res) => {
  try {
    const lista = await notificacoes.findAll();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getById = async (req, res) => {
  try {
    const notificacao = await notificacoes.findByPk(req.params.id);
    if (!notificacao) return res.status(404).json({ message: 'Notificação não encontrada.' });
    res.json(notificacao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { mensagem, lida, data_envio } = req.body;

    // Validação: mensagem e data_envio são obrigatórios
    if (!mensagem || !data_envio) {
      return res.status(400).json({
        error: "Os campos 'mensagem' e 'data_envio' são obrigatórios."
      });
    }

    // Criar a notificação
    const novaNotificacao = await notificacoes.create({
      mensagem,
      lida: lida || "Não", // valor por defeito, se não for enviado
      data_envio
    });

    res.status(201).json({
      message: "Notificação criada com sucesso!",
      dados: novaNotificacao
    });

  } catch (err) {
    console.error("Erro ao criar notificação:", err);
    res.status(500).json({
      error: "Erro ao criar a notificação.",
      detalhes: err.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await notificacoes.update(req.body, {
      where: { idnotas: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Notificação não encontrada.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await notificacoes.destroy({
      where: { idnotas: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Notificação não encontrada.' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
