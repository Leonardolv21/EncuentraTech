const authRepository = require('../repositories/authRepository');

exports.register = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  if (contrasena.length < 6) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const usuarioExistente = await authRepository.buscarPorCorreo(correo);

    if (usuarioExistente) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    await authRepository.insertarUsuario(nombre, correo, contrasena);

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario'});
  }
};

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const usuario = await authRepository.buscarPorCorreo(correo);

    if (!usuario || usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    // Opcional: eliminar contraseña del objeto a devolver
    delete usuario.contrasena;

    res.json(usuario); // puedes devolver también solo el nombre o id

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Hubo un error al realizar el login' });
  }
};
