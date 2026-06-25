import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initDb } from './db.js'
import { seed } from './seed.js'
import authRoutes from './routes/auth.js'
import employeeRoutes from './routes/employees.js'
import templateRoutes from './routes/templates.js'
import documentRoutes from './routes/documents.js'
import dbViewRoutes from './routes/dbview.js'
import { authenticate } from './auth.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'ok', service: 'HS-INFRA RH API' }))

app.get('/api/open-db', (req, res) => {
  try {
    const script = join(__dirname, '..', 'opendb.bat')
    spawn('cmd', ['/c', 'start', '', script], { detached: true, stdio: 'ignore' }).unref()
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.use('/api', authRoutes)
app.use('/api/employees', authenticate, employeeRoutes)
app.use('/api/templates', authenticate, templateRoutes)
app.use('/api/documents', authenticate, documentRoutes)
app.use('/api/db', authenticate, dbViewRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

async function start() {
  await initDb()
  await seed()
  app.listen(PORT, () => {
    console.log(`Serveur RH démarré sur http://localhost:${PORT}`)
  })
}

start()
