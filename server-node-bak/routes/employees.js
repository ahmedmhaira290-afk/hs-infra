import { Router } from 'express'
import { query, queryOne, execute } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  res.json(await query('SELECT * FROM employees ORDER BY created_at DESC'))
})

router.get('/:id', async (req, res) => {
  const emp = await queryOne('SELECT * FROM employees WHERE id = ?', [req.params.id])
  if (!emp) return res.status(404).json({ error: 'Employé introuvable' })
  res.json(emp)
})

router.post('/', async (req, res) => {
  const { first_name, last_name, civilite, email, phone, genre, nationalite, ville, position, department, agence, hire_date, salary, birth_date, birth_place } = req.body
  if (!first_name || !last_name) return res.status(400).json({ error: 'Nom et prénom requis' })
  const result = await execute(`INSERT INTO employees (first_name, last_name, civilite, email, phone, genre, nationalite, ville, position, department, agence, hire_date, salary, birth_date, birth_place) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [first_name, last_name, civilite || 'M.', email, phone, genre || 'Masculin', nationalite || 'Marocaine', ville || 'Tanger', position, department, agence, hire_date, salary, birth_date, birth_place])
  const emp = await queryOne('SELECT * FROM employees WHERE id = ?', [result.lastInsertRowid])
  res.status(201).json(emp)
})

router.put('/:id', async (req, res) => {
  const { first_name, last_name, civilite, email, phone, genre, nationalite, ville, position, department, agence, hire_date, salary, birth_date, birth_place } = req.body
  const existing = await queryOne('SELECT id FROM employees WHERE id = ?', [req.params.id])
  if (!existing) return res.status(404).json({ error: 'Employé introuvable' })
  await execute(`UPDATE employees SET first_name=?, last_name=?, civilite=?, email=?, phone=?, genre=?, nationalite=?, ville=?, position=?, department=?, agence=?, hire_date=?, salary=?, birth_date=?, birth_place=? WHERE id=?`, [first_name, last_name, civilite, email, phone, genre, nationalite, ville, position, department, agence, hire_date, salary, birth_date, birth_place, req.params.id])
  res.json(await queryOne('SELECT * FROM employees WHERE id = ?', [req.params.id]))
})

router.delete('/:id', async (req, res) => {
  await execute('DELETE FROM employees WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

export default router
