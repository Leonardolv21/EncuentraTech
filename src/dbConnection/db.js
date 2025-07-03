const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'EncuentraTech',
  password: '123456789',
  port: 5432,
});

module.exports = async () => db;
