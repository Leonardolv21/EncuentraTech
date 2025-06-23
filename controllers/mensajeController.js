const mensajeRepository = require('../repositories/mensajeRepository');

exports.listarPorConversacion = async (req, res) => {
  const convId = parseInt(req.query.conversacion);
  if (isNaN(convId)) {
    return res.status(400).json({ mensaje: 'ID de conversación inválido' });
  }
  try {
    const msgs = await mensajeRepository.obtenerPorConversacion(convId);
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener mensajes' });
  }
};

exports.crear = async (req, res) => {
  const { conversacion_id, emisor_id, contenido } = req.body;
  if (!conversacion_id || !emisor_id || !contenido) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  try {
    const id = await mensajeRepository.crearMensaje(conversacion_id, emisor_id, contenido);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear mensaje' });
  }
};
