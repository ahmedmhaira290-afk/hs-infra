import { useState, useEffect, useRef } from 'react'
import { employeeStore, templateStore, documentStore } from '../../services/store'

export default function Generate() {
  const [employees, setEmployees] = useState([])
  const [templates, setTemplates] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [motif, setMotif] = useState('')
  const [autreMotif, setAutreMotif] = useState('')
  const [montant, setMontant] = useState('')
  const [preview, setPreview] = useState(null)
  const [generating, setGenerating] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    employeeStore.list().then(setEmployees)
    templateStore.list(true).then(setTemplates)
  }, [])

  const selectedTpl = templates.find((t) => t.id === Number(selectedTemplate))
  const isPrime = selectedTpl?.type === 'Demande de prime'

  const resetExtra = () => {
    setMotif('')
    setAutreMotif('')
    setMontant('')
  }

  const handleGenerate = async () => {
    if (!selectedEmployee || !selectedTemplate) return
    setGenerating(true)
    try {
      const extra = isPrime ? {
        motif: motif === 'Autres' ? autreMotif : motif,
        montant,
      } : {}
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

            {isPrime && (
              <>
                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-question-circle me-1"></i>Motif</label>
                  <select className="form-select" value={motif} onChange={(e) => setMotif(e.target.value)}>
                    <option value="">Sélectionner...</option>
                    <option value="Naissance">Naissance</option>
                    <option value="Mariage">Mariage</option>
                    <option value="Autres">Autres</option>
                  </select>
                </div>
                {motif === 'Autres' && (
                  <div className="col-md-4">
                    <label className="form-label">Précisez le motif</label>
                    <input type="text" className="form-control" value={autreMotif} onChange={(e) => setAutreMotif(e.target.value)} placeholder="Autre motif..." />
                  </div>
                )}
                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-currency-exchange me-1"></i>Montant (DH)</label>
                  <input type="number" className="form-control" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="0" />
                </div>
              </>
            )}

            <div className="col-12">
              <button className="btn btn-primary"
                onClick={handleGenerate}
                disabled={!selectedEmployee || !selectedTemplate || generating || (isPrime && (!motif || !montant))}>
                <i className={`bi ${generating ? 'bi-arrow-repeat spin' : 'bi-lightning'} me-1`}></i>
                {generating ? 'Génération...' : 'Générer'}
              </button>
            </div>
          </div>
        </div>
      </div>

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
