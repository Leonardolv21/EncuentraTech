const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');


router.get('/:id', usuarioController.obtenerUsuarioPorId);

module.exports = router;
