const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');


router.get('/', mensajeController.listarPorConversacion);

router.post('/', mensajeController.crear);

module.exports = router;
