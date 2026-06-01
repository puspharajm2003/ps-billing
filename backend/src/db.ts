import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { 
  CompanySettings, Customer, Supplier, Item, Invoice, InvoiceItem, Payment, User, Session 
} from './types';

import { AsyncLocalStorage } from 'async_hooks';

const DB_FILE = path.join(__dirname, '..', 'billing.sqlite');
const masterDb = new sqlite3.Database(DB_FILE);

export const tenantContext = new AsyncLocalStorage<sqlite3.Database>();
const tenantDbs = new Map<string, sqlite3.Database>();

// Enable foreign keys on master
masterDb.serialize(() => {
  masterDb.run("PRAGMA foreign_keys = ON;");
});

function getActiveDb(): sqlite3.Database {
  return tenantContext.getStore() || masterDb;
}

// Helper wrapper for runs
export function run(sql: string, params: any[] = []): Promise<{ id: number; changes: number }> {
  return new Promise((resolve, reject) => {
    getActiveDb().run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// Helper wrapper for all (get multiple rows)
export function all<T>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    getActiveDb().all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows as T[]);
    });
  });
}

// Helper wrapper for get (get single row)
export function get<T>(sql: string, params: any[] = []): Promise<T | null> {
  return new Promise((resolve, reject) => {
    getActiveDb().get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve((row || null) as T | null);
    });
  });
}

// Initialize tables
export async function initializeDatabase() {
  console.log("Initializing Master database at", DB_FILE);

  // Users table (authentication)
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    )
  `);

  // Sessions table (auth tokens)
  await run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Licensees table
  await run(`
    CREATE TABLE IF NOT EXISTS licensees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_number TEXT UNIQUE NOT NULL,
      company_name TEXT NOT NULL,
      licensee_name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    await run("ALTER TABLE users ADD COLUMN license_number TEXT");
  } catch (err) {
    // Ignore error if column already exists
  }

  // Ensure 'Admin' licensee exists
  const adminLicensee = await get<any>("SELECT * FROM licensees WHERE license_number = 'Admin'");
  if (!adminLicensee) {
    console.log("Seeding default Admin licensee (Admin)...");
    await run(`
      INSERT INTO licensees (license_number, company_name, licensee_name)
      VALUES ('Admin', 'Admin', 'Admin')
    `);
  }

  // Seed default super-admin account
  const adminCount = await get<{ count: number }>("SELECT COUNT(*) as count FROM users");
  if (!adminCount || adminCount.count === 0) {
    console.log("Seeding default super-admin account (puspharaj / 2003)...");
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('2003', salt, 64).toString('hex');
    await run(`
      INSERT INTO users (username, password_hash, salt, role, license_number)
      VALUES (?, ?, ?, 'admin', 'Admin')
    `, ['puspharaj', hash, salt]);
  }
}

// ==========================================
// Tenant Database Initialization
// ==========================================

export async function getTenantDb(userId: number): Promise<sqlite3.Database> {
  const safeId = crypto.createHash('md5').update(String(userId)).digest('hex');
  const dbName = `billing_tenant_${safeId}.sqlite`;
  
  // Untaint the filename using a strict regex
  if (!/^billing_tenant_[a-f0-9]{32}\.sqlite$/.test(dbName)) {
    throw new Error("Invalid database filename pattern");
  }
  
  const basePath = path.normalize(path.join(__dirname, '..'));
  const fullPath = path.normalize(path.join(basePath, dbName));
  
  if (!fullPath.startsWith(basePath)) {
    throw new Error("Invalid path specified for tenant database");
  }
  
  if (tenantDbs.has(dbName)) {
    return tenantDbs.get(dbName)!;
  }

  const tDb = new sqlite3.Database(fullPath);
  
  tDb.serialize(() => {
    tDb.run("PRAGMA foreign_keys = ON;");
  });

  tenantDbs.set(dbName, tDb);

  await new Promise<void>((resolve, reject) => {
    tenantContext.run(tDb, async () => {
      try {
        // Check if database is new by looking for a core table
        const tableCheck = await get<{ count: number }>("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='settings'");
        const isNew = !tableCheck || tableCheck.count === 0;
        
        if (isNew) {
          await initializeTenantDatabase();
        } else {
          // Always run migrations on existing DBs to ensure they are up to date
          await migrateTenantDatabase();
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  return tDb;
}

export async function initializeTenantDatabase() {
  console.log("Initializing new Tenant database...");

  // 1. Settings table
  await run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      gstin TEXT,
      state TEXT,
      state_code TEXT,
      bank_name TEXT,
      account_name TEXT,
      account_number TEXT,
      ifsc_code TEXT,
      branch TEXT,
      terms_conditions TEXT
    )
  `);

  // 2. Customers table
  await run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      state TEXT,
      state_code TEXT,
      gstin TEXT,
      opening_balance REAL DEFAULT 0,
      outstanding_balance REAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Suppliers table
  await run(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      state TEXT,
      state_code TEXT,
      gstin TEXT,
      opening_balance REAL DEFAULT 0,
      outstanding_balance REAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Items table (electric motors)
  await run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand TEXT DEFAULT 'WEG',
      description TEXT,
      hp TEXT,
      rpm TEXT,
      poles TEXT,
      phase TEXT,
      frame TEXT,
      volts TEXT,
      purchase_price REAL DEFAULT 0,
      sales_price REAL DEFAULT 0,
      stock_qty REAL DEFAULT 0,
      low_stock_threshold REAL DEFAULT 2,
      gst_rate REAL DEFAULT 18,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Invoices table
  await run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      invoice_type TEXT NOT NULL, -- sales, purchase, quotation
      party_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      subtotal REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      cgst REAL DEFAULT 0,
      sgst REAL DEFAULT 0,
      igst REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      round_off REAL DEFAULT 0,
      grand_total REAL DEFAULT 0,
      paid_amount REAL DEFAULT 0,
      balance_amount REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'unpaid', -- paid, partial, unpaid
      notes TEXT,
      is_converted INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Invoice Items table
  await run(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      hp TEXT,
      rpm TEXT,
      poles TEXT,
      phase TEXT,
      frame TEXT,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      discount_pct REAL DEFAULT 0,
      taxable_value REAL NOT NULL,
      cgst_pct REAL DEFAULT 0,
      cgst_amount REAL DEFAULT 0,
      sgst_pct REAL DEFAULT 0,
      sgst_amount REAL DEFAULT 0,
      igst_pct REAL DEFAULT 0,
      igst_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES items(id)
    )
  `);

  // 7. Payments table
  await run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payment_number TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL, -- receipt, payment
      party_id INTEGER NOT NULL,
      invoice_id INTEGER,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      mode TEXT NOT NULL, -- cash, bank, upi
      reference_number TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
    )
  `);

  // Note: custom_sections and safe migrations are now handled by migrateTenantDatabase()
}

export async function migrateTenantDatabase() {
  console.log("Running migrations for Tenant database...");

  // 8. Custom document sections (Proforma Invoice, Sales Order, Purchase Order, etc.)
  await run(`
    CREATE TABLE IF NOT EXISTS custom_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT DEFAULT 'FileText',
      color TEXT DEFAULT '#6366f1',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Pre-seed the three classic sections so they appear on first login
  const defaultSections = [
    { name: 'Purchase Order', slug: 'purchase-order', icon: 'ShoppingCart', color: '#f59e0b' },
    { name: 'Proforma Invoice', slug: 'proforma-invoice', icon: 'FileText', color: '#3b82f6' },
    { name: 'Sales Order', slug: 'sales-order', icon: 'TrendingUp', color: '#10b981' },
  ];
  for (const sec of defaultSections) {
    try {
      await run(
        `INSERT OR IGNORE INTO custom_sections (name, slug, icon, color) VALUES (?, ?, ?, ?)`,
        [sec.name, sec.slug, sec.icon, sec.color]
      );
    } catch (_) { /* ignore */ }
  }

  // Safe migrations for existing databases
  const safeMigrations = [
    "ALTER TABLE items ADD COLUMN is_deleted INTEGER DEFAULT 0",
    "ALTER TABLE customers ADD COLUMN is_deleted INTEGER DEFAULT 0",
    "ALTER TABLE suppliers ADD COLUMN is_deleted INTEGER DEFAULT 0",
    "ALTER TABLE invoices ADD COLUMN converted_from_quotation_id INTEGER",
    "ALTER TABLE invoices ADD COLUMN custom_section_slug TEXT",
  ];
  for (const sql of safeMigrations) {
    try { await run(sql); } catch (_) { /* column already exists */ }
  }

  // 9. Stock transactions table (Entry, Receipt, Issue)
  await run(`
    CREATE TABLE IF NOT EXISTS stock_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      quantity REAL NOT NULL,
      date TEXT NOT NULL,
      reference_number TEXT,
      party_id INTEGER,
      party_type TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items(id)
    )
  `);

  // 10. Item Groups
  await run(`
    CREATE TABLE IF NOT EXISTS item_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 11. Sales Executives
  await run(`
    CREATE TABLE IF NOT EXISTS sales_executives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      region TEXT,
      commission_pct REAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 12. Company Staff
  await run(`
    CREATE TABLE IF NOT EXISTS company_staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      phone TEXT,
      email TEXT,
      basic_salary REAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 13. Expenses Groups
  await run(`
    CREATE TABLE IF NOT EXISTS expenses_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Exported helper for password hashing
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const h = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash: h, salt: s };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}
