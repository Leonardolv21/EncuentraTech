const express = require('express');
const router = express.Router();
const conversacionController = require('../controllers/conversacionController');


router.get('/', conversacionController.listarPorAnuncio);

router.post('/', conversacionController.crear);


router.post('/buscar-o-crear', conversacionController.buscarOcrear);

router.get("/:id", conversacionController.obtenerDetalles);


router.get("/usuario/:userId", conversacionController.listarPorUsuario);


router.get("/anuncios-vendedor/:anuncianteId", conversacionController.listarAnunciosVendedor);


router.get("/compras-usuario/:userId", conversacionController.listarComprasUsuario);


router.get("/interesados-por-anuncio/:anuncioId/:anuncianteId", conversacionController.listarInteresadosPorAnuncio);


module.exports = router;
