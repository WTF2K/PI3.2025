const express = require('express');
const router = express.Router();
const controller = require('../controllers/utilizadoresController');
const { autenticarJWT } = require('../Middleware/authMiddleware');

router.get('/nome/:nome', controller.getByNome);
router.get('/gestores', controller.getGestores);
router.get('/simples',autenticarJWT, controller.getAllSimples);
router.get('/', autenticarJWT, controller.getAll);
router.get('/:id',autenticarJWT, controller.getById);
router.post('/', controller.create);
router.put('/:id', autenticarJWT, controller.update);
router.delete('/:id', autenticarJWT, controller.delete);
router.delete('/', autenticarJWT, controller.deleteAll);


module.exports = router;
