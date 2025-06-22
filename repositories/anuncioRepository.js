const dbConnection = require('../dbConnection/db');
const path = require('path');

let connection = null;

const getConnection = async () => {
  if (connection === null) {
    connection = await dbConnection();
  }
  return connection;
};

// Insertar un nuevo anuncio y devolver el ID generado
exports.insertarAnuncio = async (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id, archivos = []) => {
  const conn = await getConnection();
  const client = await conn.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO anuncios (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id]
    );

    const anuncioId = result.rows[0].id;

    for (const file of archivos) {
      const ruta = path.join('uploads', file.filename);
      await client.query(
        `INSERT INTO imagenes (url, anuncio_id) VALUES ($1, $2)`,
        [ruta, anuncioId]
      );
    }

    await client.query('COMMIT');
    return anuncioId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// (Opcional) Obtener todos los anuncios con sus imágenes
exports.obtenerAnunciosConImagenes = async () => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT a.*, i.url AS imagen_url
     FROM anuncios a
     LEFT JOIN imagenes i ON a.id = i.anuncio_id`
  );
  return result.rows;
};

exports.obtenerAnunciosPorUsuario = async (usuarioId) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT a.id, a.titulo, a.descripcion, a.precio, a.estado, a.fecha_publicacion,
            a.categoria_id, i.url AS imagen_url
     FROM anuncios a
     LEFT JOIN imagenes i ON a.id = i.anuncio_id
     WHERE a.usuario_id = $1`,
    [usuarioId]
  );
  return result.rows;
};
exports.obtenerAnuncioPorId = async (anuncioId) => {
  const conn = await getConnection();
  const result = await conn.query(`
    SELECT a.*, i.url AS imagen_url, u.nombre AS nombre_usuario, u.correo
    FROM anuncios a
    LEFT JOIN imagenes i ON i.anuncio_id = a.id
    JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.id = $1
    LIMIT 1
  `, [anuncioId]);

  return result.rows[0]; // un solo anuncio
};
