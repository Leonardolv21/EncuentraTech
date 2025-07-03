const db = require('../dbConnection/db');

exports.obtenerCategorias = async () => {
  const conn = await db();
  const result = await conn.query('SELECT id, nombre FROM categorias ORDER BY id');
  return result.rows;
};
