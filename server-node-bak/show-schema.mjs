import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'database.sqlite')
const db = new Database(dbPath)

const tables = ['users', 'employees', 'templates', 'documents']

for (const t of tables) {
  console.log(`--- ${t.toUpperCase()} ---`)
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name=?").get(t)
  if (schema) {
    schema.sql.split('\n').forEach(l => console.log(`  ${l.trim()}`))
  }
  console.log('')
}

console.log('=== RÉSUMÉ ===')
for (const t of tables) {
  const { c } = db.prepare(`SELECT COUNT(*) as c FROM ${t}`).get()
  console.log(`${t.padEnd(12)} ${c} enregistrements`)
}

db.close()
