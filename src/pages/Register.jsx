import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', role: 'agent',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    try {
      setError('')
      await register(form)
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="card-header">
          <div className="brand-logo">
            <img src="/images/hs-infra-logo.svg" alt="HS INFRA" style={{width: 200, height: 'auto'}} />
          </div>
          <p className="mt-2">Création de compte</p>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small">
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom complet</label>
              <div className="input-group">
                <i className="bi bi-person input-icon"></i>
                <input type="text" name="name" className="form-control" placeholder="Nom et prénom"
                  value={form.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Email professionnel</label>
              <div className="input-group">
                <i className="bi bi-envelope input-icon"></i>
                <input type="email" name="email" className="form-control" placeholder="email@entreprise.com"
                  value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Mot de passe</label>
                <div className="input-group">
                  <i className="bi bi-lock input-icon"></i>
                  <input type="password" name="password" className="form-control" placeholder="••••••••"
                    value={form.password} onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirmer</label>
                <div className="input-group">
                  <i className="bi bi-lock-fill input-icon"></i>
                  <input type="password" name="password_confirmation" className="form-control" placeholder="••••••••"
                    value={form.password_confirmation} onChange={handleChange} required />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Rôle</label>
              <div className="input-group">
                <i className="bi bi-person-badge input-icon"></i>
                <select name="role" className="form-control" value={form.role}
                  onChange={handleChange} style={{ paddingLeft: '2.6rem' }}>
                  <option value="agent">Agent RH</option>
                  <option value="responsable">Responsable RH</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-plus-circle me-2"></i>Créer mon compte
            </button>
          </form>
          <div className="auth-divider">
            <span>OU</span>
          </div>
          <p className="text-center mb-0 small">
            Déjà un compte ?{' '}
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
