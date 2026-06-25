import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const DB_PATH = join(__dirname, 'database.sqlite')

export const USE_PG = !!process.env.DATABASE_URL

let db = null

async function initPg() {
  const pkg = await import('pg')
  const { Pool } = pkg.default || pkg
  db = new Pool({ connectionString: process.env.DATABASE_URL })

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'agent',
      phone TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  await db.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      civilite TEXT DEFAULT 'M.',
      email TEXT,
      phone TEXT,
      genre TEXT DEFAULT 'Masculin',
      nationalite TEXT DEFAULT 'Marocaine',
      ville TEXT DEFAULT 'Tanger',
      position TEXT,
      department TEXT,
      agence TEXT,
      hire_date TEXT,
      salary TEXT,
      birth_date TEXT,
      birth_place TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  await db.query(`
    CREATE TABLE IF NOT EXISTS templates (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      content TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  await db.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      reference TEXT,
      employee_id INTEGER REFERENCES employees(id),
      template_id INTEGER REFERENCES templates(id),
      content TEXT,
      html_content TEXT,
      employee_name TEXT,
      document_type TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  try { await db.query(`ALTER TABLE users ADD COLUMN phone TEXT DEFAULT ''`) } catch {}

  return db
}

function initSqlite() {
  const Database = require('better-sqlite3')
  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'agent',
      phone TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      civilite TEXT DEFAULT 'M.',
      email TEXT,
      phone TEXT,
      genre TEXT DEFAULT 'Masculin',
      nationalite TEXT DEFAULT 'Marocaine',
      ville TEXT DEFAULT 'Tanger',
      position TEXT,
      department TEXT,
      agence TEXT,
      hire_date TEXT,
      salary TEXT,
      birth_date TEXT,
      birth_place TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT,
      is_active INTEGER DEFAULT 1,
      content TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT,
      employee_id INTEGER,
      template_id INTEGER,
      content TEXT,
      html_content TEXT,
      employee_name TEXT,
      document_type TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (template_id) REFERENCES templates(id)
    )
  `)

  try { db.exec("ALTER TABLE users ADD COLUMN phone TEXT DEFAULT ''") } catch {}

  return db
}

export async function initDb() {
  if (USE_PG) {
    return await initPg()
  }
  return initSqlite()
}

export function getDb() {
  return db
}

function fixSql(sql) {
  if (USE_PG) {
    let idx = 0
    sql = sql.replace(/\?/g, () => `$${++idx}`)
    sql = sql.replace(/datetime\('now'\)/g, "NOW()")
    sql = sql.replace(/is_active\s*=\s*1\b/g, 'is_active = TRUE')
    sql = sql.replace(/is_active\s*=\s*0\b/g, 'is_active = FALSE')
  }
  return sql
}

export async function query(sql, params = []) {
  if (USE_PG) {
    const res = await db.query(fixSql(sql), params)
    return res.rows
  }
  return db.prepare(sql).all(...params)
}

export async function queryOne(sql, params = []) {
  if (USE_PG) {
    const res = await db.query(fixSql(sql), params)
    return res.rows[0] || null
  }
  return db.prepare(sql).get(...params)
}

export async function execute(sql, params = []) {
  if (USE_PG) {
    const trimSql = sql.trim().toUpperCase()
    if (trimSql.startsWith('INSERT')) {
      sql = fixSql(sql) + ' RETURNING id'
      const res = await db.query(sql, params)
      return { lastInsertRowid: res.rows[0]?.id, changes: res.rowCount }
    }
    const res = await db.query(fixSql(sql), params)
    return { lastInsertRowid: null, changes: res.rowCount }
  }
  const info = db.prepare(sql).run(...params)
  return { lastInsertRowid: info.lastInsertRowid, changes: info.changes }
}
