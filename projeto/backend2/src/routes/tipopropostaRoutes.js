const express = require('express');
const router = express.Router();
const controller = require('../controllers/tipopropostaController');
const { autenticarJWT } = require('../Middleware/authMiddleware');

router.get('/',autenticarJWT, controller.getAll);
router.get('/:id',autenticarJWT, controller.getById);
router.post('/', controller.create);
router.put('/:id',autenticarJWT, controller.update);
router.delete('/:id',autenticarJWT, controller.delete);

module.exports = router;
