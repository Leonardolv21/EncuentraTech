

const dbConnection = require('../dbConnection/db');

let connection = null;

const getConnection = async () => {
  if (connection === null) {
    connection = await dbConnection();
  }
  return connection;
};


exports.guardar = async (usuario_id, anuncio_id) => {
  const conn = await getConnection();
  await conn.query(
    `INSERT INTO anuncios_guardados (usuario_id, anuncio_id) VALUES ($1, $2) ON CONFLICT (usuario_id, anuncio_id) DO NOTHING`,
    [usuario_id, anuncio_id]
  );
};

exports.quitar = async (usuario_id, anuncio_id) => {
  const conn = await getConnection();
  await conn.query(
    `DELETE FROM anuncios_guardados WHERE usuario_id = $1 AND anuncio_id = $2`,
    [usuario_id, anuncio_id]
  );
};

exports.verificar = async (usuario_id, anuncio_id) => {
  const conn = await getConnection();
  const result = await conn.query(
    `SELECT 1 FROM anuncios_guardados WHERE usuario_id = $1 AND anuncio_id = $2`,
    [usuario_id, anuncio_id]
  );
  return result.rows.length > 0; 
};


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
    console.log('Resultado de la consulta SQL en obtenerPorUsuario:', result.rows);

  return result.rows;
};