const express = require('express');
const router = express.Router();
const controller = require('../controllers/utilizadoresController');
const { autenticarJWT } = require('../Middleware/authMiddleware');
const { verificarAdmin, verificarAdminOuGestor } = require('../Middleware/adminMiddleware');

// Rotas ADMIN
router.get('/admin/todos-estudantes', verificarAdmin, controller.adminGetTodosEstudantes);
router.post('/admin/criar-estudante', verificarAdmin, controller.adminCriarEstudante);
router.put('/admin/:id/aprovar-remocao', verificarAdmin, controller.adminAprovarRemocao);
router.put('/admin/:id/rejeitar-remocao', verificarAdmin, controller.adminRejeitarRemocao);
router.put('/admin/:id/alterar-credenciais', verificarAdmin, controller.adminAlterarCredenciais);

router.get('/nome/:nome', controller.getByNome);
router.get('/gestores', controller.getGestores);
router.get('/estudantes', verificarAdminOuGestor, controller.getEstudantes);
router.get('/estudantes/pedidos-remocao', verificarAdminOuGestor, controller.getEstudantesPedidoRemocao);
router.get('/estudantes/inativos', verificarAdminOuGestor, controller.getEstudantesInativos);
router.get('/simples',autenticarJWT, controller.getAllSimples);
router.get('/', autenticarJWT, controller.getAll);
router.get('/:id',autenticarJWT, controller.getById);
router.post('/', controller.create);
router.put('/:id', autenticarJWT, controller.update);
router.put('/:id/aprovar-remocao', verificarAdminOuGestor, controller.aprovarRemocao);
router.put('/:id/rejeitar-remocao', verificarAdminOuGestor, controller.rejeitarPedidoRemocao);
router.put('/:id/ativar', verificarAdminOuGestor, controller.ativarConta);
router.put('/:id/pedir-remocao', autenticarJWT, controller.pedirRemocao);
router.delete('/:id', autenticarJWT, controller.delete);
router.delete('/', autenticarJWT, controller.deleteAll);


module.exports = router;
