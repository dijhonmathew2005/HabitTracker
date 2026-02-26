require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const sqlPath = path.join(__dirname, 'migrations', 'init.sql');
if (!fs.existsSync(sqlPath)) {
  console.error('Migration file not found:', sqlPath);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

conn.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message || err);
    process.exit(1);
  }

  console.log('Connected to DB — running migrations');
  conn.query(sql, (qErr) => {
    if (qErr) {
      console.error('Migration error:', qErr);
      conn.end();
      process.exit(1);
    }

    console.log('Migrations applied successfully');
    conn.end();
  });
});
