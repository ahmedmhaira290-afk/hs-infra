import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()

  const unread = notifications.filter((n) => !n.read_at).length

  useEffect(() => {
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function load() {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch { /* backend offline */ }
  }

  async function markRead(id) {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      )
    } catch { /* fallback */ }
  }

  async function markAllRead() {
    try {
      await api.put('/notifications/read-all')
      setNotifications((prev) =>
        prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() }))
      )
    } catch { /* fallback */ }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn btn-sm position-relative"
        style={{ color: '#adb5bd', fontSize: '1.2rem' }}
        onClick={() => setOpen(!open)}
        title="Notifications"
      >
        <i className="bi bi-bell"></i>
        {unread > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', right: 0, zIndex: 1050,
            width: '320px', maxHeight: '400px', overflowY: 'auto',
            background: '#1a2332', border: '1px solid #2a3a4e',
            borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ borderBottom: '1px solid #2a3a4e' }}>
            <strong style={{ color: '#e9ecef', fontSize: '0.85rem' }}>Notifications</strong>
            {unread > 0 && (
              <button className="btn btn-link btn-sm p-0" style={{ color: '#6ea8fe', fontSize: '0.75rem', textDecoration: 'none' }} onClick={markAllRead}>
                Tout marquer lu
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-3" style={{ color: '#6c757d', fontSize: '0.8rem' }}>
              Aucune notification
            </div>
          )}

          {notifications.map((n) => {
            const isUnread = !n.read_at
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: '0.8rem',
                  borderBottom: '1px solid #2a3a4e',
                  background: isUnread ? '#1e2a3a' : '#161e2b',
                  color: isUnread ? '#f8f9fa' : '#8b95a5',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#243247'}
                onMouseLeave={(e) => e.currentTarget.style.background = isUnread ? '#1e2a3a' : '#161e2b'}
              >
                <div className="d-flex align-items-start gap-2">
                  <i className={`bi bi-${isUnread ? 'bell-fill' : 'bell'} mt-1`} style={{ color: isUnread ? '#ffc107' : '#6c757d', fontSize: '0.75rem' }}></i>
                  <div>
                    <div style={{ lineHeight: 1.4 }}>{n.message}</div>
                    <small style={{ color: '#6c757d', fontSize: '0.65rem' }}>
                      {new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
