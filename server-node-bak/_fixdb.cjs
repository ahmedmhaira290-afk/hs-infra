// Try to open database and checkpoint WAL
try {
  const Database = require('better-sqlite3');
  const db = new Database('./database.sqlite');
  db.pragma('journal_mode = DELETE');
  db.pragma('wal_checkpoint(TRUNCATE)');
  console.log('Database checkpointed successfully');
  db.close();
} catch(e) {
  console.log('Error:', e.message);
}
