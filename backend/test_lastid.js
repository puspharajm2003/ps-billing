const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./billing.sqlite');

db.run(
  "INSERT INTO users (username, password_hash, salt, role, license_number) VALUES (?, ?, ?, ?, ?)",
  ["testuser", "hash", "salt", "user", "LIC-TEST"],
  function(err) {
    console.log("INSERT USER lastID:", this.lastID);
    console.log("Error:", err);
  }
);

db.run(
  "INSERT INTO licensees (license_number, company_name, licensee_name) VALUES (?, ?, ?)",
  ["LIC-TEST-" + Date.now(), "Test Company", "Test Licensee"],
  function(err) {
    console.log("INSERT LICENSEE lastID:", this.lastID);
    console.log("Error:", err);
  }
);
