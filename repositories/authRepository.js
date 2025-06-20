const dbConnection = require('../dbConnection/db');

let connection = null;

const getConnection = async () => {
  if (connection === null) {
    connection = await dbConnection(); // ← debe retornar un Pool
  }
  return connection;
};

exports.buscarPorCorreo = async (correo) => {
  const conn = await getConnection();
  const result = await conn.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

exports.insertarUsuario = async (nombre, correo, contrasena) => {
  const conn = await getConnection();
  const fechaRegistro = new Date();

  await conn.query(
    'INSERT INTO usuarios (nombre, correo, contrasena, fecha_registro) VALUES ($1, $2, $3, $4)',
    [nombre, correo, contrasena, fechaRegistro]
  );
};
