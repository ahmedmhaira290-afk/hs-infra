import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SettingsContext = createContext(null)

const THEMES = { LIGHT: 'light', DARK: 'dark' }
const LANGUAGES = { FR: 'fr', EN: 'en', AR: 'ar' }

const DEFAULT_SETTINGS = {
  theme: THEMES.LIGHT,
  lang: LANGUAGES.FR,
  societe: {
    raisonSociale: 'HS-INFRA',
    sigle: 'HSI',
    formeJuridique: 'SARL',
    adresse: 'Tanger, Maroc',
    ville: 'Tanger',
    telephone: '',
    email: '',
    siteWeb: '',
    ice: '',
    rc: '',
    if: '',
    cnss: '',
    patente: '',
  },
  rhManager: {
    civilite: 'M.',
    nom: 'BADR Qettari',
    dateNaissance: '12/02/1990',
    lieuNaissance: 'Tanger',
    fonction: 'Responsable des Ressources Humaines',
    telephone: '',
    email: '',
  },
  document: {
    numeroReference: 'DOC-{YYYY}{MM}-{NNN}',
    langueDefaut: 'fr',
    formatPapier: 'A4',
    margesHaut: '12',
    margesBas: '12',
    margesGauche: '15',
    margesDroite: '15',
    police: 'Calibri',
    taillePolice: '11',
    interligne: '1.5',
    afficherLogo: true,
    afficherEnTete: true,
    afficherPiedPage: true,
    textePiedPage: 'HS-INFRA — Tanger, Maroc — ICE : {ICE} — RC : {RC}',
    texteSignature: 'Signature et cachet',
    couleurPrincipale: '#0d2e4a',
  },
  employe: {
    champsObligatoires: ['nom', 'prenom', 'email', 'poste', 'dateEmbauche'],
    typesContrat: ['CDI', 'CDD', 'Stage', 'Freelance', 'Intérim'],
    defaultContrat: 'CDI',
    saisieAuto: true,
  },
  notification: {
    emailConfirmation: true,
    emailRelance: false,
    delaiRelance: 7,
  },
}

const labels = {
  [LANGUAGES.FR]: {
    nav: { dashboard: 'Tableau de bord', employees: 'Employés', templates: 'Modèles', agents: 'Agents', generate: 'Générer', history: 'Historique', settings: 'Paramètres' },
    settings: {
      title: 'Paramètres', save: 'Enregistrer', saved: 'Paramètres enregistrés', reset: 'Réinitialiser',
      societe: 'Société', sigle: 'Sigle', formeJuridique: 'Forme juridique', raisonSociale: 'Raison sociale',
      adresse: 'Adresse', ville: 'Ville', telephone: 'Téléphone', email: 'Email', siteWeb: 'Site web',
      ice: 'ICE', rc: 'RC', if: 'I.F.', cnss: 'CNSS', patente: 'Patente',
      rhManager: 'Responsable RH', civilite: 'Civilité', nomComplet: 'Nom complet', dateNaissance: 'Date de naissance',
      lieuNaissance: 'Lieu de naissance', fonction: 'Fonction',
      document: 'Documents', refNumber: 'Format référence', numAuto: 'Numérotation automatique',
      langueDoc: 'Langue des documents', papier: 'Format papier', marges: 'Marges (mm)',
      margeHaut: 'Haut', margeBas: 'Bas', margeGauche: 'Gauche', margeDroite: 'Droite',
      police: 'Police', taillePolice: 'Taille police', interligne: 'Interligne',
      afficherLogo: 'Afficher le logo', afficherEnTete: "Afficher l'en-tête", afficherPiedPage: 'Afficher le pied de page',
      textePiedPage: 'Texte du pied de page', texteSignature: 'Texte de signature', couleurPrincipale: 'Couleur principale',
      employe: 'Employés', champsObligatoires: 'Champs obligatoires', typesContrat: 'Types de contrat',
      defaultContrat: 'Contrat par défaut', saisieAuto: 'Saisie automatique',
      notification: 'Notifications', emailConfirmation: 'Email de confirmation', emailRelance: 'Email de relance',
      delaiRelance: 'Délai de relance (jours)',
      infoSociete: 'Informations légales de l\'entreprise', infoRH: 'Informations du responsable RH',
      infoDocument: 'Configuration des documents générés', infoEmploye: 'Configuration des fiches employés',
      infoNotification: 'Configuration des notifications',
      appearance: 'Apparence', theme: 'Thème', language: 'Langue',
      light: 'Clair', dark: 'Sombre', french: 'Français', english: 'Anglais', arabic: 'Arabe',
    },
    auth: { login: 'Se connecter', email: 'Email professionnel', password: 'Mot de passe' },
  },
  [LANGUAGES.EN]: {
    nav: { dashboard: 'Dashboard', employees: 'Employees', templates: 'Templates', agents: 'Agents', generate: 'Generate', history: 'History', settings: 'Settings' },
    settings: {
      title: 'Settings', save: 'Save', saved: 'Settings saved', reset: 'Reset',
      societe: 'Company', sigle: 'Acronym', formeJuridique: 'Legal form', raisonSociale: 'Company name',
      adresse: 'Address', ville: 'City', telephone: 'Phone', email: 'Email', siteWeb: 'Website',
      ice: 'ICE', rc: 'RC', if: 'Tax ID', cnss: 'CNSS', patente: 'License',
      rhManager: 'HR Manager', civilite: 'Title', nomComplet: 'Full name', dateNaissance: 'Birth date',
      lieuNaissance: 'Birth place', fonction: 'Position',
      document: 'Documents', refNumber: 'Reference format', numAuto: 'Auto numbering',
      langueDoc: 'Document language', papier: 'Paper size', marges: 'Margins (mm)',
      margeHaut: 'Top', margeBas: 'Bottom', margeGauche: 'Left', margeDroite: 'Right',
      police: 'Font', taillePolice: 'Font size', interligne: 'Line spacing',
      afficherLogo: 'Show logo', afficherEnTete: 'Show header', afficherPiedPage: 'Show footer',
      textePiedPage: 'Footer text', texteSignature: 'Signature text', couleurPrincipale: 'Primary color',
      employe: 'Employees', champsObligatoires: 'Required fields', typesContrat: 'Contract types',
      defaultContrat: 'Default contract', saisieAuto: 'Auto fill',
      notification: 'Notifications', emailConfirmation: 'Confirmation email', emailRelance: 'Reminder email',
      delaiRelance: 'Reminder delay (days)',
      infoSociete: 'Company legal information', infoRH: 'HR Manager information',
      infoDocument: 'Generated document configuration', infoEmploye: 'Employee record configuration',
      infoNotification: 'Notification configuration',
      appearance: 'Appearance', theme: 'Theme', language: 'Language',
      light: 'Light', dark: 'Dark', french: 'French', english: 'English', arabic: 'Arabic',
    },
    auth: { login: 'Login', email: 'Professional Email', password: 'Password' },
  },
  [LANGUAGES.AR]: {
    nav: { dashboard: 'لوحة القيادة', employees: 'الموظفون', templates: 'النماذج', agents: 'الوكلاء', generate: 'إنشاء', history: 'السجل', settings: 'الإعدادات' },
    settings: {
      title: 'الإعدادات', save: 'حفظ', saved: 'تم حفظ الإعدادات', reset: 'إعادة تعيين',
      societe: 'الشركة', sigle: 'الاختصار', formeJuridique: 'الشكل القانوني', raisonSociale: 'الاسم التجاري',
      adresse: 'العنوان', ville: 'المدينة', telephone: 'الهاتف', email: 'البريد', siteWeb: 'الموقع',
      ice: 'الرقم الضريبي', rc: 'السجل التجاري', if: 'رقم التعريف', cnss: 'CNSS', patente: 'براءة الاختراع',
      rhManager: 'مسؤول الموارد البشرية', civilite: 'اللقب', nomComplet: 'الاسم الكامل', dateNaissance: 'تاريخ الميلاد',
      lieuNaissance: 'مكان الميلاد', fonction: 'الوظيفة',
      document: 'المستندات', refNumber: 'تنسيق المرجع', numAuto: 'الترقيم التلقائي',
      langueDoc: 'لغة المستندات', papier: 'حجم الورق', marges: 'الهوامش (ملم)',
      margeHaut: 'أعلى', margeBas: 'أسفل', margeGauche: 'يسار', margeDroite: 'يمين',
      police: 'الخط', taillePolice: 'حجم الخط', interligne: 'تباعد الأسطر',
      afficherLogo: 'إظهار الشعار', afficherEnTete: 'إظهار الترويسة', afficherPiedPage: 'إظهار التذييل',
      textePiedPage: 'نص التذييل', texteSignature: 'نص التوقيع', couleurPrincipale: 'اللون الرئيسي',
      employe: 'الموظفون', champsObligatoires: 'الحقول الإجبارية', typesContrat: 'أنواع العقود',
      defaultContrat: 'العقد الافتراضي', saisieAuto: 'الإكمال التلقائي',
      notification: 'الإشعارات', emailConfirmation: 'بريد التأكيد', emailRelance: 'بريد التذكير',
      delaiRelance: 'مهلة التذكير (أيام)',
      infoSociete: 'المعلومات القانونية للشركة', infoRH: 'معلومات مسؤول الموارد البشرية',
      infoDocument: 'إعدادات المستندات', infoEmploye: 'إعدادات الموظفين',
      infoNotification: 'إعدادات الإشعارات',
      appearance: 'المظهر', theme: 'المظهر', language: 'اللغة',
      light: 'فاتح', dark: 'داكن', french: 'الفرنسية', english: 'الإنجليزية', arabic: 'العربية',
    },
    auth: { login: 'تسجيل الدخول', email: 'البريد الإلكتروني المهني', password: 'كلمة المرور' },
  },
}

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('app_settings') || '{}') }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  const update = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('app_settings', JSON.stringify(next))
      return next
    })
  }, [])

  const updateNested = useCallback((section, key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [section]: { ...prev[section], [key]: value } }
      localStorage.setItem('app_settings', JSON.stringify(next))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem('app_settings', JSON.stringify(DEFAULT_SETTINGS))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings.theme])

  useEffect(() => {
    if (settings.lang === LANGUAGES.AR) {
      document.documentElement.setAttribute('dir', 'rtl')
      document.documentElement.setAttribute('lang', 'ar')
    } else {
      document.documentElement.removeAttribute('dir')
      document.documentElement.setAttribute('lang', settings.lang)
    }
  }, [settings.lang])

  useEffect(() => {
    document.documentElement.style.setProperty('--app-font', settings.document.police)
    document.documentElement.style.setProperty('--app-font-size', settings.document.taillePolice + 'px')
  }, [settings.document.police, settings.document.taillePolice])

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.document.couleurPrincipale)
  }, [settings.document.couleurPrincipale])

  const t = (section, key) => labels[settings.lang]?.[section]?.[key] || key

  return (
    <SettingsContext.Provider value={{
      ...settings, update, updateNested, reset, t, THEMES, LANGUAGES,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
