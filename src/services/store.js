import api, { checkBackend } from './api'

function store(key) {
  return {
    getAll() {
      return JSON.parse(localStorage.getItem(key) || '[]')
    },
    saveAll(data) {
      localStorage.setItem(key, JSON.stringify(data))
    },
  }
}

const empStore = store('demo_employees')
const tplStore = store('demo_templates')
const docStore = store('demo_documents')

const EMP_VERSION = 3
const savedEmpVersion = Number(localStorage.getItem('emp_version') || 0)

const seedEmps = [
  { id: 1, first_name: 'Ahmed', last_name: 'Benali', civilite: 'M.', email: 'ahmed.benali@hs-infra.ma', phone: '0612345678', genre: 'Masculin', nationalite: 'Marocaine', ville: 'Tanger', position: 'Développeur', department: 'IT', agence: 'Tanger', hire_date: '2023-01-15', salary: '15000', birth_date: '1995-04-12', birth_place: 'Tanger', cin: 'GN258778', cnss: '254878795', bank_type: 'Banque Populaire', rib: '007 000 010000000000000000', bank_type_pro: 'Banque Populaire Pro', rib_pro: '007 001 010000000000000000' },
  { id: 2, first_name: 'Fatima', last_name: 'Zahra', civilite: 'Mme', email: 'fatima.zahra@hs-infra.ma', phone: '0623456789', genre: 'Féminin', nationalite: 'Marocaine', ville: 'Casablanca', position: 'Comptable', department: 'Finance', agence: 'Casablanca', hire_date: '2022-06-01', salary: '12000', birth_date: '1998-09-25', birth_place: 'Casablanca', cin: 'GN345678', cnss: '345678901', bank_type: 'CIH', rib: '007 000 020000000000000000', bank_type_pro: 'CIH Pro', rib_pro: '007 001 020000000000000000' },
  { id: 3, first_name: 'Hassan', last_name: 'El Khadir', civilite: 'M.', email: 'hassan.elkhadir@hs-infra.ma', phone: '0634567890', genre: 'Masculin', nationalite: 'Marocaine', ville: 'Tanger', position: 'Responsable RH', department: 'RH', agence: 'Tanger', hire_date: '2021-03-20', salary: '20000', birth_date: '1990-11-03', birth_place: 'Fès', cin: 'GN456789', cnss: '456789012', bank_type: 'BMCE', rib: '007 000 030000000000000000', bank_type_pro: 'BMCE Pro', rib_pro: '007 001 030000000000000000' },
]
const seedTpls = [
  { id: 1, title: "Attestation de travail", type: "Attestation de travail", is_active: true, content: "ATTESTATION DE TRAVAIL\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000, ayant son siège social à Tanger (Maroc),\n\nAtteste par la présente que :\n\n{{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nLa présente attestation est délivrée à l'intéressé(e) sur sa demande pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
  { id: 2, title: "Attestation de salaire", type: "Attestation de salaire", is_active: true, content: "ATTESTATION DE SALAIRE\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000,\n\nAtteste que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nPerçoit un salaire mensuel brut de : {{salary}} DH\n\nLa présente attestation est délivrée à l'intéressé(e) pour tous usages légaux.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
  { id: 3, title: "Demande de prime", type: "Demande de prime", is_active: true, content: "DEMANDE DE PRIME\n\nInformations du demandeur :\n\nNom & Prénom : {{first_name}} {{last_name}}\nFonction : {{position}}\nDépartement : {{department}}\nAgence : {{agence}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nMotif :\n{{motif}}\n\nMontant accordé :\n{{montant}} DH\n\nSIGNATURE\n\nDemandeur : ______________________\nResponsable hiérarchique : ______________________\nDépartement RH : ______________________\nDirection Générale : ______________________" },
  { id: 4, title: "Certificat médical", type: "Certificat médical", is_active: true, content: "CERTIFICAT MÉDICAL\n\nJe soussigné, Docteur ______________________, certifie avoir examiné {{civilite}} {{first_name}} {{last_name}}.\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\n\nRésultat :\n\n\n\nArrêt de travail du ______________ au ______________\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet du médecin : ______________________" },
  { id: 5, title: "Demande d'avance", type: "Demande d'avance", is_active: true, content: "DEMANDE D'AVANCE\n\nMadame/Monsieur le Responsable RH,\n\nJe soussigné(e) {{first_name}} {{last_name}}, exerçant la fonction de {{position}} au sein du département {{department}} (Agence : {{agence}}) — CIN : {{cin}} — CNSS : {{cnss}} — Type agence : {{bank_type}} — RIB : {{rib}}, sollicite une avance sur salaire d'un montant de {{montant}} DH.\n\nMotif : {{motif}}\n\nJe m'engage à rembourser cette avance selon les modalités convenues avec l'administration.\n\nSignature du demandeur : ______________________\nAvis du responsable hiérarchique : ______________________\nDécision RH : ______________________" },
  { id: 6, title: "Certificat de travail", type: "Certificat de travail", is_active: true, content: "CERTIFICAT DE TRAVAIL\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000,\n\nCertifie que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nA été employé(e) dans notre société du ______________ au ______________\nDurée totale : ______________\nDernier salaire perçu : {{salary}} DH\n\nCe certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
  { id: 7, title: "Attestation de domiciliation irrévocable de salaire", type: "Attestation de domiciliation irrévocable de salaire", is_active: true, content: "ATTESTATION DE DOMICILIATION IRRÉVOCABLE DE SALAIRE\n\nJe soussigné(e) {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nExerçant la fonction de {{position}} — Agence : {{agence}}\n\nDéclare par la présente domicilier mon salaire de façon irrévocable auprès de la banque :\n\nType agence : {{bank_type}} — RIB : {{rib}}\n\nMontant mensuel domicilié : {{salary}} DH\n\nJe reconnais que cette domiciliation reste irrévocable pendant toute la durée de mon contrat de travail.\n\nFait à Tanger, le {{date}}\n\nSignature de l'employé(e) : ______________________\nCachet de la banque : ______________________" },
  { id: 8, title: "Demande d'aide sociale", type: "Demande d'aide sociale", is_active: true, content: "DEMANDE D'AIDE SOCIALE\n\nObjet : Demande d'aide sociale\n\nMadame/Monsieur le Responsable RH,\n\nJe soussigné(e) {{first_name}} {{last_name}}, matricule ______________, exerçant la fonction de {{position}} au département {{department}}, agence {{agence}} — CIN : {{cin}} — CNSS : {{cnss}} — Type agence : {{bank_type}} — RIB : {{rib}}, ai l'honneur de solliciter votre bienveillance pour une aide sociale.\n\nMotif de la demande :\n{{motif}}\n\nMontant sollicité : {{montant}} DH\n\nPièces jointes :\n- ______________\n- ______________\n\nSignature du demandeur : ______________________\nAvis du responsable : ______________________\nDécision de la commission : ______________________" },
  { id: 9, title: "Pièce de caisse dépense", type: "Pièce de caisse dépense", is_active: true, content: "PIÈCE DE CAISSE DÉPENSE\n\nN° : ______________\nDate : {{date}}\n\nNom du bénéficiaire : {{first_name}} {{last_name}}\nFonction : {{position}}\n\nObjet de la dépense : {{motif}}\n\nMontant : {{montant}} DH\n\nArrêté la présente pièce à la somme de : ______________ DH\n\nSignatures :\n\nLe bénéficiaire : ______________________\nLe responsable : ______________________\nLe comptable : ______________________\nLe caissier : ______________________" },
  { id: 10, title: "Demande prime", type: "Demande prime", is_active: true, content: "DEMANDE DE PRIME\n\nMadame/Monsieur le Responsable,\n\nJe soussigné(e) {{first_name}} {{last_name}}, {{position}} — CIN : {{cin}} — CNSS : {{cnss}} — Type agence : {{bank_type}} — RIB : {{rib}}, ai l'honneur de solliciter l'octroi d'une prime pour le motif suivant :\n\n{{motif}}\n\nMontant sollicité : {{montant}} DH\n\nSignature du demandeur : ______________________\nAvis du supérieur hiérarchique : ______________________\nDécision de la direction : ______________________" },
  { id: 11, title: "Attestation de travail et salaire", type: "Attestation de travail et salaire", is_active: true, content: "ATTESTATION DE TRAVAIL ET SALAIRE\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000,\n\nAtteste que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nEst employé(e) à notre société depuis le {{hire_date}}\nSalaire mensuel actuel : {{salary}} DH\n\nCette attestation est délivrée à l'intéressé(e) pour tous usages légaux.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
  { id: 12, title: "Attestation de travail en bonne et due forme", type: "Attestation de travail en bonne et due forme", is_active: true, content: "ATTESTATION DE TRAVAIL EN BONNE ET DUE FORME\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000, ayant son siège social à Tanger (Maroc),\n\nAtteste par la présente que {{civilite}} {{first_name}} {{last_name}}\n\nNé(e) le : {{birth_date}}\nLieu de naissance : {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de : {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nEmployé(e) sous le matricule : ______________\n\nLa présente attestation est délivrée à l'intéressé(e) sur sa demande pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
]

const existingEmps = empStore.getAll()
if (existingEmps.length < seedEmps.length || savedEmpVersion < EMP_VERSION) {
  const merged = [...existingEmps.filter((e) => e.id > seedEmps.length)]
  for (const emp of seedEmps) {
    const idx = merged.findIndex((e) => e.id === emp.id)
    if (idx > -1) merged[idx] = { ...merged[idx], ...emp }
    else merged.push(emp)
  }
  empStore.saveAll(merged)
  localStorage.setItem('emp_version', String(EMP_VERSION))
}

const TPL_VERSION = 7
const savedVersion = Number(localStorage.getItem('tpl_version') || 0)
const existingTpls = tplStore.getAll()
if (existingTpls.length < seedTpls.length || savedVersion < TPL_VERSION) {
  const merged = [...existingTpls.filter((t) => t.id > seedTpls.length)]
  for (const tpl of seedTpls) {
    const idx = merged.findIndex((t) => t.id === tpl.id)
    if (idx > -1) merged[idx] = tpl
    else merged.push(tpl)
  }
  tplStore.saveAll(merged)
  localStorage.setItem('tpl_version', String(TPL_VERSION))
}

let _backendOk = null
async function tryApi(fn, fallback) {
  if (_backendOk === null) _backendOk = await checkBackend()
  if (!_backendOk) return fallback()
  try { return await fn() } catch { return fallback() }
}
// Re-check backend every 60s
setInterval(async () => { _backendOk = await checkBackend() }, 60000)

function apiCrud(resource, localStore) {
  return {
    async list() {
      return tryApi(() => api.get(`/${resource}`).then((r) => r.data), () => localStore.getAll())
    },
    async get(id) {
      return tryApi(() => api.get(`/${resource}/${id}`).then((r) => r.data), () => localStore.getAll().find((x) => x.id === Number(id)))
    },
    async create(form) {
      return tryApi(() => api.post(`/${resource}`, form).then((r) => r.data), () => {
        const all = localStore.getAll(); const item = { ...form, id: Date.now() }; all.push(item); localStore.saveAll(all)
        return item
      })
    },
    async update(id, form) {
      return tryApi(() => api.put(`/${resource}/${id}`, form).then((r) => r.data), () => {
        const all = localStore.getAll(); const idx = all.findIndex((x) => x.id === Number(id))
        if (idx > -1) all[idx] = { ...all[idx], ...form }; localStore.saveAll(all)
        return all[idx]
      })
    },
    async remove(id) {
      return tryApi(() => api.delete(`/${resource}/${id}`), () => {
        localStore.saveAll(localStore.getAll().filter((x) => x.id !== Number(id)))
      })
    },
  }
}

export const employeeStore = apiCrud('employees', empStore)

export const templateStore = {
  ...apiCrud('templates', tplStore),
  async list(activeOnly = false) {
    return tryApi(
      () => api.get(`/templates${activeOnly ? '?active=1' : ''}`).then((r) => r.data),
      () => { const all = tplStore.getAll(); return activeOnly ? all.filter((t) => t.is_active) : all }
    )
  },
}

export function toHtml(title, content) {
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

export const documentStore = {
  async list() {
    return tryApi(
      () => api.get('/documents').then((r) => {
        const apiDocs = r.data.map((d) => ({ ...d, htmlContent: d.html_content }))
        const localDocs = docStore.getAll()
        const apiRefs = new Set(apiDocs.map((d) => d.reference))
        const merged = [...apiDocs, ...localDocs.filter((d) => !apiRefs.has(d.reference))]
        merged.sort((a, b) => new Date(b.created_at?.replace(' ', 'T')) - new Date(a.created_at?.replace(' ', 'T')))
        return merged
      }),
      () => docStore.getAll()
    )
  },
  async generate(employeeId, templateId, extraData = {}) {
    return tryApi(() => api.post('/documents/generate', { employee_id: Number(employeeId), template_id: Number(templateId), ...extraData }).then((r) => { const d = r.data; return { ...d, htmlContent: d.html_content } }), () => {
      const emp = empStore.getAll().find((e) => e.id === Number(employeeId))
      const tpl = tplStore.getAll().find((t) => t.id === Number(templateId))
      const now = new Date()
      const ref = `DOC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(docStore.getAll().length + 1).padStart(3, '0')}`
      const civilite = emp?.genre && emp.genre[0] === 'F' ? 'Madame' : 'Monsieur'
      const ctx = { ...emp, civilite, ...extraData, date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }
      const content = (tpl?.content || '').replace(/\{\{(\w+)\}\}/g, (_, key) => ctx?.[key] !== undefined ? ctx[key] : `{{${key}}}`)
      const htmlContent = toHtml(ref, content)
      const doc = {
        id: Date.now(), reference: ref, employee_id: Number(employeeId),
        template_id: Number(templateId), content, htmlContent,
        employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Inconnu',
        document_type: tpl?.title || 'Document', created_at: now.toISOString(),
      }
      const all = docStore.getAll(); all.push(doc); docStore.saveAll(all)
      return doc
    })
  },
  async remove(id) {
    return tryApi(() => api.delete(`/documents/${id}`), () => {
      docStore.saveAll(docStore.getAll().filter((d) => d.id !== Number(id)))
    })
  },
}
