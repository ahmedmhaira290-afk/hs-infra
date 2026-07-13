import { useState, useEffect, useRef } from 'react'
import { employeeStore, templateStore, documentStore, numberToFrench } from '../../services/store'

const EMP_FIELDS = [
  'civilite', 'first_name', 'last_name', 'email', 'phone', 'genre',
  'nationalite', 'ville', 'birth_date', 'birth_place', 'cin', 'cnss',
  'position', 'department', 'agence', 'hire_date', 'salary',
  'bank_type', 'rib', 'bank_type_pro', 'rib_pro',
  'cnss_remb', 'montant_accorde',
]

const EXTRA_VARS = ['motif', 'montant', 'total_charges', 'date', 'raison_sociale']

function resolveVar(emp, varName) {
  const key = varName.toLowerCase()
  if (EXTRA_VARS.includes(key)) return null
  if (EMP_FIELDS.includes(key)) return emp[key] ?? null
  return null
}

function parseVars(html) {
  if (!html) return []
  const re = /\{\{(\w+)\}\}/g
  const seen = new Set()
  const vars = []
  let m
  while ((m = re.exec(html)) !== null) {
    const name = m[1].toLowerCase()
    if (!seen.has(name)) {
      seen.add(name)
      vars.push(name)
    }
  }
  return vars
}


function DataPreview({ employee, template }) {
  const [showAll, setShowAll] = useState(false)
  const raw = template?.content || template?.html || ''
  const vars = parseVars(raw)

  if (!employee || !template) return null

  const empVars = vars.filter((v) => EMP_FIELDS.includes(v))
  const extraVarsUsed = vars.filter((v) => EXTRA_VARS.includes(v))
  const unknownVars = vars.filter((v) => !EMP_FIELDS.includes(v) && !EXTRA_VARS.includes(v))

  const rows = showAll ? vars : empVars

  const renderValue = (varName) => {
    const val = resolveVar(employee, varName)
    if (val !== null) return String(val)
    if (EXTRA_VARS.includes(varName)) return <em className="text-muted">Saisi lors de la génération</em>
    return <em className="text-danger">Inconnu</em>
  }

  const count = vars.length
  const found = vars.filter((v) => resolveVar(employee, v) !== null).length
  const extraCount = extraVarsUsed.length
  const unknownCount = unknownVars.length

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>
          <i className="bi bi-database me-1"></i>Données injectées
          <span className="badge bg-secondary ms-2">{found}/{count} de l'employé</span>
          {extraCount > 0 && <span className="badge bg-info ms-1">{extraCount} saisie</span>}
          {unknownCount > 0 && <span className="badge bg-warning ms-1">{unknownCount} inconnue(s)</span>}
        </span>
        <div className="form-check form-switch mb-0">
          <input className="form-check-input" type="checkbox" id="showAllToggle" checked={showAll} onChange={() => setShowAll(!showAll)} />
          <label className="form-check-label" htmlFor="showAllToggle">Tout</label>
        </div>
      </div>
      <div className="card-body py-2 px-3">
        {rows.length === 0 ? (
          <p className="text-muted small mb-0">Aucune variable trouvée dans ce modèle.</p>
        ) : (
          <div className="row small">
            {rows.map((v) => (
              <div key={v} className="col-md-4 col-lg-3 mb-1">
                <span className="text-muted">{v.replace(/_/g, ' ')} : </span>
                <span className="fw-bold">{renderValue(v)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Generate() {
  const [employees, setEmployees] = useState([])
  const [templates, setTemplates] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [motif, setMotif] = useState('')
  const [autreMotif, setAutreMotif] = useState('')
  const [montant, setMontant] = useState('')
  const [totalCharges, setTotalCharges] = useState('')
  const [capital, setCapital] = useState('')
  const [immatricule, setImmatricule] = useState('')
  const [salaire, setSalaire] = useState('')
  const [preview, setPreview] = useState(null)
  const [generating, setGenerating] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    employeeStore.list().then(setEmployees)
    templateStore.list(true).then(setTemplates)
  }, [])

  const selectedTpl = templates.find((t) => t.id === Number(selectedTemplate))
  const isPrime = selectedTpl?.type === 'Demande de prime'
  const isAideSociale = selectedTpl?.type === "Demande d'aide sociale"
  const isPieceDeCaisse = selectedTpl?.type === "Pièce de caisse dépense"
  const isDemandeAvance = selectedTpl?.type === "Demande d'avance"
  const isDomiciliation = selectedTpl?.type === "Attestation de domiciliation irrévocable de salaire"
  const isAttestationSalaire = selectedTpl?.type === "Attestation de salaire"
  const needsExtra = isPrime || isAideSociale || isPieceDeCaisse || isDemandeAvance || isDomiciliation || isAttestationSalaire

  const resetExtra = () => {
    setMotif('')
    setAutreMotif('')
    setMontant('')
    setTotalCharges('')
    setCapital('')
    setImmatricule('')
    setSalaire('')
  }

  const handleGenerate = async () => {
    if (!selectedEmployee || !selectedTemplate) return
    setGenerating(true)
    try {
      const emp = employees.find((e) => e.id === Number(selectedEmployee))
      const finalMotif = motif === 'Autres' ? autreMotif : motif
      const extra = {
        motif: finalMotif || '',
        montant: montant || '',
        ...(isAideSociale ? { total_charges: totalCharges } : {}),
        ...(isDomiciliation ? { capital: capital || '', immatricule: immatricule || '' } : {}),
        ...(isAttestationSalaire ? (() => {
          const s = salaire || emp?.salary || ''
          const words = numberToFrench(s)
          return { salary: s, salary_letters: words }
        })() : {}),
        cnss_remb: emp?.cnss_remb || '',
        montant_accorde: emp?.montant_accorde || '',
      }
      const data = await documentStore.generate(selectedEmployee, selectedTemplate, extra)
      setPreview(data)
    } catch (err) {
      alert(err.message || 'Erreur lors de la génération')
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    if (preview?.htmlContent && iframeRef.current) {
      const blob = new Blob([preview.htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      iframeRef.current.src = url
      return () => URL.revokeObjectURL(url)
    }
  }, [preview])

  const handleDownloadHtml = () => {
    if (!preview?.htmlContent) return
    const blob = new Blob([preview.htmlContent], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${preview.reference}.html`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleDownloadWord = () => {
    if (!preview?.htmlContent) return
    const blob = new Blob([preview.htmlContent], { type: 'application/msword' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${preview.reference}.doc`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handlePrint = () => {
    if (!preview?.htmlContent) return
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.top = '-9999px'
    iframe.style.width = '0'
    iframe.style.height = '0'
    document.body.appendChild(iframe)
    const win = iframe.contentWindow
    win.document.write(preview.htmlContent)
    win.document.close()
    setTimeout(() => {
      win.focus()
      win.print()
      setTimeout(() => document.body.removeChild(iframe), 1000)
    }, 300)
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title">
        <i className="bi bi-file-earmark-plus"></i>
        <span>Génération de document</span>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label"><i className="bi bi-person me-1"></i>Employé</label>
              <select className="form-select" value={selectedEmployee} onChange={(e) => { setSelectedEmployee(e.target.value); setPreview(null) }}>
                <option value="">Sélectionner un employé...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} — {emp.position}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label"><i className="bi bi-file-text me-1"></i>Type de document</label>
              <select className="form-select" value={selectedTemplate} onChange={(e) => { setSelectedTemplate(e.target.value); setPreview(null); resetExtra() }}>
                <option value="">Sélectionner un modèle...</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>{tpl.title}</option>
                ))}
              </select>
            </div>

            {needsExtra && (
              <>
                <div className="col-md-3">
                  <label className="form-label"><i className="bi bi-question-circle me-1"></i>Motif</label>
                  <select className="form-select" value={motif} onChange={(e) => setMotif(e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {isPrime ? (
                      <>
                        <option value="Naissance">Naissance</option>
                        <option value="Mariage">Mariage</option>
                        <option value="Autres">Autres (à préciser)</option>
                      </>
                    ) : isPieceDeCaisse ? (
                      <>
                        <option value="Fournitures bureau">Fournitures de bureau</option>
                        <option value="Déplacement">Déplacement / Transport</option>
                        <option value="Réparation">Frais de réparation</option>
                        <option value="Achats divers">Achats divers</option>
                        <option value="Avance s/salaire">Avance sur salaire</option>
                        <option value="Remboursement">Remboursement</option>
                      </>
                    ) : isDemandeAvance ? (
                      <>
                        <option value="Frais médicaux">Frais médicaux</option>
                        <option value="Scolarité">Scolarité</option>
                        <option value="Voyage">Voyage</option>
                        <option value="Projet personnel">Projet personnel</option>
                        <option value="Urgence">Urgence</option>
                      </>
                    ) : (
                      <>
                        <option value="Maladie">Maladie</option>
                        <option value="Hospitalisation">Hospitalisation</option>
                        <option value="Décès">Décès (famille)</option>
                        <option value="Scolarité">Scolarité des enfants</option>
                        <option value="Logement">Logement</option>
                        <option value="Urgence">Situation d'urgence</option>
                      </>
                    )}
                    <option value="Autres">Autres</option>
                  </select>
                </div>
                {motif === 'Autres' && (
                  <div className="col-md-3">
                    <label className="form-label">Précisez le motif</label>
                    <input type="text" className="form-control" value={autreMotif} onChange={(e) => setAutreMotif(e.target.value)} placeholder="Autre motif..." />
                  </div>
                )}
                <div className="col-md-3">
                  <label className="form-label"><i className="bi bi-currency-exchange me-1"></i>Montant <small className="text-muted">(opt.)</small></label>
                  <input type="number" className="form-control" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="0" />
                </div>
                {isAideSociale && (
                  <>
                    <div className="col-md-3">
                      <label className="form-label">Total charges <small className="text-muted">(opt.)</small></label>
                      <input type="number" className="form-control" value={totalCharges} onChange={(e) => setTotalCharges(e.target.value)} placeholder="0" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Remb. CNSS <small className="text-muted">(de l'employé)</small></label>
                      <div className="form-control-plaintext fw-bold">
                        {employees.find((e) => e.id === Number(selectedEmployee))?.cnss_remb || '—'} DH
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Aide accordée <small className="text-muted">(de l'employé)</small></label>
                      <div className="form-control-plaintext fw-bold">
                        {employees.find((e) => e.id === Number(selectedEmployee))?.montant_accorde || '—'} DH
                      </div>
                    </div>
                  </>
                )}
                {isDomiciliation && (
                  <>
                    <div className="col-md-3">
                      <label className="form-label">Capital <small className="text-muted">(opt.)</small></label>
                      <input type="text" className="form-control" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="Ex: 1 000 000 DH" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Immatriculé RC n° <small className="text-muted">(opt.)</small></label>
                      <input type="text" className="form-control" value={immatricule} onChange={(e) => setImmatricule(e.target.value)} placeholder="Ex: 123456" />
                    </div>
                  </>
                )}
                {isAttestationSalaire && (
                  <div className="col-md-3">
                    <label className="form-label"><i className="bi bi-currency-exchange me-1"></i>Salaire mensuel brut</label>
                    <input type="number" className="form-control" value={salaire} onChange={(e) => setSalaire(e.target.value)} placeholder="Ex: 15000" />
                    <small className="text-muted">Laissez vide pour utiliser celui de l'employé</small>
                  </div>
                )}
              </>
            )}

            <div className="col-12">
              <button className="btn btn-primary"
                onClick={handleGenerate}
                disabled={!selectedEmployee || !selectedTemplate || generating}>
                <i className={`bi ${generating ? 'bi-arrow-repeat spin' : 'bi-lightning'} me-1`}></i>
                {generating ? 'Génération...' : 'Générer'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedEmployee && selectedTemplate && !preview && (
        <DataPreview employee={employees.find((e) => e.id === Number(selectedEmployee))} template={selectedTpl} />
      )}

      {preview && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span><i className="bi bi-eye me-1"></i>Aperçu — {preview.reference}</span>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-danger" onClick={handlePrint}>
                <i className="bi bi-file-earmark-pdf me-1"></i>PDF
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleDownloadWord}>
                <i className="bi bi-file-earmark-word me-1"></i>Word
              </button>
              <button className="btn btn-sm btn-secondary" onClick={handleDownloadHtml}>
                <i className="bi bi-download me-1"></i>HTML
              </button>
            </div>
          </div>
          <div className="card-body p-0" style={{ background: '#f0f0f0' }}>
            <iframe ref={iframeRef} title="Aperçu" style={{ width: '100%', height: '80vh', border: 'none' }} />
          </div>
        </div>
      )}
    </>
  )
}
