const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./billing.sqlite');

db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='licensees'", (err, row) => {
  console.log("LICENSEES SCHEMA:", row ? row.sql : 'NOT FOUND');
});

db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  console.log("USERS SCHEMA:", row ? row.sql : 'NOT FOUND');
});
