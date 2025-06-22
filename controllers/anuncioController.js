const path = require('path');
const anuncioRepository = require('../repositories/anuncioRepository');

exports.crearAnuncio = async (req, res) => {
  try {
    const { titulo, descripcion, precio, usuario_id, categoria_id } = req.body;

    if (!titulo || !descripcion || !precio || !usuario_id || !categoria_id) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const fecha_publicacion = new Date().toISOString().split('T')[0];
    const estado = true;

    const anuncioId = await anuncioRepository.insertarAnuncio(
      titulo,
      descripcion,
      precio,
      estado,
      fecha_publicacion,
      usuario_id,
      categoria_id,
      req.files
    );

    res.status(201).json({ mensaje: 'Anuncio creado correctamente', anuncioId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor al crear el anuncio' });
  }
};


exports.obtenerAnunciosPorUsuario = async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId);

  if (isNaN(usuarioId)) {
    return res.status(400).json({ mensaje: 'ID de usuario inválido' });
  }

  try {
    const anuncios = await anuncioRepository.obtenerAnunciosPorUsuario(usuarioId);

    if (anuncios.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron anuncios para este usuario" });
    }

    res.json(anuncios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener anuncios del usuario" });
  }
};
exports.obtenerAnuncioPorId = async (req, res) => {
  const anuncioId = parseInt(req.params.id);

  if (isNaN(anuncioId)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const anuncio = await anuncioRepository.obtenerAnuncioPorId(anuncioId);
    if (!anuncio) {
      return res.status(404).json({ mensaje: 'Anuncio no encontrado' });
    }

   if (anuncio.imagen_url) {
     anuncio.imagen_url = '/' + anuncio.imagen_url.replace(/\\/g, '/');
    } else {
     anuncio.imagen_url = null;
    }


    res.json(anuncio);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el anuncio por ID' });
  }
};
