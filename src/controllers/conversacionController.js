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
      return res.status(200).json({ id: conversacion.id, mensaje: 'Conversación existente', creada: false });
    } else {
   
      const id = await conversacionRepository.crearConversacion(anuncio_id, interesado_id, anunciante_id);
      return res.status(201).json({ id, mensaje: 'Conversación creada', creada: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al buscar o crear la conversación' });
  }
};


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
exports.listarPorUsuario = async (req, res) => {
  const userId = parseInt(req.params.userId);
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


exports.listarComprasUsuario = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ mensaje: "ID de usuario inválido" });
  }
  try {
    const conversaciones = await conversacionRepository.obtenerConversacionesComoComprador(userId);
    res.json(conversaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener las compras del usuario" });
  }
};

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


exports.listarInteresadosPorAnuncio = async (req, res) => {
  const anuncioId = parseInt(req.params.anuncioId);
  const anuncianteId = parseInt(req.params.anuncianteId);
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