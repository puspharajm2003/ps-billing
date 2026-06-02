const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_LNj4TPi1gZWD@ep-blue-bonus-apxo8y3w-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(async () => {
  try {
    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS users_id_seq;
      UPDATE users SET id = nextval('users_id_seq') WHERE id IS NULL;
      ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq');
      ALTER TABLE users ALTER COLUMN id SET NOT NULL;
      SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
      
      CREATE SEQUENCE IF NOT EXISTS licensees_id_seq;
      UPDATE licensees SET id = nextval('licensees_id_seq') WHERE id IS NULL;
      ALTER TABLE licensees ALTER COLUMN id SET DEFAULT nextval('licensees_id_seq');
      ALTER TABLE licensees ALTER COLUMN id SET NOT NULL;
      SELECT setval('licensees_id_seq', COALESCE((SELECT MAX(id) FROM licensees), 1));
    `);
    console.log("Database schema fixed successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
});
