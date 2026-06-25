import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EmployeeList from './pages/employees/EmployeeList'
import EmployeeForm from './pages/employees/EmployeeForm'
import AgentList from './pages/agents/AgentList'
import TemplateList from './pages/templates/TemplateList'
import TemplateForm from './pages/templates/TemplateForm'
import Generate from './pages/documents/Generate'
import History from './pages/documents/History'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agents" element={<ProtectedRoute route="/agents"><AgentList /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute route="/employees"><EmployeeList /></ProtectedRoute>} />
          <Route path="/employees/new" element={<ProtectedRoute route="/employees/new"><EmployeeForm /></ProtectedRoute>} />
          <Route path="/employees/:id/edit" element={<ProtectedRoute route="/employees/:id/edit"><EmployeeForm /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute route="/templates"><TemplateList /></ProtectedRoute>} />
          <Route path="/templates/new" element={<ProtectedRoute route="/templates/new"><TemplateForm /></ProtectedRoute>} />
          <Route path="/templates/:id/edit" element={<ProtectedRoute route="/templates/:id/edit"><TemplateForm /></ProtectedRoute>} />
          <Route path="/documents/generate" element={<ProtectedRoute route="/documents/generate"><Generate /></ProtectedRoute>} />
          <Route path="/documents/history" element={<ProtectedRoute route="/documents/history"><History /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute route="/settings"><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
