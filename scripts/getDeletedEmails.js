
const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../database/data.db'));

new Promise(resolve => {
  db.serialize(function() {
    db.all(`SELECT * FROM deleted_emails`, function(err, row) {
      if (err) {
        console.error(`<${Date()}>`, 'ERROR_GET_DELETED_EMAILS', err);
        resolve([{
          error: 1
        }]);
      }
      else {
        resolve(row);
      }
    });
  });
})
  .then(data => {
    console.log(data);
    db.close();
  });