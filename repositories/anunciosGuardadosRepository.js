// repositories/anunciosGuardadosRepository.js

const dbConnection = require('../dbConnection/db');

let connection = null;

const getConnection = async () => {
  if (connection === null) {
    connection = await dbConnection();
  }
  return connection;
};

// Guarda un anuncio para un usuario
exports.guardar = async (usuario_id, anuncio_id) => {
  const conn = await getConnection();
  // El "ON CONFLICT DO NOTHING" evita errores si se intenta insertar un duplicado
  await conn.query(
    `INSERT INTO anuncios_guardados (usuario_id, anuncio_id) VALUES ($1, $2) ON CONFLICT (usuario_id, anuncio_id) DO NOTHING`,
    [usuario_id, anuncio_id]
  );
};

// Quita un anuncio de la lista de guardados de un usuario
exports.quitar = async (usuario_id, anuncio_id) => {
  const conn = await getConnection();
  await conn.query(
    `DELETE FROM anuncios_guardados WHERE usuario_id = $1 AND anuncio_id = $2`,
    [usuario_id, anuncio_id]
  );
};

// Verifica si un anuncio ya está guardado por un usuario
exports.verificar = async (usuario_id, anuncio_id) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT 1 FROM anuncios_guardados WHERE usuario_id = $1 AND anuncio_id = $2`,
    [usuario_id, anuncio_id]
  );
  return result.rows.length > 0; // Retorna true si existe, false si no
};

// Obtiene todos los anuncios guardados por un usuario
exports.obtenerPorUsuario = async (usuario_id) => {
  const conn = await getConnection();
  const result = await conn.query(`
    SELECT DISTINCT ON (a.id)
      a.id,
      a.titulo,
      a.precio,
      a.estado,
      i.url AS imagen_url,
      u.nombre AS nombre_usuario
    FROM anuncios_guardados ag
    JOIN anuncios a ON ag.anuncio_id = a.id
    JOIN usuarios u ON a.usuario_id = u.id
    LEFT JOIN imagenes i ON i.anuncio_id = a.id
    WHERE ag.usuario_id = $1
    ORDER BY a.id, ag.fecha_guardado DESC, i.id DESC
  `, [usuario_id]);
    console.log('Resultado de la consulta SQL en obtenerPorUsuario:', result.rows); // <-- AÑADE ESTA LÍNEA

  return result.rows;
};