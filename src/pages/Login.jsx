import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      await login(form.email, form.password)
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="card-header">
          <div className="brand-logo">
            <img src="/images/hs-infra-logo.svg" alt="HS INFRA" style={{width: 200, height: 'auto'}} />
          </div>
          <p className="mt-2">Système de Gestion RH</p>
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
              <label className="form-label">Email professionnel</label>
              <div className="input-group">
                <i className="bi bi-envelope input-icon"></i>
                <input type="email" className="form-control" placeholder="vous@entreprise.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Mot de passe</label>
              <div className="input-group">
                <i className="bi bi-lock input-icon"></i>
                <input type="password" className="form-control" placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-box-arrow-in-right me-2"></i>Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
