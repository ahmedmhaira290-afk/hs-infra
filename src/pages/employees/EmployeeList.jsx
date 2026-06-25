import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { employeeStore } from '../../services/store'
import { useAuth } from '../../context/AuthContext'
import { hasPermission, PERMISSIONS } from '../../config/permissions'

export default function EmployeeList() {
  const { user } = useAuth()
  const canManage = hasPermission(user?.role, PERMISSIONS.MANAGE_EMPLOYEES)
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [syncing, setSyncing] = useState(false)

  const load = () => employeeStore.list().then(setEmployees)

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet employé ?')) return
    await employeeStore.remove(id)
    await load()
  }

  const handleSync = async () => {
    setSyncing(true)
    await load()
    setSyncing(false)
  }

  const filtered = employees.filter((e) =>
    `${e.first_name} ${e.last_name} ${e.nationalite || ''} ${e.ville || ''} ${e.genre || ''} ${e.position || ''} ${e.department || ''}`
      .toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title">
        <i className="bi bi-people"></i>
        <span>Employés</span>
        {canManage && (
          <Link to="/employees/new" className="btn btn-primary btn-sm ms-auto">
            <i className="bi bi-plus-lg me-1"></i>Ajouter
          </Link>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" className="form-control" placeholder="Rechercher un employé..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>#</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Nom</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Prénom</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Genre</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Nationalité</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Ville</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Email</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Téléphone</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Poste</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Département</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Agence</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Date embauche</th>
                <th style={{ color: '#1a1a1a', fontWeight: 700 }}>Salaire</th>
                {canManage && <th style={{ width: 160, color: '#1a1a1a', fontWeight: 700 }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => (
                <tr key={emp.id}>
                  <td style={{ color: '#1a1a1a', fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ fontWeight: 700, color: '#1a1a1a' }}>{emp.last_name}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.first_name}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.genre || <span className="text-muted">—</span>}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.nationalite || <span className="text-muted">—</span>}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.ville || <span className="text-muted">—</span>}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.email}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.phone || <span className="text-muted">—</span>}</td>
                  <td><span className="badge bg-primary-subtle" style={{ color: '#1a1a1a', fontWeight: 600 }}>{emp.position}</span></td>
                  <td style={{ color: '#1a1a1a' }}>{emp.department || <span className="text-muted">—</span>}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.agence || <span className="text-muted">—</span>}</td>
                  <td style={{ color: '#1a1a1a' }}>{emp.hire_date || <span className="text-muted">—</span>}</td>
                  <td style={{ color: '#1a1a1a', fontWeight: 600 }}>{emp.salary ? `${emp.salary} DH` : <span className="text-muted">—</span>}</td>
                  {canManage && (
                    <td>
                      <Link to={`/employees/${emp.id}/edit`} className="btn btn-sm btn-outline-warning me-1">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(emp.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={canManage ? 15 : 14} className="text-center text-muted py-4">Aucun employé trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
