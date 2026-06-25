import { useState, useEffect } from 'react'
import { employeeStore, templateStore, documentStore } from '../../services/store'
import api from '../../services/api'

const tables = [
  { key: 'employees', label: 'Employés', cols: ['id', 'first_name', 'last_name', 'email', 'position', 'department', 'agence', 'phone', 'genre', 'nationalite', 'ville', 'salary', 'hire_date', 'birth_date', 'birth_place', 'cin', 'cnss', 'bank_type', 'rib', 'bank_type_pro', 'rib_pro'] },
  { key: 'templates', label: 'Modèles', cols: ['id', 'title', 'type', 'is_active'] },
  { key: 'users', label: 'Utilisateurs', cols: ['id', 'name', 'email', 'role', 'phone'] },
  { key: 'documents', label: 'Documents', cols: ['id', 'reference', 'employee_name', 'document_type', 'created_at'] },
]

export default function Database() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTable, setActiveTable] = useState('employees')
  const [error, setError] = useState(null)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.allSettled([
      employeeStore.list().then(d => ({ key: 'employees', rows: d })),
      templateStore.list().then(d => ({ key: 'templates', rows: d })),
      documentStore.list().then(d => ({ key: 'documents', rows: d })),
      api.get('/users').then(r => ({ key: 'users', rows: r.data })).catch(() => ({ key: 'users', rows: [] })),
    ]).then(results => {
      const obj = {}
      for (const r of results) {
        if (r.status === 'fulfilled') obj[r.value.key] = r.value.rows
        else obj[r.key] = []
      }
      setData(obj)
      setLoading(false)
    })
  }, [])

  const rows = data[activeTable] || []

  const openDB = async () => {
    setOpening(true)
    try {
      await api.get('/open-db')
    } catch (e) {
      setError('Impossible d\'ouvrir la base de données')
    }
    setOpening(false)
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title mb-3">
        <i className="bi bi-database"></i>
        <span>Explorateur de base de données</span>
      </div>

      <div className="card mb-3">
        <div className="card-body py-2 d-flex gap-2 flex-wrap align-items-center">
          {tables.map(t => (
            <button key={t.key}
              className={`btn btn-sm ${activeTable === t.key ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTable(t.key)}>
              <i className="bi bi-table me-1"></i>{t.label}
              <span className="badge bg-light text-dark ms-1">{data[t.key]?.length ?? 0}</span>
            </button>
          ))}
          <button className="btn btn-sm btn-success ms-auto" onClick={openDB} disabled={opening}>
            <i className={`bi ${opening ? 'bi-arrow-repeat spin' : 'bi-box-arrow-up-right'} me-1`}></i>
            {opening ? 'Ouverture...' : 'Ouvrir la base'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted small">Chargement des données...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0" style={{ overflowX: 'auto' }}>
            {rows.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                Aucune donnée dans cette table
              </div>
            ) : (
              <table className="table table-sm table-hover mb-0" style={{ fontSize: '0.8rem' }}>
                <thead className="table-dark">
                  <tr>
                    {Object.keys(rows[0] || {}).filter(k => !k.startsWith('_')).map(col => (
                      <th key={col} className="text-nowrap">{col.replace(/_/g, ' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id || i}>
                      {Object.entries(row).filter(([k]) => !k.startsWith('_')).map(([col, val]) => {
                        const v = typeof val === 'string' && val.length > 80 ? val.slice(0, 80) + '...' : val
                        const isContent = col === 'content' || col === 'html_content'
                        return (
                          <td key={col} className="text-nowrap" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {isContent && v !== undefined ? (
                              <button className="btn btn-sm btn-link p-0" title={String(val || '')}
                                onClick={() => alert(val || '')}>
                                <i className="bi bi-eye"></i>
                              </button>
                            ) : v === null || v === undefined ? (
                              <span className="text-muted">—</span>
                            ) : String(v)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3 py-2 small">
          <i className="bi bi-exclamation-circle me-1"></i>{error}
        </div>
      )}
    </>
  )
}
