const express = require('express');
const router = express.Router();
const conversacionController = require('../controllers/conversacionController');

// GET /api/conversaciones?anuncio=ID
router.get('/', conversacionController.listarPorAnuncio);

// POST /api/conversaciones
router.post('/', conversacionController.crear);

// NUEVA RUTA: Para buscar o crear una conversación
router.post('/buscar-o-crear', conversacionController.buscarOcrear);
// NUEVA RUTA: Para obtener detalles de una conversación por ID
router.get("/:id", conversacionController.obtenerDetalles);

// NUEVA RUTA: Para obtener todas las conversaciones de un usuario
router.get("/usuario/:userId", conversacionController.listarPorUsuario);

// NUEVA RUTA: Para obtener anuncios de un vendedor con sus conversaciones asociadas
router.get("/anuncios-vendedor/:anuncianteId", conversacionController.listarAnunciosVendedor);

// NUEVA RUTA: Para obtener interesados por anuncio para un anunciante
router.get("/interesados-por-anuncio/:anuncioId/:anuncianteId", conversacionController.listarInteresadosPorAnuncio);


module.exports = router;
