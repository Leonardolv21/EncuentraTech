const express = require('express');
const router = express.Router();
const guardadosController = require('../controllers/guardadosController');

// Ruta para guardar un anuncio
router.post('/', guardadosController.guardarAnuncio);

// Ruta para quitar un anuncio de guardados
router.delete('/', guardadosController.quitarAnuncio);

// Ruta para obtener todos los anuncios guardados de un usuario
router.get('/:usuarioId', guardadosController.obtenerAnunciosGuardados);

// Ruta para verificar si un anuncio está guardado por un usuario
router.get('/verificar/:usuarioId/:anuncioId', guardadosController.verificarEstadoGuardado);

module.exports = router;