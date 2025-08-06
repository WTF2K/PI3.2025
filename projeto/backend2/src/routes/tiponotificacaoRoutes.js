const express = require('express');
const router = express.Router();
const controller = require('../controllers/tiponotificacaoController');
const { autenticarJWT } = require('../Middleware/authMiddleware');

router.get('/',/* autenticarJWT,*/controller.getAll);
router.get('/:idnotas/:idtuser/:iduser/:idtnote'/*,autenticarJWT*/, controller.getById);
router.post('/', controller.create);
router.put('/:idnotas/:idtuser/:iduser/:idtnote',/*autenticarJWT,*/ controller.update);
router.delete('/:idnotas/:idtuser/:iduser/:idtnote',/*autenticarJWT,*/ controller.delete);

module.exports = router;
