import { initDb, getDb } from './db.js'
await initDb()
const db = getDb()
const tables = db.exec(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
for (const result of tables) {
  for (const row of result.values) {
    const name = row[0]
    console.log('\n=== ' + name + ' ===')
    const cols = db.exec('PRAGMA table_info(' + name + ')')
    if (cols.length > 0) {
      for (const col of cols[0].values) {
        let info = `  ${col[1]} (${col[2]})`
        if (col[5]) info += ' PK'
        if (col[3]) info += ' NOT NULL'
        if (col[4] !== null) info += ` DEFAULT ${col[4]}`
        console.log(info)
      }
    }
  }
}
