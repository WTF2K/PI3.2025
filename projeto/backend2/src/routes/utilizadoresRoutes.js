const express = require('express');
const router = express.Router();
const controller = require('../controllers/utilizadoresController');
const { autenticarJWT } = require('../Middleware/authMiddleware');

router.get('/nome/:nome', controller.getByNome);
router.get('/gestores', controller.getGestores);
router.get('/estudantes',autenticarJWT, controller.getEstudantes);
router.get('/estudantes/pedidos-remocao',autenticarJWT, controller.getEstudantesPedidoRemocao);
router.get('/estudantes/inativos',autenticarJWT, controller.getEstudantesInativos);
router.get('/simples',autenticarJWT, controller.getAllSimples);
router.get('/', autenticarJWT, controller.getAll);
router.get('/:id',autenticarJWT, controller.getById);
router.post('/', controller.create);
router.put('/:id', autenticarJWT, controller.update);
router.put('/:id/aprovar-remocao', autenticarJWT, controller.aprovarRemocao);
router.put('/:id/rejeitar-remocao', autenticarJWT, controller.rejeitarPedidoRemocao);
router.put('/:id/ativar', autenticarJWT, controller.ativarConta);
router.put('/:id/pedir-remocao', autenticarJWT, controller.pedirRemocao);
router.delete('/:id', autenticarJWT, controller.delete);
router.delete('/', autenticarJWT, controller.deleteAll);


module.exports = router;
