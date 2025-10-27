const express = require('express');
const router = express.Router();
const controller = require('../controllers/empresasController');
const { autenticarJWT } = require('../Middleware/authMiddleware');
const { verificarAdmin } = require('../Middleware/adminMiddleware');

// Rota para admin obter todas as empresas (para formulário de criação de propostas)
router.get('/admin/lista', verificarAdmin, controller.getAll);

router.get('/', autenticarJWT, controller.getAll);
router.get('/:id', autenticarJWT, controller.getById);
router.post('/', controller.create);
router.put('/:id',autenticarJWT, controller.update);
router.delete('/:id', autenticarJWT, controller.delete);

module.exports = router;
