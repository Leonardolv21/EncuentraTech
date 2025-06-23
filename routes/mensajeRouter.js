const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');

// GET /api/mensajes?conversacion=ID
router.get('/', mensajeController.listarPorConversacion);

// POST /api/mensajes
router.post('/', mensajeController.crear);

module.exports = router;
