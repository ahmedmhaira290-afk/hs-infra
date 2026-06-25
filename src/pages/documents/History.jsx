import { useState, useEffect } from 'react'
import { documentStore, toHtml } from '../../services/store'

export default function History() {
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    documentStore.list().then(setDocuments)
  }, [])

  const getHtml = (doc) => doc?.htmlContent || (doc?.content ? toHtml(doc.reference, doc.content) : null)

  const handleDownloadWord = (doc) => {
    const html = getHtml(doc)
    if (!html) return
    const blob = new Blob([html], { type: 'application/msword' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${doc.reference}.doc`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handlePrintPdf = (doc) => {
    const html = getHtml(doc)
    if (!html) return
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.top = '-9999px'
    iframe.style.width = '0'
    iframe.style.height = '0'
    document.body.appendChild(iframe)
    const win = iframe.contentWindow
    win.document.write(html)
    win.document.close()
    setTimeout(() => {
      win.focus()
      win.print()
      setTimeout(() => document.body.removeChild(iframe), 1000)
    }, 300)
  }

  const filtered = documents.filter((doc) => {
    const ref = (doc.reference || '').toLowerCase()
    const emp = (doc.employee_name || '').toLowerCase()
    const type = (doc.document_type || '').toLowerCase()
    const dateRaw = (doc.created_at || '').toLowerCase()
    const fields = [ref, emp, type, dateRaw].join(' ')
    const matchSearch = !search || fields.includes(search.toLowerCase())
    const d = new Date(doc.created_at?.replace(' ', 'T'))
    const matchDateFrom = !dateFrom || d >= new Date(dateFrom)
    const matchDateTo = !dateTo || d <= new Date(dateTo + 'T23:59:59')
    return matchSearch && matchDateFrom && matchDateTo
  })

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title">
        <i className="bi bi-clock-history"></i>
        <span>Historique des documents</span>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4 search-box">
              <i className="bi bi-search"></i>
              <input type="text" className="form-control" placeholder="Réf., employé, type, date..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="col-md-2">
              {(search || dateFrom || dateTo) && (
                <button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(''); setDateFrom(''); setDateTo('') }}>
                  <i className="bi bi-x-circle me-1"></i>Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Employé</th>
                <th>Type</th>
                <th>Généré le</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td className="fw-medium">{doc.reference}</td>
                  <td>{doc.employee_name}</td>
                  <td><span className="badge bg-info-subtle text-info">{doc.document_type}</span></td>
                  <td className="text-muted">{new Date(doc.created_at?.replace(' ', 'T')).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handlePrintPdf(doc)} title="Imprimer / PDF">
                        <i className="bi bi-file-earmark-pdf"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleDownloadWord(doc)} title="Word">
                        <i className="bi bi-file-earmark-word"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="text-center text-muted py-4">Aucun document trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
