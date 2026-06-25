import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { checkBackend } from '../services/api'

const AuthContext = createContext(null)

function getUsers() {
  return JSON.parse(localStorage.getItem('registered_users') || '[]')
}

function saveUsers(users) {
  localStorage.setItem('registered_users', JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    if (!saved) return null
    const parsed = JSON.parse(saved)
    const users = getUsers()
    const exists = users.find((u) => u.id === parsed.id)
    if (!exists) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }
    return parsed
  })
  const navigate = useNavigate()

  checkBackend()

  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password })
      const { token, user: userData } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      navigate('/dashboard')
      return
    } catch (err) {
      if (err.response) throw new Error(err.response.data?.error || 'Email ou mot de passe incorrect')
    }
    const users = getUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) {
      throw new Error(users.length === 0 ? 'Aucun compte trouvé. Créez un compte d\'abord.' : 'Email ou mot de passe incorrect')
    }
    const userData = { id: found.id, name: found.name, email: found.email, role: found.role }
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    navigate('/dashboard')
  }

  const register = async (formData) => {
    try {
      const res = await api.post('/register', formData)
      const { token, user: userData } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      navigate('/dashboard')
      return
    } catch (err) {
      if (err.response) throw new Error(err.response.data?.error || 'Erreur lors de l\'inscription')
    }
    let users = getUsers()
    const exists = users.find((u) => u.email === formData.email)
    if (exists) throw new Error('Cet email est déjà utilisé')
    const newUser = {
      id: Date.now(), name: formData.name, email: formData.email,
      password: formData.password, role: formData.role || 'agent',
    }
    users.push(newUser)
    saveUsers(users)
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    navigate('/dashboard')
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {
      // fallback
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const listUsers = async () => {
    try {
      const res = await api.get('/users')
      return res.data
    } catch {
      return getUsers()
    }
  }

  const createUser = async (formData) => {
    try {
      await api.post('/register', formData)
    } catch {
      let users = getUsers()
      const exists = users.find((u) => u.email === formData.email)
      if (exists) throw new Error('Cet email est déjà utilisé')
      users.push({
        id: Date.now(), name: formData.name, email: formData.email, phone: formData.phone || '',
        password: formData.password, role: formData.role || 'agent',
      })
      saveUsers(users)
    }
  }

  const updateUser = async (id, formData) => {
    try {
      await api.put(`/users/${id}`, formData)
    } catch {
      let users = getUsers()
      const idx = users.findIndex((u) => u.id === Number(id))
      if (idx === -1) throw new Error('Utilisateur introuvable')
      if (formData.role === 'responsable') {
        users = users.filter((u) => u.role !== 'responsable' || u.id === Number(id))
      }
      users[idx] = { ...users[idx], ...formData }
      saveUsers(users)
    }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`)
    } catch {
      const users = getUsers()
      const target = users.find((u) => u.id === Number(id))
      if (!target) throw new Error('Utilisateur introuvable')
      saveUsers(users.filter((u) => u.id !== Number(id)))
    }
  }

  return (
    <AuthContext.Provider value={{
      user, login, register, logout,
      getUsers, listUsers, createUser, updateUser, deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
