const sqlite3 = require('sqlite3');
const path = require('path');
const dbFile = path.join(__dirname, '..', 'billing.sqlite'); // Note: DB_BASE in db.ts is path.join(__dirname, '..')

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error(err);
  else console.log('Connected to DB');
});

const queries = [
  "SELECT SUM(grand_total) as total FROM invoices WHERE invoice_type = 'sales'",
  "SELECT * FROM items WHERE stock_qty <= low_stock_threshold ORDER BY stock_qty ASC",
  `SELECT inv.*, c.name as party_name 
      FROM invoices inv 
      JOIN customers c ON inv.party_id = c.id
      WHERE inv.invoice_type = 'sales' AND inv.payment_status != 'paid' 
      ORDER BY inv.due_date ASC LIMIT 5`,
  `SELECT strftime('%Y-%m', date) as month, SUM(grand_total) as sales
      FROM invoices
      WHERE invoice_type = 'sales' AND date >= date('now', '-6 month')
      GROUP BY month ORDER BY month ASC`
];

queries.forEach((q, i) => {
  db.all(q, (err, rows) => {
    if (err) console.error(`Query ${i} failed:`, err.message);
    else console.log(`Query ${i} success:`, rows.length, 'rows');
  });
});
