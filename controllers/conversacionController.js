const conversacionRepository = require('../repositories/conversacionRepository');

exports.listarPorAnuncio = async (req, res) => {
  const anuncioId = parseInt(req.query.anuncio);
  if (isNaN(anuncioId)) {
    return res.status(400).json({ mensaje: 'ID de anuncio inválido' });
  }
  try {
    const convs = await conversacionRepository.obtenerPorAnuncio(anuncioId);
    res.json(convs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener conversaciones' });
  }
};

exports.crear = async (req, res) => {
  const { anuncio_id, interesado_id, anunciante_id } = req.body;
  if (!anuncio_id || !interesado_id || !anunciante_id) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  try {
    const id = await conversacionRepository.crearConversacion(anuncio_id, interesado_id, anunciante_id);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear la conversación' });
  }
};
