import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { hasPermission, PERMISSIONS } from '../config/permissions'
import api from '../services/api'

const allNavItems = [
  { to: '/dashboard', labelKey: 'dashboard', icon: 'bi-speedometer2', perm: null },
  { to: '/employees', labelKey: 'employees', icon: 'bi-people', perm: PERMISSIONS.VIEW_EMPLOYEES },
  { to: '/templates', labelKey: 'templates', icon: 'bi-file-earmark-text', perm: PERMISSIONS.VIEW_TEMPLATES },
  { to: '/agents', labelKey: 'agents', icon: 'bi-person-badge', perm: PERMISSIONS.MANAGE_USERS },
  { to: '/documents/generate', labelKey: 'generate', icon: 'bi-file-earmark-plus', perm: PERMISSIONS.GENERATE_DOCUMENTS },
  { to: '/documents/history', labelKey: 'history', icon: 'bi-clock-history', perm: PERMISSIONS.VIEW_HISTORY },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { t, societe } = useSettings()
  const [dbLoading, setDbLoading] = useState(false)

  const navItems = allNavItems.filter(
    (item) => !item.perm || hasPermission(user?.role, item.perm)
  )

  const openDB = async () => {
    setDbLoading(true)
    try { await api.get('/open-db') } catch {}
    setDbLoading(false)
  }

  return (
    <div className="d-flex vh-100">
      <nav className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo"><i className="bi bi-buildings"></i></div>
          <h5>{societe?.raisonSociale || 'HS-INFRA'} RH</h5>
          <small>Gestion des documents</small>
        </div>
        <ul className="nav flex-column">
              {navItems.map(({ to, labelKey, icon }) => (
            <li className="nav-item" key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className={`bi ${icon}`}></i>
                {t('nav', labelKey)}
              </NavLink>
            </li>
          ))}
          {hasPermission(user?.role, PERMISSIONS.MANAGE_SETTINGS) && (
            <li className="nav-item mt-auto">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <i className="bi bi-gear"></i>
                {t('nav', 'settings')}
              </NavLink>
            </li>
          )}

        </ul>
        <div className="sidebar-footer">
          <div className="d-flex align-items-center justify-content-between w-100 mb-1">
            <small>
              <i className="bi bi-person-circle me-1"></i>
              {user?.name} · {user?.role === 'responsable' ? 'Responsable RH' : 'Agent RH'}
            </small>
          </div>
          <button className="btn btn-outline-light btn-sm w-100" onClick={logout}>
            <i className="bi bi-box-arrow-left me-1"></i> Déconnexion
          </button>
        </div>
      </nav>
      <main className="flex-grow-1 p-4 overflow-auto">
        <div className="fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
