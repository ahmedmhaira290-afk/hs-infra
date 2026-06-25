import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { templateStore } from '../../services/store'
import { useAuth } from '../../context/AuthContext'
import { hasPermission, PERMISSIONS } from '../../config/permissions'

export default function TemplateList() {
  const { user } = useAuth()
  const canManage = hasPermission(user?.role, PERMISSIONS.MANAGE_TEMPLATES)
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    templateStore.list().then(setTemplates)
  }, [])

  const toggleActive = async (id, current) => {
    await templateStore.update(id, { is_active: !current })
    setTemplates(await templateStore.list())
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce modèle ?')) return
    await templateStore.remove(id)
    setTemplates(await templateStore.list())
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title">
        <i className="bi bi-file-earmark-text"></i>
        <span>Modèles de documents</span>
        {canManage && (
          <Link to="/templates/new" className="btn btn-primary btn-sm ms-auto">
            <i className="bi bi-plus-lg me-1"></i>Nouveau modèle
          </Link>
        )}
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Titre</th>
                <th>Type</th>
                <th>Statut</th>
                {canManage && <th style={{ width: 240 }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl, i) => (
                <tr key={tpl.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="fw-medium">{tpl.title}</td>
                  <td>{tpl.type}</td>
                  <td>
                    <span className={`badge ${tpl.is_active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                      {tpl.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  {canManage && (
                    <td>
                      <Link to={`/templates/${tpl.id}/edit`} className="btn btn-sm btn-outline-warning me-1">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button className="btn btn-sm btn-outline-info me-1" onClick={() => toggleActive(tpl.id, tpl.is_active)}
                        title={tpl.is_active ? 'Désactiver' : 'Activer'}>
                        <i className={`bi ${tpl.is_active ? 'bi-pause' : 'bi-play'}`}></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(tpl.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {templates.length === 0 && (
                <tr><td colSpan={canManage ? 5 : 4} className="text-center text-muted py-4">Aucun modèle trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
