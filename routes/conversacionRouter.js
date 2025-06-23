const express = require('express');
const router = express.Router();
const conversacionController = require('../controllers/conversacionController');

// GET /api/conversaciones?anuncio=ID
router.get('/', conversacionController.listarPorAnuncio);

// POST /api/conversaciones
router.post('/', conversacionController.crear);

module.exports = router;
