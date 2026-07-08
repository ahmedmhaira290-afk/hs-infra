import { useState, useRef, useEffect, useCallback } from 'react'

const FONTS = ['Arial', 'Calibri', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana']
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 36, 48, 72]
const VARIABLES = [
  { label: 'Nom', value: 'last_name' }, { label: 'Prénom', value: 'first_name' },
  { label: 'Civilité', value: 'civilite' }, { label: 'Email', value: 'email' },
  { label: 'Téléphone', value: 'phone' }, { label: 'CIN', value: 'cin' },
  { label: 'CNSS', value: 'cnss' }, { label: 'Poste', value: 'position' },
  { label: 'Département', value: 'department' }, { label: 'Agence', value: 'agence' },
  { label: 'Date embauche', value: 'hire_date' }, { label: 'Salaire', value: 'salary' },
  { label: 'Banque', value: 'bank_type' }, { label: 'RIB', value: 'rib' },
  { label: 'Date naissance', value: 'birth_date' }, { label: 'Lieu naissance', value: 'birth_place' },
  { label: 'Ville', value: 'ville' }, { label: 'Nationalité', value: 'nationalite' },
  { label: 'Genre', value: 'genre' },
]

export default function HtmlEditor({ value = '', onChange, keyId }) {
  const editorRef = useRef(null)
  const [mode, setMode] = useState('source')
  const [showVarPicker, setShowVarPicker] = useState(false)

  const isFullHtml = value?.trim().startsWith('<!DOCTYPE') || value?.trim().startsWith('<html')

  useEffect(() => {
    if (isFullHtml) {
      setMode('source')
    }
  }, [isFullHtml])

  useEffect(() => {
    if (mode === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [mode, keyId, value])

  const update = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const exec = useCallback((cmd, val = null) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    update()
  }, [update])

  const handleFont = (e) => { exec('fontName', e.target.value); e.target.value = '' }
  const handleFontSize = (e) => { exec('fontSize', e.target.value); e.target.value = '' }
  const handleColor = (e) => { exec('foreColor', e.target.value) }
  const handleBgColor = (e) => { exec('hiliteColor', e.target.value) }

  const insertVariable = (variable) => {
    if (mode === 'visual') {
      if (editorRef.current) {
        const sel = window.getSelection()
        if (sel?.rangeCount && editorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)) {
          const range = sel.getRangeAt(0)
          range.deleteContents()
          range.insertNode(document.createTextNode(`{{${variable}}}`))
          range.collapse(false)
          sel.removeAllRanges(); sel.addRange(range)
        } else {
          editorRef.current.innerHTML += `{{${variable}}}`
        }
        update()
      }
    } else {
      onChange(value + `{{${variable}}}`)
    }
    setShowVarPicker(false)
  }

  const insertLink = () => { const url = prompt('URL du lien :', 'https://'); if (url) exec('createLink', url) }
  const insertImage = () => { const url = prompt("URL de l'image :", 'https://'); if (url) exec('insertImage', url) }
  const insertTable = () => { exec('insertHTML', '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse"><tr><td>Cellule</td><td>Cellule</td></tr><tr><td>Cellule</td><td>Cellule</td></tr></table>') }

  const ToolBtn = ({ cmd, val, title, children }) => (
    <button type="button" className="html-editor-btn" onClick={() => exec(cmd, val)} title={title}>{children}</button>
  )

  return (
    <div className="html-editor">
      <div className="html-editor-toolbar">
        <ToolBtn cmd="bold" title="Gras (Ctrl+B)"><b>B</b></ToolBtn>
        <ToolBtn cmd="italic" title="Italique (Ctrl+I)"><i>I</i></ToolBtn>
        <ToolBtn cmd="underline" title="Souligné (Ctrl+U)"><u>U</u></ToolBtn>
        <ToolBtn cmd="strikeThrough" title="Barré"><s>S</s></ToolBtn>
        <span className="html-editor-sep"></span>
        <ToolBtn cmd="formatBlock" val="<h1>" title="Titre 1">H1</ToolBtn>
        <ToolBtn cmd="formatBlock" val="<h2>" title="Titre 2">H2</ToolBtn>
        <ToolBtn cmd="formatBlock" val="<h3>" title="Titre 3">H3</ToolBtn>
        <ToolBtn cmd="formatBlock" val="<p>" title="Paragraphe">P</ToolBtn>
        <span className="html-editor-sep"></span>
        <ToolBtn cmd="justifyLeft" title="Aligné gauche"><i className="bi bi-text-left"></i></ToolBtn>
        <ToolBtn cmd="justifyCenter" title="Centré"><i className="bi bi-text-center"></i></ToolBtn>
        <ToolBtn cmd="justifyRight" title="Aligné droite"><i className="bi bi-text-right"></i></ToolBtn>
        <span className="html-editor-sep"></span>
        <ToolBtn cmd="insertUnorderedList" title="Liste à puces"><i className="bi bi-list-ul"></i></ToolBtn>
        <ToolBtn cmd="insertOrderedList" title="Liste numérotée"><i className="bi bi-list-ol"></i></ToolBtn>
        <span className="html-editor-sep"></span>
        <ToolBtn cmd="outdent" title="Réduire le retrait"><i className="bi bi-indent-decrease"></i></ToolBtn>
        <ToolBtn cmd="indent" title="Augmenter le retrait"><i className="bi bi-indent-increase"></i></ToolBtn>
        <span className="html-editor-sep"></span>

        <select className="html-editor-select" onChange={handleFont} defaultValue="">
          <option value="" disabled>Police</option>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select className="html-editor-select" onChange={handleFontSize} defaultValue="">
          <option value="" disabled>Taille</option>
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
        <span className="html-editor-sep"></span>
        <input type="color" className="html-editor-color" onChange={handleColor} title="Couleur du texte" />
        <input type="color" className="html-editor-color" onChange={handleBgColor} title="Couleur de fond" />
        <span className="html-editor-sep"></span>
        <button type="button" className="html-editor-btn" onClick={insertLink} title="Insérer un lien"><i className="bi bi-link-45deg"></i></button>
        <button type="button" className="html-editor-btn" onClick={insertImage} title="Insérer une image"><i className="bi bi-image"></i></button>
        <button type="button" className="html-editor-btn" onClick={insertTable} title="Insérer un tableau"><i className="bi bi-table"></i></button>
        <span className="html-editor-sep"></span>
        <div className="html-editor-var-wrap">
          <button type="button" className="html-editor-btn html-editor-var-btn" onClick={() => setShowVarPicker(!showVarPicker)} title="Insérer une variable">
            <i className="bi bi-code-slash"></i>
          </button>
          {showVarPicker && (
            <div className="html-editor-var-picker">
              {VARIABLES.map(v => (
                <button key={v.value} type="button" className="html-editor-var-item" onClick={() => insertVariable(v.value)}>
                  {`{{${v.label}}}`}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="html-editor-sep"></span>
        <button type="button" className={`html-editor-btn ${mode === 'source' ? 'active' : ''}`} onClick={() => setMode(mode === 'visual' ? 'source' : 'visual')} title="Code source">
          <i className="bi bi-braces"></i>
        </button>
      </div>

      {isFullHtml && mode === 'source' && (
        <div className="html-editor-info">
          <i className="bi bi-info-circle"></i> Ce modèle utilise un document HTML/CSS complet ({'{'}variable{'}'} injectées). Passez en mode Visual pour voir l'aperçu.
        </div>
      )}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          className="html-editor-content"
          contentEditable
          suppressContentEditableWarning
          onInput={update}
        />
      ) : (
        <textarea
          className="html-editor-source form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows="20"
          spellCheck={false}
        />
      )}
    </div>
  )
}
