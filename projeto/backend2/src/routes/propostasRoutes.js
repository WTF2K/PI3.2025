const express = require('express');
const router = express.Router();
const controller = require('../controllers/propostasController');
const { autenticarJWT } = require('../Middleware/authMiddleware');


router.get('/',autenticarJWT, controller.getAll);
router.get('/pendentes',autenticarJWT, controller.getPendentes);
router.get('/:id',autenticarJWT, controller.getById);
router.post('/', controller.create);
router.put('/:id',autenticarJWT, controller.update);
router.put('/:id/validar',autenticarJWT, controller.validar);
router.delete('/:id',autenticarJWT, controller.delete);

// NOVAS ROTAS PARA EMPRESAS
router.get('/empresa/:idempresa', autenticarJWT, controller.getByEmpresa);
router.get('/empresa/:idempresa/ativas', autenticarJWT, controller.getAtivasByEmpresa);
router.get('/empresa/:idempresa/atribuidas', autenticarJWT, controller.getAtribuidasByEmpresa);
router.put('/:id/toggle-status', autenticarJWT, controller.toggleStatus);
router.put('/:id/reativar', autenticarJWT, controller.reativar);
router.put('/:id/atribuir-estudante', autenticarJWT, controller.atribuirEstudante);

module.exports = router;
