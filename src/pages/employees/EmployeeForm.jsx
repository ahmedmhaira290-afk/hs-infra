import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { employeeStore } from '../../services/store'

export default function EmployeeForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', civilite: 'M.', email: '', phone: '',
    genre: '', nationalite: 'Marocaine', ville: '',
    birth_date: '', birth_place: '',
    position: '', department: '', agence: '', hire_date: '', salary: '',
  })

  useEffect(() => {
    if (isEdit) {
      employeeStore.get(id).then((data) => {
        if (data) setForm(data)
        else navigate('/employees')
      })
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) await employeeStore.update(id, form)
      else await employeeStore.create(form)
      navigate('/employees')
    } catch (err) {
      alert("Erreur : " + (err.message || 'Inconnue'))
    }
  }

  const personalFields = [
    { name: 'last_name', label: 'Nom', type: 'text' },
    { name: 'first_name', label: 'Prénom', type: 'text' },
    { name: 'civilite', label: 'Civilité', type: 'select', options: ['M.', 'Mme'] },
    { name: 'genre', label: 'Genre', type: 'select', options: ['Masculin', 'Féminin'] },
    { name: 'nationalite', label: 'Nationalité', type: 'text' },
    { name: 'ville', label: 'Ville', type: 'text' },
    { name: 'birth_date', label: 'Date de naissance', type: 'date' },
    { name: 'birth_place', label: 'Lieu de naissance', type: 'text' },
    { name: 'cin', label: 'CIN', type: 'text' },
    { name: 'cnss', label: 'CNSS', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Téléphone', type: 'text' },
    { name: 'bank_type', label: 'Type de banque', type: 'text' },
    { name: 'rib', label: 'RIB', type: 'text' },
  ]
  const professionalFields = [
    { name: 'position', label: 'Poste', type: 'text' },
    { name: 'department', label: 'Département', type: 'text' },
    { name: 'agence', label: 'Agence', type: 'text' },
    { name: 'hire_date', label: "Date d'embauche", type: 'date' },
    { name: 'salary', label: 'Salaire (DH)', type: 'number' },
    { name: 'bank_type_pro', label: 'Type de banque (Pro)', type: 'text' },
    { name: 'rib_pro', label: 'RIB (Pro)', type: 'text' },
  ]

  const labelStyle = { color: '#1a1a1a', fontWeight: 600, fontSize: '0.9rem' }

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title">
        <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-person-plus'}`}></i>
        <span>{isEdit ? 'Modifier' : 'Ajouter'} un employé</span>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h6 className="mb-3" style={{ color: '#1a1a1a', fontWeight: 700, borderBottom: '2px solid #1a1a1a', paddingBottom: 6 }}>
              <i className="bi bi-person me-2"></i>Informations personnelles
            </h6>
            <div className="row g-3 mb-4">
              {personalFields.map(({ name, label, type, options }) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label" style={labelStyle}>{label}</label>
                  {type === 'select' ? (
                    <select name={name} className="form-control" value={form[name] || ''} onChange={handleChange} required style={{ paddingLeft: '0.75rem' }}>
                      <option value="">Sélectionner...</option>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type} name={name} className="form-control"
                      value={form[name] || ''} onChange={handleChange} required />
                  )}
                </div>
              ))}
            </div>
            <h6 className="mb-3" style={{ color: '#1a1a1a', fontWeight: 700, borderBottom: '2px solid #1a1a1a', paddingBottom: 6 }}>
              <i className="bi bi-briefcase me-2"></i>Informations professionnelles
            </h6>
            <div className="row g-3">
              {professionalFields.map(({ name, label, type }) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label" style={labelStyle}>{label}</label>
                  <input type={type} name={name} className="form-control"
                    value={form[name] || ''} onChange={handleChange} required />
                </div>
              ))}
            </div>
            <div className="d-flex gap-2 mt-4 pt-2 border-top">
              <button type="submit" className="btn btn-primary">
                <i className={`bi ${isEdit ? 'bi-check-lg' : 'bi-plus-lg'} me-1`}></i>
                {isEdit ? 'Enregistrer' : 'Ajouter'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/employees')}>
                <i className="bi bi-x-lg me-1"></i>Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
