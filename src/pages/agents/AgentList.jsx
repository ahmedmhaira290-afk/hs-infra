import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AgentList() {
  const { listUsers, createUser, updateUser, deleteUser } = useAuth()
  const [agents, setAgents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'agent' })
  const [error, setError] = useState('')

  const loadAgents = async () => {
    const users = await listUsers()
    setAgents(users.filter((u) => u.role === 'agent'))
  }

  useEffect(() => { loadAgents() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', password: '', role: 'agent' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (agent) => {
    setEditing(agent)
    setForm({ name: agent.name, email: agent.email, phone: agent.phone || '', password: '', role: agent.role })
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        const data = { name: form.name, email: form.email, phone: form.phone, role: form.role }
        if (form.password) data.password = form.password
        await updateUser(editing.id, data)
      } else {
        if (!form.password) { setError('Mot de passe requis'); return }
        await createUser(form)
      }
      setShowForm(false)
      loadAgents()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (agent) => {
    if (!confirm(`Supprimer l'agent ${agent.name} ?`)) return
    try {
      await deleteUser(agent.id)
      loadAgents()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title">
        <i className="bi bi-person-badge"></i>
        <span>Gestion des agents</span>
        <button className="btn btn-primary btn-sm ms-auto" onClick={openNew}>
          <i className="bi bi-plus-lg me-1"></i>Nouvel agent
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3">{editing ? 'Modifier' : 'Ajouter'} un agent</h6>
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small">
                <i className="bi bi-exclamation-circle"></i><span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nom complet</label>
                  <input type="text" className="form-control" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Téléphone</label>
                  <input type="text" className="form-control" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06XXXXXXXX" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">{editing ? 'Nouveau mot de passe (laisser vide)' : 'Mot de passe'}</label>
                  <input type="password" className="form-control" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editing} />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  <i className={`bi ${editing ? 'bi-check-lg' : 'bi-plus-lg'} me-1`}></i>
                  {editing ? 'Enregistrer' : 'Créer'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                  <i className="bi bi-x-lg me-1"></i>Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => (
                <tr key={agent.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="fw-medium">{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{agent.phone || '-'}</td>
                  <td><span className="badge bg-secondary-subtle text-secondary">Agent RH</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-warning me-1" onClick={() => openEdit(agent)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(agent)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr><td colSpan="6" className="text-center text-muted py-4">Aucun agent trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
