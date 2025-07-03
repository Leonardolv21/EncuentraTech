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

exports.obtenerConversacionPorParticipantesYAnuncio = async (anuncioId, interesadoId, anuncianteId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT id
     FROM conversaciones
     WHERE anuncio_id = $1
       AND interesado_id = $2
       AND anunciante_id = $3`,
    [anuncioId, interesadoId, anuncianteId]
  );
  return result.rows[0]; 
};


exports.obtenerConversacionPorId = async (conversacionId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT id, anuncio_id, interesado_id, anunciante_id
     FROM conversaciones
     WHERE id = $1`,
    [conversacionId]
  );
  return result.rows[0];
};

exports.obtenerDetallesConversacion = async (conversacionId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT
        c.id AS conversacion_id,
        c.anuncio_id,
        c.interesado_id,
        u_interesado.nombre AS nombre_interesado,
        c.anunciante_id,
        u_anunciante.nombre AS nombre_anunciante
     FROM conversaciones c
     JOIN usuarios u_interesado ON c.interesado_id = u_interesado.id
     JOIN usuarios u_anunciante ON c.anunciante_id = u_anunciante.id
     WHERE c.id = $1`,
    [conversacionId]
  );
  return result.rows[0];
};





exports.obtenerConversacionesComoComprador = async (userId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT DISTINCT ON (c.id)
        c.id AS conversacion_id,
        c.anuncio_id,
        a.titulo AS anuncio_titulo,
        i.url AS anuncio_imagen,
        c.anunciante_id,
        u_anunciante.nombre AS nombre_anunciante,
        (SELECT contenido FROM mensajes WHERE conversacion_id = c.id ORDER BY fecha_hora DESC LIMIT 1) AS ultimo_mensaje_contenido
     FROM conversaciones c
     JOIN anuncios a ON c.anuncio_id = a.id
     LEFT JOIN imagenes i ON a.id = i.anuncio_id
     LEFT JOIN usuarios u_anunciante ON c.anunciante_id = u_anunciante.id
     WHERE c.interesado_id = $1
     ORDER BY c.id, i.id ASC`,
    [userId]
  );
  return result.rows;
};

exports.obtenerAnunciosConConversacionesPorAnunciante = async (anuncianteId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT DISTINCT ON (a.id)
        a.id AS anuncio_id,
        a.titulo AS anuncio_titulo,
        i.url AS anuncio_imagen,
        (SELECT COUNT(*) FROM conversaciones WHERE anuncio_id = a.id) AS total_conversaciones
     FROM anuncios a
     LEFT JOIN imagenes i ON a.id = i.anuncio_id
     WHERE a.usuario_id = $1
     ORDER BY a.id DESC, i.id ASC`,
    [anuncianteId]
  );
  return result.rows;
};
exports.obtenerInteresadosPorAnuncioYAnunciante = async (anuncioId, anuncianteId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT
        c.id AS conversacion_id,
        c.interesado_id,
        u_interesado.nombre AS nombre_interesado,
        (SELECT contenido FROM mensajes WHERE conversacion_id = c.id ORDER BY fecha_hora DESC LIMIT 1) AS ultimo_mensaje_contenido,
        (SELECT fecha_hora FROM mensajes WHERE conversacion_id = c.id ORDER BY fecha_hora DESC LIMIT 1) AS ultimo_mensaje_fecha
     FROM conversaciones c
     JOIN usuarios u_interesado ON c.interesado_id = u_interesado.id
     WHERE c.anuncio_id = $1 AND c.anunciante_id = $2
     ORDER BY ultimo_mensaje_fecha DESC NULLS LAST`,
    [anuncioId, anuncianteId]
  );
  return result.rows;
};