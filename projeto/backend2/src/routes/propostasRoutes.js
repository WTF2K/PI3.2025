const express = require('express');
const router = express.Router();
const controller = require('../controllers/propostasController');
const { autenticarJWT } = require('../Middleware/authMiddleware');
const { verificarAdmin, verificarAdminOuGestor } = require('../Middleware/adminMiddleware');


// IMPORTANTE: Rotas mais específicas primeiro
// Rotas para EMPRESAS
router.get('/empresa/:idempresa/ativas', autenticarJWT, controller.getAtivasByEmpresa);
router.get('/empresa/:idempresa/atribuidas', autenticarJWT, controller.getAtribuidasByEmpresa);
router.get('/empresa/:idempresa', autenticarJWT, controller.getByEmpresa);

// Rotas ADMIN
router.get('/admin/todas', verificarAdmin, controller.getAllAdmin);
router.post('/admin/criar-por-empresa', verificarAdmin, controller.criarPorEmpresa);
router.put('/admin/:id/forcar-validacao', verificarAdmin, controller.forcarValidacao);
router.delete('/admin/:id/forcar-eliminacao', verificarAdmin, controller.forcarEliminacao);

// Rotas gerais
router.get('/',autenticarJWT, controller.getAll);
router.get('/pendentes', verificarAdminOuGestor, controller.getPendentes);
router.post('/', controller.create);
router.put('/:id/validar', verificarAdminOuGestor, controller.validar);
router.put('/:id/toggle-status', verificarAdminOuGestor, controller.toggleStatus);
router.put('/:id/reativar', verificarAdminOuGestor, controller.reativar);
router.put('/:id/atribuir-estudante', verificarAdminOuGestor, controller.atribuirEstudante);
router.get('/:id',autenticarJWT, controller.getById);
router.put('/:id',autenticarJWT, controller.update);
router.delete('/:id',autenticarJWT, controller.delete);

module.exports = router;
