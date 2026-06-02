const sqlite3 = require('sqlite3'); const db = new sqlite3.Database('d:/SMR Groups Billing software/billing.sqlite'); db.all('PRAGMA table_info(users)', (err, rows) = 
