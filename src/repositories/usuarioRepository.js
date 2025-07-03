const dbConnection = require('../dbConnection/db');

let connection = null;
const getConnection = async () => {
  if (!connection) {
    connection = await dbConnection();
  }
  return connection;
};

exports.obtenerUsuarioPorId = async (id) => {
  const conn = await getConnection();
  const result = await conn.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0];
};
