import { Router } from 'express'
import { query, queryOne, execute } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  let sql = 'SELECT * FROM templates'
  if (req.query.active === '1') sql += ' WHERE is_active = 1'
  sql += ' ORDER BY id ASC'
  res.json(await query(sql))
})

router.get('/:id', async (req, res) => {
  const tpl = await queryOne('SELECT * FROM templates WHERE id = ?', [req.params.id])
  if (!tpl) return res.status(404).json({ error: 'Modèle introuvable' })
  res.json(tpl)
})

router.post('/', async (req, res) => {
  const { title, type, content, is_active } = req.body
  if (!title) return res.status(400).json({ error: 'Titre requis' })
  const result = await execute('INSERT INTO templates (title, type, is_active, content) VALUES (?, ?, ?, ?)', [title, type || title, is_active !== undefined ? (is_active ? 1 : 0) : 1, content || ''])
  res.status(201).json(await queryOne('SELECT * FROM templates WHERE id = ?', [result.lastInsertRowid]))
})

router.put('/:id', async (req, res) => {
  const { title, type, content, is_active } = req.body
  const existing = await queryOne('SELECT id FROM templates WHERE id = ?', [req.params.id])
  if (!existing) return res.status(404).json({ error: 'Modèle introuvable' })
  await execute('UPDATE templates SET title=?, type=?, is_active=?, content=? WHERE id=?', [title, type, is_active !== undefined ? (is_active ? 1 : 0) : 1, content, req.params.id])
  res.json(await queryOne('SELECT * FROM templates WHERE id = ?', [req.params.id]))
})

router.delete('/:id', async (req, res) => {
  await execute('DELETE FROM templates WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

export default router
