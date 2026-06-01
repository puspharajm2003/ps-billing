import { runBackup } from './src/backup';

runBackup()
  .then(() => {
    console.log('Test Done');
    process.exit(0);
  })
  .catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
  });
