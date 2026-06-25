const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

try {
  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(1);
  console.log('Employee:', emp ? emp.first_name + ' ' + emp.last_name : 'NOT FOUND');

  const tpl = db.prepare('SELECT * FROM templates WHERE id = ?').get(1);
  console.log('Template:', tpl ? tpl.title : 'NOT FOUND');

  if (!emp || !tpl) {
    console.log('Missing data');
    process.exit(1);
  }

  const now = new Date();
  const countRes = db.prepare('SELECT COUNT(*) as count FROM documents').get();
  const count = countRes?.count || 0;
  const ref = `DOC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Number(count) + 1).padStart(3, '0')}`;
  console.log('Ref:', ref);

  const civilite = emp.genre && emp.genre[0] === 'F' ? 'Madame' : 'Monsieur';
  const ctx = { ...emp, civilite, date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) };
  const content = (tpl.content || '').replace(/\{\{(\w+)\}\}/g, (_, key) => ctx[key] !== undefined ? String(ctx[key]) : `{{${key}}}`);
  console.log('Content generated:', content.substring(0, 60));

  const info = db.prepare('INSERT INTO documents (reference, employee_id, template_id, content, html_content, employee_name, document_type) VALUES (?, ?, ?, ?, ?, ?, ?)').run(ref, 1, 1, content, '<html></html>', `${emp.first_name} ${emp.last_name}`, tpl.title);
  console.log('Insert OK, id:', info.lastInsertRowid);

  const saved = db.prepare('SELECT * FROM documents WHERE id = ?').get(info.lastInsertRowid);
  console.log('Saved doc:', saved.reference, saved.document_type, saved.employee_name);
} catch(e) {
  console.log('ERROR:', e.message);
  console.log('Stack:', e.stack);
}

db.close();
