const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));
tables.forEach(t => {
  const c = db.prepare('SELECT COUNT(*) as c FROM ' + t.name).get();
  console.log('  ' + t.name + ': ' + c.c + ' rows');
});
db.close();
