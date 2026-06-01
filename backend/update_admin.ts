import { run, hashPassword, initializeDatabase } from './src/db';

async function updateAdmin() {
  await initializeDatabase();
  const { hash, salt } = hashPassword('2003');
  await run(
    "UPDATE users SET username = ?, password_hash = ?, salt = ? WHERE role = 'admin'",
    ['puspharaj', hash, salt]
  );
  console.log("Admin credentials updated successfully!");
  process.exit(0);
}

updateAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
