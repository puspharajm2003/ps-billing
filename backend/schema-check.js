const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_LNj4TPi1gZWD@ep-blue-bonus-apxo8y3w-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => {
  client.query("SELECT column_name, data_type, column_default, is_nullable FROM information_schema.columns WHERE table_name = 'users'").then(res => {
    console.log(JSON.stringify(res.rows, null, 2));
    client.end();
  });
});
