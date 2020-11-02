var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/data.db');
 
db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS keys (email TEXT, key TEXT, timestamp NUMBER)", (err, res) => {
    if (err) {
      console.error(`<${Date()}>`, 'DB_ERROR_CREATE_TABLE_KEYS', err);
    }
    else {
      console.info('Table keys created!');
    }
  });
  db.run("CREATE TABLE IF NOT EXISTS deleted_emails (email TEXT, date DATE)", (err, res) => {
    if (err) {
      console.error(`<${Date()}>`, 'DB_ERROR_CREATE_TABLE_DELETED_EMAILS', err);
    }
    else {
      console.info('Table deleted_emails created!');
    }
  });
});

db.close();
