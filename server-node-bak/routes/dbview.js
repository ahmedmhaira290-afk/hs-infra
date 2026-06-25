import { Router } from 'express'
import { query, USE_PG } from '../db.js'

const router = Router()

router.get('/tables', async (req, res) => {
  const sql = USE_PG
    ? "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public' ORDER BY tablename"
    : "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  const tables = await query(sql)
  const result = []
  for (const t of tables) {
    const name = t.tablename || t.name
    const count = await query(`SELECT COUNT(*) as count FROM "${name}"`)
    result.push({ name, count: Number(count[0]?.count || 0) })
  }
  res.json(result)
})

router.get('/table/:name', async (req, res) => {
  const { name } = req.params
  if (!/^[a-zA-Z_]\w*$/.test(name)) return res.status(400).json({ error: 'Nom de table invalide' })
  const rows = await query(`SELECT * FROM "${name}" ORDER BY id DESC LIMIT 100`)
  const cols = rows.length > 0 ? Object.keys(rows[0]) : []
  res.json({ columns: cols, rows })
})

router.post('/query', async (req, res) => {
  const { sql } = req.body
  if (!sql || typeof sql !== 'string') return res.status(400).json({ error: 'Requête SQL requise' })
  const trimmed = sql.trim().toUpperCase()
  if (!trimmed.startsWith('SELECT') && !trimmed.startsWith('PRAGMA') && !trimmed.startsWith('EXPLAIN'))
    return res.status(400).json({ error: 'Seules les requêtes SELECT sont autorisées' })
  try {
    const rows = await query(sql)
    const cols = rows.length > 0 ? Object.keys(rows[0]) : []
    res.json({ columns: cols, rows, count: rows.length })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

export default router
