const express = require('express');
const router = express.Router();
const guardadosController = require('../controllers/guardadosController');


router.post('/', guardadosController.guardarAnuncio);

router.delete('/', guardadosController.quitarAnuncio);

router.get('/:usuario_id', guardadosController.obtenerAnunciosGuardados);

router.get('/verificar/:usuario_id/:anuncio_id', guardadosController.verificarEstadoGuardado);

module.exports = router;