import { Router } from 'express'
import { query, queryOne, execute } from '../db.js'

const router = Router()

function toHtml(title, content) {
  const lines = content.split('\n')
  const body = lines.map((line) => {
    const t = line.trim()
    if (!t) return '<div style="height:0.4rem"></div>'
    if (t === t.toUpperCase() && t.length > 3) {
      return `<h2 style="text-align:center;color:#0d2e4a;margin:1.2rem 0 0.8rem 0;font-size:1.3rem;font-weight:700">${t}</h2>`
    }
    const isLabel = line.includes(':') && !line.startsWith(' ')
    const style = isLabel ? 'line-height:1.7;color:#000;font-weight:600' : 'line-height:1.7;color:#111'
    return `<div style="${style}">${line}</div>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  @page { margin: 12mm 15mm }
  * { margin: 0; padding: 0; box-sizing: border-box }
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 12.5px; color: #111; line-height: 1.5 }
  .doc { max-width: 210mm; margin: 0 auto; padding: 20px 30px; background: #fff; min-height: 297mm; position: relative }
  .header { text-align:center; border-bottom:2px solid #0d2e4a; padding-bottom:10px; margin-bottom:15px }
  .header img { height: 45px }
  .header h1 { font-size:1.1rem; color:#0d2e4a; margin:3px 0 0 0; font-weight:700 }
  .ref { text-align:right; font-size:0.75rem; color:#666; margin-bottom:10px }
  .content { position:relative; z-index:1; min-height:350px }
  .sig { margin-top:40px; display:flex; justify-content:space-between; gap:40px }
  .sig .col { flex:1 }
  .sig .col .label { font-size:0.8rem; font-weight:600; color:#0d2e4a; margin-bottom:4px }
  .sig .col .line { border-bottom:1px solid #333; height:35px; margin-bottom:3px }
  .sig .col .name { font-size:0.75rem; color:#888 }
  .footer { position:absolute; bottom:15px; left:30px; right:30px; border-top:1px solid #ddd; padding-top:5px; font-size:0.65rem; color:#999; text-align:center }
</style></head>
<body>
<div class="doc">
  <div class="header">
    <img src="/images/hs-infra-logo.svg" alt="HS-INFRA" onerror="this.style.display='none'">
    <h1>HS-INFRA</h1>
  </div>
  <div class="ref">N° RÉF : ${title || ''} — Date : ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
  <div class="content">${body}</div>
  <div class="sig">
    <div class="col">
      <div class="label">Signature de l'employé(e)</div>
      <div class="line"></div>
      <div class="name">Nom & Prénom : _______________</div>
    </div>
    <div class="col">
      <div class="label">Signature du Responsable RH</div>
      <div class="line"></div>
      <div class="name">Cachet &amp; Signature</div>
    </div>
  </div>
  <div class="footer">HS-INFRA &mdash; Tanger, Maroc</div>
</div>
</body></html>`
}

router.get('/', async (req, res) => {
  res.json(await query('SELECT * FROM documents ORDER BY created_at DESC'))
})

router.post('/generate', async (req, res) => {
  const { employee_id, template_id, ...extraData } = req.body
  if (!employee_id || !template_id) return res.status(400).json({ error: 'Employé et modèle requis' })

  const emp = await queryOne('SELECT * FROM employees WHERE id = ?', [employee_id])
  const tpl = await queryOne('SELECT * FROM templates WHERE id = ?', [template_id])
  if (!emp || !tpl) return res.status(404).json({ error: 'Employé ou modèle introuvable' })

  const now = new Date()
  const countRes = await queryOne('SELECT COUNT(*) as count FROM documents')
  const count = countRes?.count || 0
  const ref = `DOC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Number(count) + 1).padStart(3, '0')}`
  const civilite = emp.genre && emp.genre[0] === 'F' ? 'Madame' : 'Monsieur'
  const ctx = { ...emp, civilite, ...extraData, date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }
  const content = (tpl.content || '').replace(/\{\{(\w+)\}\}/g, (_, key) => ctx[key] !== undefined ? String(ctx[key]) : `{{${key}}}`)
  const htmlContent = toHtml(ref, content)

  const result = await execute('INSERT INTO documents (reference, employee_id, template_id, content, html_content, employee_name, document_type) VALUES (?, ?, ?, ?, ?, ?, ?)', [ref, employee_id, template_id, content, htmlContent, `${emp.first_name} ${emp.last_name}`, tpl.title])
  res.status(201).json(await queryOne('SELECT * FROM documents WHERE id = ?', [result.lastInsertRowid]))
})

router.delete('/:id', async (req, res) => {
  await execute('DELETE FROM documents WHERE id = ?', [req.params.id])
  res.json({ success: true })
})

export default router
