
const guardadosRepository = require('../repositories/anunciosGuardadosRepository');

// POST /api/guardados
exports.guardarAnuncio = async (req, res) => {
    console.log('req.body en guardarAnuncio:', req.body); // <-- AÑADE ESTA LÍNEA
  const { usuario_id, anuncio_id } = req.body;
  if (!usuario_id || !anuncio_id) {
    return res.status(400).json({ mensaje: 'Faltan IDs de usuario o anuncio.' });
  }
  try {
    await guardadosRepository.guardar(usuario_id, anuncio_id);
    res.status(201).json({ mensaje: 'Anuncio guardado correctamente.' });
  } catch (error) {
    console.error('Error en guardarAnuncio:', error); // <-- AÑADE ESTA LÍNEA
    res.status(500).json({ mensaje: 'Error al guardar el anuncio.' });
  }
};

// DELETE /api/guardados
exports.quitarAnuncio = async (req, res) => {
    console.log('req.body en guardarAnuncio:', req.body); // <-- AÑADE ESTA LÍNEA
  const { usuario_id, anuncio_id } = req.body;
  if (!usuario_id || !anuncio_id) {
    return res.status(400).json({ mensaje: 'Faltan IDs de usuario o anuncio.' });
  }
  try {
    await guardadosRepository.quitar(usuario_id, anuncio_id);
    res.status(200).json({ mensaje: 'Anuncio quitado de guardados.' });
  } catch (error) {
    console.error('Error en quitarAnuncio:', error); // <-- AÑADE ESTA LÍNEA
    res.status(500).json({ mensaje: 'Error al quitar el anuncio.' });
  }
};

// GET /api/guardados/:usuarioId
exports.obtenerAnunciosGuardados = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const anuncios = await guardadosRepository.obtenerPorUsuario(usuario_id);
    // Normalizamos las URLs de las imágenes
    anuncios.forEach(anuncio => {
      if (anuncio.imagen_url) {
        anuncio.imagen_url = '/' + anuncio.imagen_url.replace(/\\/g, '/');
      } else {
        anuncio.imagen_url = null; // o una imagen por defecto
      }
    });
    console.log('Anuncios obtenidos para el usuario', usuario_id, ':', anuncios); // <-- AÑADE ESTA LÍNEA
    res.json(anuncios);
  } catch (error) {
    console.error('Error en obtenerAnunciosGuardados:', error); // <-- AÑADE ESTA LÍNEA
    res.status(500).json({ mensaje: 'Error al obtener los anuncios guardados.' });
  }
};

// GET /api/guardados/verificar/:usuarioId/:anuncioId
exports.verificarEstadoGuardado = async (req, res) => {
  const { usuario_id, anuncio_id } = req.params;
  try {
    const estaGuardado = await guardadosRepository.verificar(usuario_id, anuncio_id);
    res.json({ estaGuardado }); // Devuelve { "estaGuardado": true } o { "estaGuardado": false }
  } catch (error) {
    console.error('Error en verificarEstadoGuardado:', error); // <-- AÑADE ESTA LÍNEA
    res.status(500).json({ mensaje: 'Error al verificar el estado del anuncio.' });
  }
};