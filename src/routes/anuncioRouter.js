const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const anuncioController = require('../controllers/anuncioController');

const uploadDirectory = process.env.UPLOADS_PATH || 'uploads';


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.array('imagenes', 5), anuncioController.crearAnuncio);

router.put('/:id', upload.array('imagenes', 5), anuncioController.editarAnuncio);

router.get('/buscar', anuncioController.buscarAnuncios);

router.patch('/:id/estado', anuncioController.cambiarEstado);

router.delete('/:id', anuncioController.eliminarAnuncio);

router.get('/:usuarioId', anuncioController.obtenerAnunciosPorUsuario);

router.get('/detalle/:id', anuncioController.obtenerAnuncioPorId);

router.get('/', anuncioController.obtenerTodosLosAnuncios);


module.exports = router;
