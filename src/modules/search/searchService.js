
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function searchContent(query) {
  const result = await pool.query("SELECT * FROM posts WHERE text LIKE $1", [`%${query}%`]);
  return result.rows;
}

module.exports = {
  searchContent,
};