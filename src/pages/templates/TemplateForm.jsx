import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { templateStore } from '../../services/store'

export default function TemplateForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', type: '', content: '', is_active: true,
  })
  const [existingTypes, setExistingTypes] = useState([])
  const [showCustomType, setShowCustomType] = useState(false)

  useEffect(() => {
    templateStore.list().then((tpls) => {
      const types = [...new Set(tpls.map((t) => t.type).filter(Boolean))]
      setExistingTypes(types)
    })
    if (isEdit) {
      templateStore.get(id).then((data) => {
        if (data) {
          setForm(data)
          if (!['Attestation de travail', 'Attestation de salaire', 'Certificat de travail', "Demande d'avance sur salaire", 'Demande de prime', "Attestation de domiciliation irrévocable de salaire"].includes(data.type)) {
            setShowCustomType(true)
          }
        }
        else navigate('/templates')
      })
    }
  }, [id])

  const predefinedTypes = [
    'Attestation de travail',
    'Attestation de salaire',
    'Certificat de travail',
    "Demande d'avance sur salaire",
    'Demande de prime',
    'Attestation de domiciliation irrévocable de salaire',
  ]

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) await templateStore.update(id, form)
      else await templateStore.create(form)
      navigate('/templates')
    } catch (err) {
      alert("Erreur : " + (err.message || 'Inconnue'))
    }
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 page-title">
        <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-file-earmark-plus'}`}></i>
        <span>{isEdit ? 'Modifier' : 'Nouveau'} modèle</span>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Titre</label>
                <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Type</label>
                {showCustomType ? (
                  <input type="text" name="type" className="form-control" value={form.type}
                    onChange={handleChange} list="typeSuggestions" required placeholder="Saisir un type..." />
                ) : (
                  <select name="type" className="form-select" value={form.type} onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setShowCustomType(true)
                      setForm({ ...form, type: '' })
                    } else {
                      setForm({ ...form, type: e.target.value })
                    }
                  }} required>
                    <option value="">Sélectionner...</option>
                    {predefinedTypes.map((t) => <option key={t}>{t}</option>)}
                    <option value="__custom__">Autre (saisir libre)...</option>
                  </select>
                )}
                {showCustomType && (
                  <button type="button" className="btn btn-sm btn-link p-0 mt-1"
                    onClick={() => { setShowCustomType(false); setForm({ ...form, type: '' }) }}>
                    Retour à la liste
                  </button>
                )}
                <datalist id="typeSuggestions">
                  {existingTypes.map((t) => <option key={t} value={t} />)}
                </datalist>
              </div>
              <div className="col-12">
                <label className="form-label">
                  Contenu <small className="text-muted">(utilisez {'{{variable}}'} pour les champs dynamiques)</small>
                </label>
                <textarea name="content" className="form-control" rows="10" value={form.content} onChange={handleChange} required></textarea>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" name="is_active" className="form-check-input" checked={form.is_active} onChange={handleChange} id="isActive" />
                  <label className="form-check-label small" htmlFor="isActive">Modèle actif</label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4 pt-2 border-top">
              <button type="submit" className="btn btn-primary">
                <i className={`bi ${isEdit ? 'bi-check-lg' : 'bi-plus-lg'} me-1`}></i>
                {isEdit ? 'Enregistrer' : 'Créer'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/templates')}>
                <i className="bi bi-x-lg me-1"></i>Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
