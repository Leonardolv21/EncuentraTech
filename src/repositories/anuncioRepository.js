const dbConnection = require('../dbConnection/db');
const path = require('path');

let connection = null;

const getConnection = async () => {
  if (connection === null) {
    connection = await dbConnection();
  }
  return connection;
};


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
  const result = await conn.query(`
    SELECT DISTINCT ON (a.id)
      a.id,
      a.titulo,
      a.descripcion,
      a.precio,
      a.estado,
      a.fecha_publicacion,
      a.categoria_id,
      i.url AS imagen_url
    FROM anuncios a
    LEFT JOIN imagenes i
      ON i.anuncio_id = a.id
    WHERE a.usuario_id = $1
    ORDER BY a.id, i.id DESC
  `, [usuarioId]);
  return result.rows;
};

exports.obtenerAnuncioPorId = async (anuncioId) => {
  const conn = await getConnection();

  const anuncioQuery = `
    SELECT a.*, u.nombre AS nombre_usuario, u.correo
    FROM anuncios a
    JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.id = $1
  `;
  const imagenesQuery = `
    SELECT url FROM imagenes WHERE anuncio_id = $1
  `;

  const anuncioResult = await conn.query(anuncioQuery, [anuncioId]);
  const imagenesResult = await conn.query(imagenesQuery, [anuncioId]);

  if (anuncioResult.rows.length === 0) {
    return null;
  }

  const anuncio = anuncioResult.rows[0];
  anuncio.imagenes = imagenesResult.rows.map(img => '/' + img.url.replace(/\\/g, '/'));

  return anuncio;
};

exports.obtenerAnunciosConImagenesYUsuario = async () => {
  const conn = await getConnection();
  const result = await conn.query(`
    SELECT DISTINCT ON (a.id)
      a.id,
      a.titulo,
      a.precio,
      a.estado,
      a.categoria_id,         
      i.url   AS imagen_url,
      u.nombre AS nombre_usuario
    FROM anuncios a
    JOIN usuarios u   ON a.usuario_id = u.id
    LEFT JOIN imagenes i ON i.anuncio_id = a.id
    WHERE a.estado = true
    ORDER BY a.id, i.id DESC, a.fecha_publicacion DESC
  `);
  return result.rows;
};


exports.editarAnuncio = async (id, titulo, descripcion, precio, categoria_id, nuevasImagenes = [], imagenesAEliminar = []) => {
  const conn = await getConnection();
  const client = await conn.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      UPDATE anuncios
      SET titulo = $1, descripcion = $2, precio = $3, categoria_id = $4
      WHERE id = $5
    `, [titulo, descripcion, precio, categoria_id, id]);


    for (const rawUrl of imagenesAEliminar) {
      let url = rawUrl.replace(/^\/+/, '');
      url = path.sep === '\\' ? url.replace(/\//g, '\\') : url.replace(/\\/g, '/');
      console.log('Borrando de la tabla imagenes la URL normalizada:', url);
      console.log(`DELETE FROM imagenes WHERE url='${url}' AND anuncio_id=${id}`);

      await client.query(
        `DELETE FROM imagenes WHERE url = $1 AND anuncio_id = $2`,
        [url, id]
      );
    }

    for (const file of nuevasImagenes) {
      const ruta = path.join('uploads', file.filename);
      await client.query(
        `INSERT INTO imagenes (url, anuncio_id) VALUES ($1, $2)`,
        [ruta, id]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
exports.eliminarAnuncio = async (id) => {
  const conn = await getConnection();
  const client = await conn.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `DELETE FROM imagenes WHERE anuncio_id = $1`,
      [id]
    );

    await client.query(
      `DELETE FROM anuncios WHERE id = $1`,
      [id]
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};




exports.toggleEstado = async (id) => {
  const conn = await getConnection();
  const client = await conn.connect();
  try {

    const result = await client.query(`
      UPDATE anuncios
      SET estado = NOT estado
      WHERE id = $1
      RETURNING estado
    `, [id]);
    return result.rows[0].estado;
  } finally {
    client.release();
  }
};


exports.buscar = async (termino) => {
  const conn = await getConnection();
  
  const result = await conn.query(`
    SELECT DISTINCT ON (a.id)
      a.id, a.titulo, a.precio, a.estado, a.categoria_id,
      i.url AS imagen_url,
      u.nombre AS nombre_usuario
    FROM anuncios a
    JOIN usuarios u ON a.usuario_id = u.id
    LEFT JOIN imagenes i ON i.anuncio_id = a.id
    WHERE a.estado = true AND (a.titulo ILIKE $1 OR a.descripcion ILIKE $1)
    ORDER BY a.id, i.id DESC, a.fecha_publicacion DESC
  `, [`%${termino}%`]);
  return result.rows;
};