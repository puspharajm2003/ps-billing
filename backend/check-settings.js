const { Client } = require('pg');

const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_LNj4TPi1gZWD@ep-blue-bonus-apxo8y3w-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function checkSettings() {
  await client.connect();
  
  const schemasResult = await client.query(`
    SELECT schema_name 
    FROM information_schema.schemata 
    WHERE schema_name LIKE 'tenant_%'
  `);

  for (let row of schemasResult.rows) {
    const schema = row.schema_name;
    const settings = await client.query(`SELECT id, company_name FROM "${schema}".settings`);
    console.log(`Schema ${schema}:`, settings.rows);
  }

  await client.end();
}

checkSettings().catch(console.error);
