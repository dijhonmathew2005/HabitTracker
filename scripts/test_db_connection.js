require('dotenv').config();
const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 5000,
});

conn.connect(err => {
  if (err) {
    console.error('Connection test failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
  console.log('Connection test succeeded — connected to DB');
  conn.end();
  process.exit(0);
});
