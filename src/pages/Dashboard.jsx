import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { employeeStore, templateStore, documentStore } from '../services/store'
import { hasPermission, PERMISSIONS } from '../config/permissions'
import { useNavigate } from 'react-router-dom'


const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const statCards = [
  { key: 'employees', label: 'Employés', icon: 'bi-people-fill', gradient: 'linear-gradient(135deg, #0f2b4a, #1a4a7a)' },
  { key: 'templates', label: 'Modèles actifs', icon: 'bi-file-earmark-richtext-fill', gradient: 'linear-gradient(135deg, #0f973d, #1ab85a)' },
  { key: 'documents', label: 'Documents générés', icon: 'bi-file-earmark-check-fill', gradient: 'linear-gradient(135deg, #0b6bcb, #2d8bf0)' },
  { key: 'month', label: 'Ce mois-ci', icon: 'bi-calendar-check-fill', gradient: 'linear-gradient(135deg, #b76e00, #e68a00)' },
]

const quickActions = [
  { label: 'Nouvel employé', icon: 'bi-person-plus-fill', route: '/employees/new', color: '#0f2b4a', perm: PERMISSIONS.MANAGE_USERS },
  { label: 'Gérer les agents', icon: 'bi-person-badge-fill', route: '/agents', color: '#6f42c1', perm: PERMISSIONS.MANAGE_USERS },
  { label: 'Générer attestation', icon: 'bi-file-earmark-plus-fill', route: '/documents/generate', color: '#0f973d', perm: PERMISSIONS.GENERATE_DOCUMENTS },
  { label: 'Voir les employés', icon: 'bi-people-fill', route: '/employees', color: '#0b6bcb', perm: PERMISSIONS.VIEW_EMPLOYEES },
  { label: 'Historique', icon: 'bi-clock-history', route: '/documents/history', color: '#b76e00', perm: PERMISSIONS.VIEW_HISTORY },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { t, societe } = useSettings()
  const navigate = useNavigate()
  const [data, setData] = useState({ stats: {}, recent: [], deptData: [], trendData: [] })


  useEffect(() => {
    Promise.all([employeeStore.list(), templateStore.list(true), documentStore.list()])
      .then(([emps, tpls, docs]) => {
        const now = new Date()
        const stats = {
          employees: emps.length,
          templates: tpls.length,
          documents: docs.length,
          month: docs.filter((d) => {
            const dd = new Date(d.created_at)
            return dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear()
          }).length,
        }
        const deptMap = {}
        emps.forEach((e) => { const d = e.department || 'Non défini'; deptMap[d] = (deptMap[d] || 0) + 1 })
        const deptData = Object.entries(deptMap).sort((a, b) => b[1] - a[1])
        const maxDept = deptData.length ? Math.max(...deptData.map((d) => d[1])) : 1
        const trendData = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const count = docs.filter((doc) => {
            const dd = new Date(doc.created_at)
            return dd.getMonth() === d.getMonth() && dd.getFullYear() === d.getFullYear()
          }).length
          trendData.push({ label: `${months[d.getMonth()]} ${d.getFullYear()}`, count })
        }
        const maxTrend = trendData.length ? Math.max(...trendData.map((t) => t.count), 1) : 1
        setData({ stats, recent: docs.slice(-5).reverse(), deptData, trendData, maxDept, maxTrend })
      })
  }, [])

  const { stats, recent, deptData, trendData, maxDept, maxTrend } = data

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner d-flex align-items-center justify-content-between">
        <div>
          <h5><i className="bi bi-hand-wave me-2"></i>Bienvenue M. {user?.first_name}</h5>
          <small>Vous êtes connecté en tant que <strong>{user?.role === 'responsable' ? 'Responsable RH' : 'Agent'}</strong></small>
        </div>
        <div className="text-end d-none d-md-block">
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, opacity: 0.9 }}>{societe?.raisonSociale || 'HS-INFRA'}</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(({ key, label, icon, gradient }) => (
          <div className="col-sm-6 col-xl-3" key={key}>
            <div className="card stat-card h-100 border-0" style={{ background: gradient, color: '#fff' }}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center"
                  style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', fontSize: '1.5rem' }}>
                  <i className={`bi ${icon}`}></i>
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '1.6rem', lineHeight: 1.1 }}>{stats[key]}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: 500 }}>{label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {/* Department Distribution */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center gap-2">
              <i className="bi bi-diagram-3-fill" style={{ color: 'var(--accent)' }}></i>
              Répartition par département
            </div>
            <div className="card-body">
              {deptData.length > 0 ? deptData.map(([dept, count]) => (
                <div key={dept} className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                    <span className="fw-medium">{dept}</span>
                    <span className="text-muted">{count}</span>
                  </div>
                  <div className="progress" style={{ height: 8, borderRadius: 4, background: 'var(--border-color)' }}>
                    <div className="progress-bar" style={{ width: `${(count / maxDept) * 100}%`, background: 'linear-gradient(90deg, #2d7dd2, #4a9eff)', borderRadius: 4 }}></div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted py-4 small">Aucun employé</div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center gap-2">
              <i className="bi bi-graph-up-arrow" style={{ color: 'var(--accent)' }}></i>
              Documents générés (6 mois)
            </div>
            <div className="card-body d-flex align-items-end gap-2" style={{ minHeight: 200 }}>
              {trendData.map(({ label, count }) => (
                <div key={label} className="flex-fill d-flex flex-column align-items-center" style={{ height: '100%' }}>
                  <div className="flex-grow-1 d-flex align-items-end" style={{ width: '100%' }}>
                    <div className="w-100" style={{
                      height: `${(count / maxTrend) * 100}%`,
                      minHeight: count > 0 ? 16 : 0,
                      background: 'linear-gradient(180deg, #2d7dd2, #4a9eff)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.5s ease',
                    }}></div>
                  </div>
                  <div style={{
                    width: '100%', textAlign: 'center', fontSize: '0.65rem',
                    color: 'var(--text-muted)', marginTop: 4, whiteSpace: 'nowrap'
                  }}>
                    {count > 0 && <div className="fw-bold" style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>{count}</div>}
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center gap-2">
              <i className="bi bi-lightning-fill" style={{ color: 'var(--accent)' }}></i>
              Actions rapides
            </div>
            <div className="card-body d-flex flex-column gap-2">
              {quickActions
                .filter((a) => !a.perm || hasPermission(user?.role, a.perm))
                .map(({ label, icon, route, color }) => (
                  <button key={route} className="btn d-flex align-items-center gap-3 w-100 text-start"
                    style={{ borderRadius: 10, padding: '0.7rem 1rem', border: '1.5px solid var(--border-color)', background: 'var(--card-bg)' }}
                    onClick={() => navigate(route)}>
                    <div className="d-flex align-items-center justify-content-center"
                      style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, color, fontSize: '1.15rem' }}>
                      <i className={`bi ${icon}`}></i>
                    </div>
                    <span className="fw-medium" style={{ fontSize: '0.88rem' }}>{label}</span>
                    <i className="bi bi-chevron-right ms-auto" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}></i>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="card">
        <div className="card-header d-flex align-items-center gap-2">
          <i className="bi bi-clock-history" style={{ color: 'var(--accent)' }}></i>
          Documents récents
        </div>
        <div className="card-body p-0">
          {recent.length > 0 ? (
            <div className="list-group list-group-flush">
              {recent.map((doc, i) => (
                <div key={doc.id} className="list-group-item d-flex align-items-center gap-3"
                  style={{ borderLeft: `3px solid ${['#2d7dd2', '#0f973d', '#b76e00', '#dc3545', '#6f42c1'][i % 5]}`, background: 'var(--card-bg)' }}>
                  <div className="d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--body-bg)', fontSize: '1.1rem' }}>
                    <i className="bi bi-file-earmark-text" style={{ color: 'var(--accent)' }}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium" style={{ fontSize: '0.88rem' }}>{doc.reference}</div>
                    <div className="d-flex gap-3" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span><i className="bi bi-person me-1"></i>{doc.employee_name}</span>
                      <span><i className="bi bi-file-earmark me-1"></i>{doc.document_type}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-medium" style={{ fontSize: '0.78rem' }}>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</div>
                    <small className="text-muted">{new Date(doc.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4 small">Aucun document généré récemment</div>
          )}
        </div>
      </div>
    </div>
  )
}
