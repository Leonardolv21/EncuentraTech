const dbConnection = require('../dbConnection/db');

let connection = null;
const getConnection = async () => {
  if (connection === null) {
    connection = await dbConnection();
  }
  return connection;
};

exports.obtenerPorConversacion = async (conversacionId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT id, contenido, fecha_hora, emisor_id
     FROM mensajes
     WHERE conversacion_id = $1
     ORDER BY fecha_hora`,
    [conversacionId]
  );
  return result.rows;
};

exports.crearMensaje = async (conversacionId, emisorId, contenido) => {
  const conn = await getConnection();
  const result = await conn.query(
    `INSERT INTO mensajes (conversacion_id, emisor_id, contenido, fecha_hora)
     VALUES ($1, $2, $3, NOW())
     RETURNING id`,
    [conversacionId, emisorId, contenido]
  );
  return result.rows[0].id;
};
