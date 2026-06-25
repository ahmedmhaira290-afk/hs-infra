import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'

const tabs = [
  { key: 'societe', icon: 'bi-building', labelKey: 'societe' },
  { key: 'rhManager', icon: 'bi-person-badge', labelKey: 'rhManager' },
  { key: 'document', icon: 'bi-file-earmark-text', labelKey: 'document' },
  { key: 'employe', icon: 'bi-people', labelKey: 'employe' },
  { key: 'notification', icon: 'bi-bell', labelKey: 'notification' },
  { key: 'appearance', icon: 'bi-palette', labelKey: 'appearance' },
]

export default function Settings() {
  const {
    societe, rhManager, document: doc, employe, notification, theme, lang,
    update, updateNested, reset, t, THEMES, LANGUAGES,
  } = useSettings()

  const [activeTab, setActiveTab] = useState('societe')
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (confirmReset) { reset(); setConfirmReset(false) }
    else setConfirmReset(true)
  }

  const renderField = (label, value, onChange, opts = {}) => {
    const { type = 'text', options, small } = opts
    const id = label.replace(/\s+/g, '')
    return (
      <div className={small ? 'col-md-4 col-sm-6' : 'col-md-6 col-sm-6'} style={opts.style}>
        <label className="form-label small" htmlFor={id} style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</label>
        {type === 'select' ? (
          <select id={id} className="form-select" value={value} onChange={onChange}>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : type === 'color' ? (
          <div className="d-flex align-items-center gap-2">
            <input id={id} type="color" className="form-control form-control-color"
              style={{ width: 44, padding: 2, height: 36, borderRadius: 8 }} value={value} onChange={onChange} />
            <span className="small text-muted" style={{ fontFamily: 'monospace' }}>{value}</span>
          </div>
        ) : type === 'checkbox' ? (
          <div className="form-check form-switch mt-1">
            <input id={id} className="form-check-input" type="checkbox" checked={value} onChange={onChange}
              style={{ cursor: 'pointer' }} />
          </div>
        ) : type === 'textarea' ? (
          <textarea id={id} className="form-control" value={value} onChange={onChange} rows={2} />
        ) : (
          <input id={id} type={type} className="form-control" value={value} onChange={onChange} />
        )}
      </div>
    )
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'societe':
        return (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-building" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}></i>
              <div>
                <h6 className="mb-0" style={{ fontWeight: 700 }}>{t('settings', 'societe')}</h6>
                <small className="text-muted">{t('settings', 'infoSociete')}</small>
              </div>
            </div>
            <div className="row g-3">
              {renderField(t('settings', 'raisonSociale'), societe.raisonSociale, (e) => updateNested('societe', 'raisonSociale', e.target.value))}
              {renderField(t('settings', 'sigle'), societe.sigle, (e) => updateNested('societe', 'sigle', e.target.value))}
              {renderField(t('settings', 'formeJuridique'), societe.formeJuridique, (e) => updateNested('societe', 'formeJuridique', e.target.value))}
              {renderField(t('settings', 'ice'), societe.ice, (e) => updateNested('societe', 'ice', e.target.value))}
              {renderField(t('settings', 'rc'), societe.rc, (e) => updateNested('societe', 'rc', e.target.value))}
              {renderField(t('settings', 'if'), societe.if, (e) => updateNested('societe', 'if', e.target.value))}
              {renderField(t('settings', 'cnss'), societe.cnss, (e) => updateNested('societe', 'cnss', e.target.value))}
              {renderField(t('settings', 'patente'), societe.patente, (e) => updateNested('societe', 'patente', e.target.value))}
              {renderField(t('settings', 'adresse'), societe.adresse, (e) => updateNested('societe', 'adresse', e.target.value))}
              {renderField(t('settings', 'ville'), societe.ville, (e) => updateNested('societe', 'ville', e.target.value))}
              {renderField(t('settings', 'telephone'), societe.telephone, (e) => updateNested('societe', 'telephone', e.target.value))}
              {renderField(t('settings', 'email'), societe.email, (e) => updateNested('societe', 'email', e.target.value))}
              {renderField(t('settings', 'siteWeb'), societe.siteWeb, (e) => updateNested('societe', 'siteWeb', e.target.value))}
            </div>
          </div>
        )
      case 'rhManager':
        return (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-person-badge" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}></i>
              <div>
                <h6 className="mb-0" style={{ fontWeight: 700 }}>{t('settings', 'rhManager')}</h6>
                <small className="text-muted">{t('settings', 'infoRH')}</small>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-4 col-sm-6">
                <label className="form-label small" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{t('settings', 'civilite')}</label>
                <div className="d-flex gap-1">
                  {['M.', 'Mme', 'Dr', 'Pr'].map((c) => (
                    <button key={c}
                      className={`btn btn-sm flex-fill ${rhManager.civilite === c ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => updateNested('rhManager', 'civilite', c)}>{c}</button>
                  ))}
                </div>
              </div>
              {renderField(t('settings', 'nomComplet'), rhManager.nom, (e) => updateNested('rhManager', 'nom', e.target.value))}
              {renderField(t('settings', 'dateNaissance'), rhManager.dateNaissance, (e) => updateNested('rhManager', 'dateNaissance', e.target.value))}
              {renderField(t('settings', 'lieuNaissance'), rhManager.lieuNaissance, (e) => updateNested('rhManager', 'lieuNaissance', e.target.value))}
              {renderField(t('settings', 'fonction'), rhManager.fonction, (e) => updateNested('rhManager', 'fonction', e.target.value))}
              {renderField(t('settings', 'telephone'), rhManager.telephone, (e) => updateNested('rhManager', 'telephone', e.target.value))}
              {renderField(t('settings', 'email'), rhManager.email, (e) => updateNested('rhManager', 'email', e.target.value), { type: 'email' })}
            </div>
          </div>
        )
      case 'document':
        return (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-file-earmark-text" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}></i>
              <div>
                <h6 className="mb-0" style={{ fontWeight: 700 }}>{t('settings', 'document')}</h6>
                <small className="text-muted">{t('settings', 'infoDocument')}</small>
              </div>
            </div>
            <div className="row g-3">
              {renderField(t('settings', 'refNumber'), doc.numeroReference, (e) => updateNested('document', 'numeroReference', e.target.value))}
              {renderField(t('settings', 'langueDoc'), doc.langueDefaut, (e) => updateNested('document', 'langueDefaut', e.target.value), { type: 'select', options: ['fr', 'en', 'ar'] })}
              {renderField(t('settings', 'papier'), doc.formatPapier, (e) => updateNested('document', 'formatPapier', e.target.value), { type: 'select', options: ['A4', 'A3', 'Letter', 'Legal'] })}
              {renderField(t('settings', 'police'), doc.police, (e) => updateNested('document', 'police', e.target.value), { type: 'select', options: ['Calibri', 'Arial', 'Times New Roman', 'Segoe UI', 'Tahoma'] })}
              {renderField(t('settings', 'taillePolice'), doc.taillePolice, (e) => updateNested('document', 'taillePolice', e.target.value), { type: 'select', options: ['9', '10', '11', '12', '14'], small: true })}
              {renderField(t('settings', 'interligne'), doc.interligne, (e) => updateNested('document', 'interligne', e.target.value), { type: 'select', options: ['1', '1.15', '1.5', '2'], small: true })}
              <div className="w-100"></div>
              <h6 className="col-12" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>Marges (mm)</h6>
              {renderField(t('settings', 'margeHaut'), doc.margesHaut, (e) => updateNested('document', 'margesHaut', e.target.value), { type: 'number', small: true })}
              {renderField(t('settings', 'margeBas'), doc.margesBas, (e) => updateNested('document', 'margesBas', e.target.value), { type: 'number', small: true })}
              {renderField(t('settings', 'margeGauche'), doc.margesGauche, (e) => updateNested('document', 'margesGauche', e.target.value), { type: 'number', small: true })}
              {renderField(t('settings', 'margeDroite'), doc.margesDroite, (e) => updateNested('document', 'margesDroite', e.target.value), { type: 'number', small: true })}
              <div className="w-100"></div>
              <h6 className="col-12" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>Affichage</h6>
              {renderField(t('settings', 'afficherLogo'), doc.afficherLogo, (e) => updateNested('document', 'afficherLogo', e.target.checked), { type: 'checkbox' })}
              {renderField(t('settings', 'afficherEnTete'), doc.afficherEnTete, (e) => updateNested('document', 'afficherEnTete', e.target.checked), { type: 'checkbox' })}
              {renderField(t('settings', 'afficherPiedPage'), doc.afficherPiedPage, (e) => updateNested('document', 'afficherPiedPage', e.target.checked), { type: 'checkbox' })}
              {renderField(t('settings', 'textePiedPage'), doc.textePiedPage, (e) => updateNested('document', 'textePiedPage', e.target.value), { type: 'textarea' })}
              {renderField(t('settings', 'texteSignature'), doc.texteSignature, (e) => updateNested('document', 'texteSignature', e.target.value))}
              {renderField(t('settings', 'couleurPrincipale'), doc.couleurPrincipale, (e) => updateNested('document', 'couleurPrincipale', e.target.value), { type: 'color' })}
            </div>
          </div>
        )
      case 'employe':
        return (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-people" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}></i>
              <div>
                <h6 className="mb-0" style={{ fontWeight: 700 }}>{t('settings', 'employe')}</h6>
                <small className="text-muted">{t('settings', 'infoEmploye')}</small>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{t('settings', 'typesContrat')}</label>
                <input type="text" className="form-control" value={employe.typesContrat.join(', ')}
                  onChange={(e) => updateNested('employe', 'typesContrat', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="CDI, CDD, Stage, Freelance, Intérim" />
                <small className="text-muted" style={{ fontSize: '0.7rem', marginTop: 2, display: 'block' }}>Séparés par des virgules</small>
              </div>
              {renderField(t('settings', 'defaultContrat'), employe.defaultContrat, (e) => updateNested('employe', 'defaultContrat', e.target.value), { type: 'select', options: employe.typesContrat })}
              {renderField(t('settings', 'saisieAuto'), employe.saisieAuto, (e) => updateNested('employe', 'saisieAuto', e.target.checked), { type: 'checkbox' })}
            </div>
          </div>
        )
      case 'notification':
        return (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-bell" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}></i>
              <div>
                <h6 className="mb-0" style={{ fontWeight: 700 }}>{t('settings', 'notification')}</h6>
                <small className="text-muted">{t('settings', 'infoNotification')}</small>
              </div>
            </div>
            <div className="row g-3">
              {renderField(t('settings', 'emailConfirmation'), notification.emailConfirmation, (e) => updateNested('notification', 'emailConfirmation', e.target.checked), { type: 'checkbox' })}
              {renderField(t('settings', 'emailRelance'), notification.emailRelance, (e) => updateNested('notification', 'emailRelance', e.target.checked), { type: 'checkbox' })}
              {renderField(t('settings', 'delaiRelance'), notification.delaiRelance, (e) => updateNested('notification', 'delaiRelance', Number(e.target.value)), { type: 'number', small: true })}
            </div>
          </div>
        )
      case 'appearance':
        return (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-palette" style={{ fontSize: '1.3rem', color: 'var(--accent)' }}></i>
              <div>
                <h6 className="mb-0" style={{ fontWeight: 700 }}>{t('settings', 'appearance')}</h6>
                <small className="text-muted">Personnalisez l'apparence de l'application</small>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border" style={{ background: 'var(--card-bg)', borderRadius: 12 }}>
                  <div className="card-body">
                    <label className="form-label small d-block" style={{ fontWeight: 600, marginBottom: 10 }}>{t('settings', 'theme')}</label>
                    <div className="d-flex gap-2">
                      <button className={`btn d-flex align-items-center gap-2 flex-fill ${theme === THEMES.LIGHT ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => update('theme', THEMES.LIGHT)}>
                        <i className="bi bi-sun-fill"></i> {t('settings', 'light')}
                      </button>
                      <button className={`btn d-flex align-items-center gap-2 flex-fill ${theme === THEMES.DARK ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => update('theme', THEMES.DARK)}>
                        <i className="bi bi-moon-fill"></i> {t('settings', 'dark')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border" style={{ background: 'var(--card-bg)', borderRadius: 12 }}>
                  <div className="card-body">
                    <label className="form-label small d-block" style={{ fontWeight: 600, marginBottom: 10 }}>{t('settings', 'language')}</label>
                    <div className="d-flex gap-2">
                      {[
                        { value: LANGUAGES.FR, label: 'FR', name: t('settings', 'french') },
                        { value: LANGUAGES.EN, label: 'EN', name: t('settings', 'english') },
                        { value: LANGUAGES.AR, label: 'AR', name: t('settings', 'arabic') },
                      ].map((opt) => (
                        <button key={opt.value}
                          className={`btn d-flex align-items-center gap-2 flex-fill ${lang === opt.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => update('lang', opt.value)}>
                          <span className="fw-bold">{opt.label}</span>
                          <small>{opt.name}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="settings-page">
      <div className="d-flex align-items-center gap-2 page-title mb-4">
        <i className="bi bi-gear"></i>
        <span>{t('settings', 'title')}</span>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 small fade-in" style={{ borderRadius: 10 }}>
          <i className="bi bi-check-circle-fill"></i>
          <span>{t('settings', 'saved')}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Sidebar Tabs */}
        <div className="col-md-3">
          <div className="card border-0" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <div className="list-group list-group-flush">
              {tabs.map(({ key, icon, labelKey }) => (
                <button key={key}
                  className={`list-group-item list-group-item-action d-flex align-items-center gap-3 border-0 ${activeTab === key ? 'active' : ''}`}
                  style={{
                    padding: '0.8rem 1rem',
                    background: activeTab === key ? 'var(--primary)' : 'var(--card-bg)',
                    color: activeTab === key ? '#fff' : 'var(--text-primary)',
                    borderLeft: activeTab === key ? '3px solid var(--accent)' : '3px solid transparent',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === key ? 600 : 400,
                  }}
                  onClick={() => setActiveTab(key)}>
                  <i className={`bi ${icon}`} style={{ fontSize: '1.15rem' }}></i>
                  {t('settings', labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9">
          <div className="card border-0" style={{ borderRadius: 14 }}>
            <div className="card-body" style={{ padding: '1.5rem 1.75rem' }}>
              {renderSection()}
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave}>
              <i className="bi bi-check-lg"></i> {t('settings', 'save')}
            </button>
            <button className={`btn d-flex align-items-center gap-2 ${confirmReset ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={handleReset} onMouseLeave={() => setConfirmReset(false)}>
              <i className={`bi ${confirmReset ? 'bi-exclamation-triangle-fill' : 'bi-arrow-counterclockwise'}`}></i>
              {confirmReset ? 'Confirmer ?' : t('settings', 'reset')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
