require('dotenv').config();
const db = require('../src/config/db');

db.query('SHOW TABLES', (err, results) => {
  if (err) {
    console.error('Error listing tables', err);
    process.exit(1);
  }
  console.log('Tables:', results);
  db.query('SHOW COLUMNS FROM users', (err2, cols) => {
    if (err2) {
      console.error('Error describing users table', err2);
    } else {
      console.log('Users columns:', cols);
    }

    db.query('SHOW COLUMNS FROM habits', (err3, cols3) => {
      if (err3) {
        console.error('Error describing habits table', err3);
      } else {
        console.log('Habits columns:', cols3);
      }

      db.query('SHOW COLUMNS FROM logs', (err4, cols4) => {
        if (err4) {
          console.error('Error describing logs table', err4);
        } else {
          console.log('Logs columns:', cols4);
        }
        process.exit(0);
      });
    });
  });
});
