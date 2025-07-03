const guardadosRepository = require('../repositories/anunciosGuardadosRepository');

exports.guardarAnuncio = async (req, res) => {
    console.log('req.body en guardarAnuncio:', req.body);
  const { usuario_id, anuncio_id } = req.body;
  if (!usuario_id || !anuncio_id) {
    return res.status(400).json({ mensaje: 'Faltan IDs de usuario o anuncio.' });
  }
  try {
    await guardadosRepository.guardar(usuario_id, anuncio_id);
    res.status(201).json({ mensaje: 'Anuncio guardado correctamente.' });
  } catch (error) {
    console.error('Error en guardarAnuncio:', error);
    res.status(500).json({ mensaje: 'Error al guardar el anuncio.' });
  }
};

exports.quitarAnuncio = async (req, res) => {
    console.log('req.body en guardarAnuncio:', req.body);
  const { usuario_id, anuncio_id } = req.body;
  if (!usuario_id || !anuncio_id) {
    return res.status(400).json({ mensaje: 'Faltan IDs de usuario o anuncio.' });
  }
  try {
    await guardadosRepository.quitar(usuario_id, anuncio_id);
    res.status(200).json({ mensaje: 'Anuncio quitado de guardados.' });
  } catch (error) {
    console.error('Error en quitarAnuncio:', error);
    res.status(500).json({ mensaje: 'Error al quitar el anuncio.' });
  }
};

exports.obtenerAnunciosGuardados = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const anuncios = await guardadosRepository.obtenerPorUsuario(usuario_id);

    anuncios.forEach(anuncio => {
      if (anuncio.imagen_url) {
        anuncio.imagen_url = '/' + anuncio.imagen_url.replace(/\\/g, '/');
      } else {
        anuncio.imagen_url = null;
      }
    });
    console.log('Anuncios obtenidos para el usuario', usuario_id, ':', anuncios);
    res.json(anuncios);
  } catch (error) {
    console.error('Error en obtenerAnunciosGuardados:', error);
    res.status(500).json({ mensaje: 'Error al obtener los anuncios guardados.' });
  }
};

exports.verificarEstadoGuardado = async (req, res) => {
  const { usuario_id, anuncio_id } = req.params;
  try {
    const estaGuardado = await guardadosRepository.verificar(usuario_id, anuncio_id);
    res.json({ estaGuardado }); 
  } catch (error) {
    console.error('Error en verificarEstadoGuardado:', error);
    res.status(500).json({ mensaje: 'Error al verificar el estado del anuncio.' });
  }
};