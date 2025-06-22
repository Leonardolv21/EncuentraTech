const usuarioRepository = require('../repositories/usuarioRepository');

exports.obtenerUsuarioPorId = async (req, res) => {
  const usuarioId = parseInt(req.params.id);

  if (isNaN(usuarioId)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  try {
    const usuario = await usuarioRepository.obtenerUsuarioPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // No devolvemos la contraseña por seguridad
    delete usuario.contrasena;

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
