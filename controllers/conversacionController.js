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

// NUEVA FUNCIÓN: Buscar o crear una conversación
exports.buscarOcrear = async (req, res) => {
  const { anuncio_id, interesado_id, anunciante_id } = req.body;
  if (!anuncio_id || !interesado_id || !anunciante_id) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    let conversacion = await conversacionRepository.obtenerConversacionPorParticipantesYAnuncio(
      anuncio_id,
      interesado_id,
      anunciante_id
    );

    if (conversacion) {
      // Si la conversación existe, la retornamos
      return res.status(200).json({ id: conversacion.id, mensaje: 'Conversación existente', creada: false });
    } else {
      // Si no existe, la creamos
      const id = await conversacionRepository.crearConversacion(anuncio_id, interesado_id, anunciante_id);
      return res.status(201).json({ id, mensaje: 'Conversación creada', creada: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al buscar o crear la conversación' });
  }
};

// NUEVA FUNCIÓN: Obtener detalles de una conversación
exports.obtenerDetalles = async (req, res) => {
  const conversacionId = parseInt(req.params.id);
  if (isNaN(conversacionId)) {
    return res.status(400).json({ mensaje: "ID de conversación inválido" });
  }
  try {
    const detalles = await conversacionRepository.obtenerDetallesConversacion(conversacionId);
    if (!detalles) {
      return res.status(404).json({ mensaje: "Conversación no encontrada" });
    }
    res.json(detalles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener detalles de la conversación" });
  }
};
// NUEVA FUNCIÓN: Obtener todas las conversaciones de un usuario
exports.listarPorUsuario = async (req, res) => {
  const userId = parseInt(req.params.userId); // Asumiendo que el ID del usuario viene en los parámetros de la ruta
  if (isNaN(userId)) {
    return res.status(400).json({ mensaje: "ID de usuario inválido" });
  }
  try {
    const conversaciones = await conversacionRepository.obtenerConversacionesPorUsuario(userId);
    res.json(conversaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener conversaciones del usuario" });
  }
};


// NUEVA FUNCIÓN: Obtener anuncios de un vendedor con sus conversaciones asociadas
exports.listarAnunciosVendedor = async (req, res) => {
  const anuncianteId = parseInt(req.params.anuncianteId);
  if (isNaN(anuncianteId)) {
    return res.status(400).json({ mensaje: "ID de anunciante inválido" });
  }
  try {
    const anuncios = await conversacionRepository.obtenerAnunciosConConversacionesPorAnunciante(anuncianteId);
    res.json(anuncios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener anuncios del vendedor" });
  }
};

// NUEVA FUNCIÓN: Obtener interesados por anuncio para un anunciante
exports.listarInteresadosPorAnuncio = async (req, res) => {
  const anuncioId = parseInt(req.params.anuncioId);
  const anuncianteId = parseInt(req.params.anuncianteId); // Asumiendo que el anuncianteId también se pasa
  if (isNaN(anuncioId) || isNaN(anuncianteId)) {
    return res.status(400).json({ mensaje: "IDs de anuncio o anunciante inválidos" });
  }
  try {
    const interesados = await conversacionRepository.obtenerInteresadosPorAnuncioYAnunciante(anuncioId, anuncianteId);
    res.json(interesados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener interesados por anuncio" });
  }
};