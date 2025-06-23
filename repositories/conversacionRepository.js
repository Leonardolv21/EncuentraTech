const dbConnection = require('../dbConnection/db');

let connection = null;

const getConnection = async () => {
  if (connection === null) {
    connection = await dbConnection();
  }
  return connection;
};


exports.obtenerPorAnuncio = async (anuncioId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT id, interesado_id, anunciante_id
     FROM conversaciones
     WHERE anuncio_id = $1`,
    [anuncioId]
  );
  return result.rows;
};

exports.crearConversacion = async (anuncioId, interesadoId, anuncianteId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `INSERT INTO conversaciones
       (anuncio_id, interesado_id, anunciante_id)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [anuncioId, interesadoId, anuncianteId]
  );
  return result.rows[0].id;
};
