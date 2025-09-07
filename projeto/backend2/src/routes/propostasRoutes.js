const express = require('express');
const router = express.Router();
const controller = require('../controllers/propostasController');
const { autenticarJWT } = require('../Middleware/authMiddleware');


// IMPORTANTE: Rotas mais específicas primeiro

router.get('/empresa/:idempresa/ativas', autenticarJWT, controller.getAtivasByEmpresa);
router.get('/empresa/:idempresa/atribuidas', autenticarJWT, controller.getAtribuidasByEmpresa);
router.get('/empresa/:idempresa', autenticarJWT, controller.getByEmpresa);

// Rotas gerais
router.get('/',autenticarJWT, controller.getAll);
router.get('/pendentes',autenticarJWT, controller.getPendentes);
router.post('/', controller.create);
router.put('/:id/validar',autenticarJWT, controller.validar);
router.put('/:id/toggle-status', autenticarJWT, controller.toggleStatus);
router.put('/:id/reativar', autenticarJWT, controller.reativar);
router.put('/:id/atribuir-estudante', autenticarJWT, controller.atribuirEstudante);
router.get('/:id',autenticarJWT, controller.getById);
router.put('/:id',autenticarJWT, controller.update);
router.delete('/:id',autenticarJWT, controller.delete);

module.exports = router;
