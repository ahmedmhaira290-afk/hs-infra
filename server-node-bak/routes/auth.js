import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { queryOne, execute, query } from '../db.js'
import { generateToken } from '../auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' })

  const user = await queryOne('SELECT * FROM users WHERE email = ?', [email])
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  const token = generateToken(user)
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

router.post('/register', async (req, res) => {
  const { name, email, password, role, phone } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Tous les champs sont requis' })

  const exists = await queryOne('SELECT id FROM users WHERE email = ?', [email])
  if (exists) return res.status(409).json({ error: 'Cet email est déjà utilisé' })

  const hash = bcrypt.hashSync(password, 10)
  const result = await execute('INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)', [name, email, hash, role || 'agent', phone || ''])
  const user = { id: result.lastInsertRowid, name, email, role: role || 'agent', phone: phone || '' }
  const token = generateToken(user)
  res.status(201).json({ token, user })
})

router.get('/users', async (req, res) => {
  const users = await query('SELECT id, name, email, role, phone, created_at FROM users')
  res.json(users)
})

router.put('/users/:id', async (req, res) => {
  const { name, email, password, role, phone } = req.body
  if (role === 'responsable') {
    await execute('UPDATE users SET role = ? WHERE role = ? AND id != ?', ['agent', 'responsable', req.params.id])
  }
  if (password) {
    const hash = bcrypt.hashSync(password, 10)
    await execute('UPDATE users SET name = ?, email = ?, password = ?, role = ?, phone = ? WHERE id = ?', [name, email, hash, role, phone || '', req.params.id])
  } else {
    await execute('UPDATE users SET name = ?, email = ?, role = ?, phone = ? WHERE id = ?', [name, email, role, phone || '', req.params.id])
  }
  const updated = await queryOne('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?', [req.params.id])
  res.json(updated)
})

router.delete('/users/:id', async (req, res) => {
  await execute('DELETE FROM users WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

export default router
