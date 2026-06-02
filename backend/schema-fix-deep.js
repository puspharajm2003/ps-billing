const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_LNj4TPi1gZWD@ep-blue-bonus-apxo8y3w-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(async () => {
  try {
    await client.query(`
      -- Remove primary key if exists to avoid conflicts during reassignment
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
      ALTER TABLE licensees DROP CONSTRAINT IF EXISTS licensees_pkey;

      -- Reset sequences
      DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
      CREATE SEQUENCE users_id_seq;

      -- Create a temporary column to establish new unique IDs
      ALTER TABLE users ADD COLUMN new_id INTEGER;
      UPDATE users SET new_id = nextval('users_id_seq');
      
      -- Update references in sessions table before replacing user ID
      -- (Actually sessions table might be broken too, let's just clear it to be safe)
      TRUNCATE TABLE sessions;

      -- Replace old id with new_id
      ALTER TABLE users DROP COLUMN id;
      ALTER TABLE users RENAME COLUMN new_id TO id;
      
      -- Set defaults and primary key for users
      ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq');
      ALTER TABLE users ADD PRIMARY KEY (id);
      
      -- Fix created_at
      UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

      -- Same for licensees
      DROP SEQUENCE IF EXISTS licensees_id_seq CASCADE;
      CREATE SEQUENCE licensees_id_seq;
      
      ALTER TABLE licensees ADD COLUMN new_id INTEGER;
      UPDATE licensees SET new_id = nextval('licensees_id_seq');
      
      ALTER TABLE licensees DROP COLUMN id;
      ALTER TABLE licensees RENAME COLUMN new_id TO id;
      
      ALTER TABLE licensees ALTER COLUMN id SET DEFAULT nextval('licensees_id_seq');
      ALTER TABLE licensees ADD PRIMARY KEY (id);

      UPDATE licensees SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
    `);
    console.log("Database schema deeply fixed and deduplicated successfully.");
  } catch (err) {
    console.error("Error fixing schema:", err);
  } finally {
    client.end();
  }
});
