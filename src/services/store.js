import api, { checkBackend } from './api'

function store(key) {
  return {
    getAll() {
      return JSON.parse(localStorage.getItem(key) || '[]')
    },
    saveAll(data) {
      localStorage.setItem(key, JSON.stringify(data))
    },
  }
}

const empStore = store('demo_employees')
const tplStore = store('demo_templates')
const docStore = store('demo_documents')

const EMP_VERSION = 4
const savedEmpVersion = Number(localStorage.getItem('emp_version') || 0)

const seedEmps = [
  { id: 1, first_name: 'Ahmed', last_name: 'Benali', civilite: 'M.', email: 'ahmed.benali@hs-infra.ma', phone: '0612345678', genre: 'Masculin', nationalite: 'Marocaine', ville: 'Tanger', position: 'Développeur', department: 'IT', agence: 'Tanger', hire_date: '2023-01-15', salary: '15000', birth_date: '1995-04-12', birth_place: 'Tanger', cin: 'GN258778', cnss: '254878795', cnss_remb: '5000', montant_accorde: '3000', bank_type: 'Banque Populaire', rib: '007 000 010000000000000000', bank_type_pro: 'Banque Populaire Pro', rib_pro: '007 001 010000000000000000' },
  { id: 2, first_name: 'Fatima', last_name: 'Zahra', civilite: 'Mme', email: 'fatima.zahra@hs-infra.ma', phone: '0623456789', genre: 'Féminin', nationalite: 'Marocaine', ville: 'Casablanca', position: 'Comptable', department: 'Finance', agence: 'Casablanca', hire_date: '2022-06-01', salary: '12000', birth_date: '1998-09-25', birth_place: 'Casablanca', cin: 'GN345678', cnss: '345678901', cnss_remb: '3000', montant_accorde: '2000', bank_type: 'CIH', rib: '007 000 020000000000000000', bank_type_pro: 'CIH Pro', rib_pro: '007 001 020000000000000000' },
  { id: 3, first_name: 'Hassan', last_name: 'El Khadir', civilite: 'M.', email: 'hassan.elkhadir@hs-infra.ma', phone: '0634567890', genre: 'Masculin', nationalite: 'Marocaine', ville: 'Tanger', position: 'Responsable RH', department: 'RH', agence: 'Tanger', hire_date: '2021-03-20', salary: '20000', birth_date: '1990-11-03', birth_place: 'Fès', cin: 'GN456789', cnss: '456789012', cnss_remb: '8000', montant_accorde: '5000', bank_type: 'BMCE', rib: '007 000 030000000000000000', bank_type_pro: 'BMCE Pro', rib_pro: '007 001 030000000000000000' },
]
const seedTpls = [
  { id: 1, title: "Attestation de travail", type: "Attestation de travail", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Attestation de Travail</title>
<style>
  :root{ --ink:#1c2430; --paper:#ffffff; --muted:#6b7280; }
  *{box-sizing:border-box;}
  body{
    background:#dfe3e8; font-family:'Georgia','Times New Roman',serif;
    display:flex; justify-content:center; padding:40px 20px; margin:0;
  }
  .sheet{
    background:var(--paper); width:820px; max-width:100%;
    padding:60px 70px; box-shadow:0 4px 20px rgba(0,0,0,.15);
    min-height:1100px;
  }
  .header{
    display:flex; justify-content:space-between; align-items:center;
    margin-bottom:30px;
  }
  .header img{ height:50px; }
  .header .h-date{ font-size:14px; color:var(--muted); }
  h1{
    text-align:center; font-size:22px; letter-spacing:2px;
    text-decoration:underline; margin:0 0 60px; color:var(--ink);
    word-break:break-word;
  }
  .paragraphe{
    font-size:17px; line-height:2.4; color:var(--ink); text-align:justify;
  }
  .paragraphe .val{
    display:inline-block; border-bottom:1px dotted #999;
    font-style:italic; font-weight:bold; font-size:17px; padding:0 4px;
    text-align:center; min-width:80px;
  }
  .conclusion{
    font-size:17px; line-height:2; color:var(--ink);
    margin-top:40px; text-align:justify;
  }
  .footer-signature{
    margin-top:90px; text-align:right; font-size:16px; color:var(--ink);
  }
  .footer-code{
    text-align:right; font-size:12px; color:var(--muted); margin-top:80px;
  }
</style>
</head>
<body>
  <div class="sheet">
  <div class="header">
    <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'" style="height:50px">
    <div class="h-date">{{date}}</div>
  </div>
  <h1>ATTESTATION DE TRAVAIL</h1>
  <p class="paragraphe">
    Nous, soussignés Sté
    <span class="val">{{raison_sociale}}</span>,
    attestons par la présente que Mr / Mme :
    <span class="val">{{first_name}} {{last_name}}</span>
    Né(e) le :
    <span class="val">{{birth_date}}</span>.
    N° C.I.N
    <span class="val">{{cin}}</span>,
    immatriculé(e) à la C.N.S.S sous le N°
    <span class="val">{{cnss}}</span>,
    est employé(e) au sein de notre établissement en qualité de
    « <span class="val">{{position}}</span> »,
    et ce depuis le
    <span class="val">{{hire_date}}</span>
    jusqu'à nos jours.
  </p>
  <p class="conclusion">
    Cette attestation est délivrée à l'intéressé(e) sur sa demande pour servir
    et valoir ce que de droit.
  </p>
  <div class="footer-signature">
    Fait à <span class="val">{{ville}}</span>, le :
    <span class="val">{{date}}</span>
    <div style="margin-top:20px">Responsable RH</div>
  </div>
  <div class="footer-code">RH/AT/1/19</div>
</div>
</body>
</html>` },
  { id: 2, title: "Attestation de salaire", type: "Attestation de salaire", is_active: true, content: "ATTESTATION DE SALAIRE\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000,\n\nAtteste que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nPerçoit un salaire mensuel brut de : {{salary}} DH\n\nLa présente attestation est délivrée à l'intéressé(e) pour tous usages légaux.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
  { id: 3, title: "Demande de prime", type: "Demande de prime", is_active: true, content: "DEMANDE DE PRIME\n\nInformations du demandeur :\n\nNom & Prénom : {{first_name}} {{last_name}}\nFonction : {{position}}\nDépartement : {{department}}\nAgence : {{agence}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nMotif :\n{{motif}}\n\nMontant accordé :\n{{montant}} DH\n\nSIGNATURE\n\nDemandeur : ______________________\nResponsable hiérarchique : ______________________\nDépartement RH : ______________________\nDirection Générale : ______________________" },
  { id: 4, title: "Certificat médical", type: "Certificat médical", is_active: true, content: "CERTIFICAT MÉDICAL\n\nJe soussigné, Docteur ______________________, certifie avoir examiné {{civilite}} {{first_name}} {{last_name}}.\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\n\nRésultat :\n\n\n\nArrêt de travail du ______________ au ______________\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet du médecin : ______________________" },
  { id: 5, title: "Demande d'avance", type: "Demande d'avance", is_active: true, content: "DEMANDE D'AVANCE\n\nMadame/Monsieur le Responsable RH,\n\nJe soussigné(e) {{first_name}} {{last_name}}, exerçant la fonction de {{position}} au sein du département {{department}} (Agence : {{agence}}) — CIN : {{cin}} — CNSS : {{cnss}} — Type agence : {{bank_type}} — RIB : {{rib}}, sollicite une avance sur salaire d'un montant de {{montant}} DH.\n\nMotif : {{motif}}\n\nJe m'engage à rembourser cette avance selon les modalités convenues avec l'administration.\n\nSignature du demandeur : ______________________\nAvis du responsable hiérarchique : ______________________\nDécision RH : ______________________" },
  { id: 6, title: "Certificat de travail", type: "Certificat de travail", is_active: true, content: "CERTIFICAT DE TRAVAIL\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000,\n\nCertifie que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nA été employé(e) dans notre société du ______________ au ______________\nDurée totale : ______________\nDernier salaire perçu : {{salary}} DH\n\nCe certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
  { id: 7, title: "Attestation de domiciliation irrévocable de salaire", type: "Attestation de domiciliation irrévocable de salaire", is_active: true, content: "ATTESTATION DE DOMICILIATION IRRÉVOCABLE DE SALAIRE\n\nJe soussigné(e) {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nExerçant la fonction de {{position}} — Agence : {{agence}}\n\nDéclare par la présente domicilier mon salaire de façon irrévocable auprès de la banque :\n\nType agence : {{bank_type}} — RIB : {{rib}}\n\nMontant mensuel domicilié : {{salary}} DH\n\nJe reconnais que cette domiciliation reste irrévocable pendant toute la durée de mon contrat de travail.\n\nFait à Tanger, le {{date}}\n\nSignature de l'employé(e) : ______________________\nCachet de la banque : ______________________" },
  { id: 8, title: "Demande d'aide sociale", type: "Demande d'aide sociale", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Demande d'Aide Sociale</title>
<style>
  :root{
    --ink:#1c2430;
    --line:#2b3442;
    --accent:#e91e63;
    --paper:#ffffff;
    --muted:#6b7280;
  }
  *{box-sizing:border-box;}
  body{
    background:#dfe3e8;
    font-family: 'Georgia', 'Times New Roman', serif;
    display:flex;
    justify-content:center;
    padding:40px 20px;
    margin:0;
  }
  .sheet{
    background:var(--paper);
    width:820px;
    max-width:100%;
    padding:50px 60px;
    box-shadow:0 4px 20px rgba(0,0,0,.15);
  }
  .header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:30px;
  }
  .logo{
    display:flex;
    align-items:center;
    gap:10px;
    font-weight:bold;
    font-size:20px;
    color:var(--ink);
  }
  .logo img{ height:46px; }
  .date{
    font-size:15px;
    color:var(--ink);
    margin-top:6px;
  }
  h1{
    text-align:center;
    font-size:26px;
    letter-spacing:1px;
    margin:10px 0 35px;
    color:var(--ink);
  }
  .field-row{
    display:flex;
    align-items:baseline;
    gap:10px;
    margin-bottom:18px;
    font-size:16px;
  }
  .field-row label{
    font-weight:bold;
    text-decoration:underline;
    white-space:nowrap;
    color:var(--ink);
  }
  .field-row .fill{
    flex:1;
    border-bottom:1px dotted #999;
    min-height:20px;
  }
  .dotted-line{
    border-bottom:1px dotted #999;
    height:24px;
    margin-bottom:4px;
  }
  .amount-section{
    margin-top:30px;
  }
  .amount-row{
    display:flex;
    align-items:center;
    gap:14px;
    margin-bottom:16px;
    font-size:16px;
  }
  .amount-row label{
    font-weight:bold;
    text-decoration:underline;
    min-width:230px;
    color:var(--ink);
  }
  .box{
    border:1.5px solid var(--ink);
    min-width:150px;
    min-height:34px;
    padding:6px 12px;
    font-weight:bold;
  }
  .radio-box{
    border:1px solid var(--ink);
    font-size:12px;
    padding:8px 10px;
    text-align:center;
    margin-left:10px;
    max-width:110px;
  }
  .oui-si{
    font-size:14px;
    margin-left:8px;
    color:var(--ink);
  }
  .signature{
    margin-top:60px;
  }
  .signature h2{
    text-decoration:underline;
    font-size:18px;
    margin-bottom:40px;
  }
  .sign-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    row-gap:70px;
    font-size:15px;
    font-weight:bold;
  }
  .footer-code{
    text-align:right;
    font-size:12px;
    color:var(--muted);
    margin-top:40px;
  }
</style>
</head>
<body>

<div class="sheet">

  <div class="header">
    <div class="logo">
      <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'">
    </div>
    <div class="date">{{ville}}, le : {{date}}</div>
  </div>

  <h1>DEMANDE D'AIDE SOCIALE</h1>

  <div class="field-row">
    <label>Nom &amp; Prénom :</label>
    <div class="fill">{{first_name}} {{last_name}}</div>
  </div>
  <div class="field-row">
    <label>Fonction :</label>
    <div class="fill">{{position}}</div>
  </div>
  <div class="field-row">
    <label>Département :</label>
    <div class="fill">{{department}}</div>
  </div>
  <div class="field-row">
    <label>Agence :</label>
    <div class="fill">{{agence}}</div>
  </div>
  <div class="field-row">
    <label>Motif :</label>
    <div class="fill">{{motif}}</div>
  </div>

  <div class="dotted-line"></div>
  <div class="dotted-line"></div>

  <div class="amount-section">
    <div class="amount-row">
      <label>Total des charges :</label>
      <div class="box" style="min-width:120px">{{total_charges}}</div>
    </div>
    <div class="amount-row">
      <label>Remboursement CNSS :</label>
      <div class="box" style="min-width:120px">{{cnss_remb}}</div>
      <span class="oui-si">si oui</span>
      <div class="radio-box">À préciser le montant</div>
    </div>
    <div class="amount-row">
      <label>Montant d'aide demandé :</label>
      <div class="box">{{montant}}</div>
    </div>
    <div class="amount-row">
      <label>Montant d'aide accordé :</label>
      <div class="box" style="border-style:dashed;">{{montant_accorde}}</div>
    </div>
  </div>

  <div class="signature">
    <h2>SIGNATURE</h2>
    <div class="sign-grid">
      <div>Demandeur :</div>
      <div>Responsables hiérarchiques :</div>
      <div>Département RH :</div>
      <div>Direction Générale :</div>
    </div>
  </div>

  <div class="footer-code">RH/AS/1/19</div>

</div>

</body>
</html>` },
  { id: 9, title: "Pièce de caisse dépense", type: "Pièce de caisse dépense", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Pièce de Caisse - Dépenses</title>
<style>
  :root{ --ink:#3a3a3a; --paper:#ffffff; --muted:#8a8a8a; }
  *{box-sizing:border-box;}
  body{
    background:#dfe3e8; font-family:'Georgia','Times New Roman',serif;
    display:flex; justify-content:center; padding:40px 20px; margin:0;
  }
  .sheet{
    background:var(--paper); width:900px; max-width:100%;
    padding:50px 60px; box-shadow:0 4px 20px rgba(0,0,0,.15);
  }
  .top-row{
    display:flex; justify-content:space-between; align-items:flex-start;
    border-bottom:1px solid #ccc; padding-bottom:25px; margin-bottom:35px;
  }
  .titre{ color:var(--muted); font-weight:bold; }
  .titre .l1{ font-size:26px; }
  .titre .l2{ font-size:26px; }
  .droite{ font-size:17px; color:var(--ink); }
  .droite-row{
    display:flex; align-items:baseline; gap:8px; margin-bottom:14px;
  }
  .droite-row label{ min-width:95px; color:var(--muted); font-family:sans-serif; }
  .droite-row .val{
    border:none; border-bottom:1px solid #ccc; font-family:inherit;
    font-size:17px; font-weight:bold; padding:2px 6px; min-width:120px;
    background:transparent; display:inline-block;
  }
  .champ-row{
    display:flex; align-items:baseline; gap:10px; margin-bottom:22px; font-size:19px;
  }
  .champ-row label{ min-width:150px; color:var(--ink); font-family:sans-serif; }
  .champ-row .val{
    border-bottom:1px solid #ccc; font-family:inherit;
    font-size:19px; font-weight:bold; padding:2px 6px; min-width:200px;
    display:inline-block;
  }
  .ligne-vide{ border-bottom:1px solid #ccc; height:30px; margin-bottom:6px; }
  .visas{
    display:flex; justify-content:space-between; margin-top:70px;
    font-family:sans-serif; color:var(--muted); font-size:16px;
  }
  .header{ margin-bottom:20px; }
  .header img{ height:50px; }
</style>
</head>
<body>
<div class="sheet">

  <div class="header">
    <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'" style="height:50px">
  </div>

  <div class="top-row">
    <div class="titre">
      <div class="l1">Pièce de Caisse</div>
      <div class="l2">DÉPENSES</div>
    </div>
    <div class="droite">
      <div class="droite-row">
        <label>N° :</label>
        <span class="val">{{numero_piece}}</span>
      </div>
      <div class="droite-row">
        <label>DH :</label>
        <span class="val">{{montant}}</span>
      </div>
      <div class="droite-row">
        <label>Imputation :</label>
        <span class="val">{{department}}</span>
      </div>
      <div class="droite-row">
        <label>Date :</label>
        <span class="val">{{date}}</span>
      </div>
    </div>
  </div>

  <div class="champ-row">
    <label>Bénéficiaire</label>
    <span class="val">{{first_name}} {{last_name}}</span>
  </div>
  <div class="champ-row">
    <label>Montant</label>
    <span class="val">{{montant}} DH</span>
  </div>
  <div class="champ-row">
    <label>Motif</label>
    <span class="val">{{motif}}</span>
  </div>

  <div class="ligne-vide"></div>

  <div class="visas">
    <div>Visa Caissier</div>
    <div>Visa Bénéficiaire</div>
    <div>Visa Direction</div>
  </div>

</div>
</body>
</html>` },
  { id: 10, title: "Demande prime", type: "Demande prime", is_active: true, content: "DEMANDE DE PRIME\n\nMadame/Monsieur le Responsable,\n\nJe soussigné(e) {{first_name}} {{last_name}}, {{position}} — CIN : {{cin}} — CNSS : {{cnss}} — Type agence : {{bank_type}} — RIB : {{rib}}, ai l'honneur de solliciter l'octroi d'une prime pour le motif suivant :\n\n{{motif}}\n\nMontant sollicité : {{montant}} DH\n\nSignature du demandeur : ______________________\nAvis du supérieur hiérarchique : ______________________\nDécision de la direction : ______________________" },
  { id: 11, title: "Attestation de travail et salaire", type: "Attestation de travail et salaire", is_active: true, content: "ATTESTATION DE TRAVAIL ET SALAIRE\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000,\n\nAtteste que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nEst employé(e) à notre société depuis le {{hire_date}}\nSalaire mensuel actuel : {{salary}} DH\n\nCette attestation est délivrée à l'intéressé(e) pour tous usages légaux.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
  { id: 12, title: "Attestation de travail en bonne et due forme", type: "Attestation de travail en bonne et due forme", is_active: true, content: "ATTESTATION DE TRAVAIL EN BONNE ET DUE FORME\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000, ayant son siège social à Tanger (Maroc),\n\nAtteste par la présente que {{civilite}} {{first_name}} {{last_name}}\n\nNé(e) le : {{birth_date}}\nLieu de naissance : {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de : {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nEmployé(e) sous le matricule : ______________\n\nLa présente attestation est délivrée à l'intéressé(e) sur sa demande pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger" },
]

const existingEmps = empStore.getAll()
if (existingEmps.length < seedEmps.length || savedEmpVersion < EMP_VERSION) {
  const merged = [...existingEmps.filter((e) => e.id > seedEmps.length)]
  for (const emp of seedEmps) {
    const idx = merged.findIndex((e) => e.id === emp.id)
    if (idx > -1) merged[idx] = { ...merged[idx], ...emp }
    else merged.push(emp)
  }
  empStore.saveAll(merged)
  localStorage.setItem('emp_version', String(EMP_VERSION))
}

const TPL_VERSION = 12
const savedVersion = Number(localStorage.getItem('tpl_version') || 0)
const existingTpls = tplStore.getAll()
if (existingTpls.length < seedTpls.length || savedVersion < TPL_VERSION) {
  const merged = [...existingTpls.filter((t) => t.id > seedTpls.length)]
  for (const tpl of seedTpls) {
    const idx = merged.findIndex((t) => t.id === tpl.id)
    if (idx > -1) merged[idx] = tpl
    else merged.push(tpl)
  }
  tplStore.saveAll(merged)
  localStorage.setItem('tpl_version', String(TPL_VERSION))
}

let _backendOk = null
async function tryApi(fn, fallback) {
  if (_backendOk === null) _backendOk = await checkBackend()
  if (!_backendOk) return fallback()
  try { return await fn() } catch { return fallback() }
}
// Re-check backend every 60s
setInterval(async () => { _backendOk = await checkBackend() }, 60000)

function apiCrud(resource, localStore) {
  return {
    async list() {
      return tryApi(() => api.get(`/${resource}`).then((r) => r.data), () => localStore.getAll())
    },
    async get(id) {
      return tryApi(() => api.get(`/${resource}/${id}`).then((r) => r.data), () => localStore.getAll().find((x) => x.id === Number(id)))
    },
    async create(form) {
      return tryApi(() => api.post(`/${resource}`, form).then((r) => r.data), () => {
        const all = localStore.getAll(); const item = { ...form, id: Date.now() }; all.push(item); localStore.saveAll(all)
        return item
      })
    },
    async update(id, form) {
      return tryApi(() => api.put(`/${resource}/${id}`, form).then((r) => r.data), () => {
        const all = localStore.getAll(); const idx = all.findIndex((x) => x.id === Number(id))
        if (idx > -1) all[idx] = { ...all[idx], ...form }; localStore.saveAll(all)
        return all[idx]
      })
    },
  async nextPieceNumber() {
    return tryApi(() => api.get('/documents/next-piece-number').then((r) => r.data.numero_piece), () => {
      const count = docStore.getAll().filter((d) => d.document_type === 'Pièce de caisse dépense').length
      return count + 1
    })
  },
  async remove(id) {
      return tryApi(() => api.delete(`/${resource}/${id}`), () => {
        localStore.saveAll(localStore.getAll().filter((x) => x.id !== Number(id)))
      })
    },
  }
}

export const employeeStore = apiCrud('employees', empStore)

export const templateStore = {
  ...apiCrud('templates', tplStore),
  async list(activeOnly = false) {
    return tryApi(
      () => api.get(`/templates${activeOnly ? '?active=1' : ''}`).then((r) => r.data),
      () => { const all = tplStore.getAll(); return activeOnly ? all.filter((t) => t.is_active) : all }
    )
  },
}

function loadDocSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('app_settings') || '{}')
    return { societe: s.societe || {}, document: s.document || {}, rhManager: s.rhManager || {} }
  } catch { return { societe: {}, document: {}, rhManager: {} } }
}

export function toHtml(title, content) {
  const { societe, document: docConf, rhManager } = loadDocSettings()
  const companyName = societe.raisonSociale || 'HS-INFRA'
  const companyVille = societe.ville || 'Tanger'
  const primaryColor = docConf.couleurPrincipale || '#0d2e4a'
  const font = docConf.police || 'Calibri'
  const fontSize = docConf.taillePolice || '11'
  const lineHeight = docConf.interligne || '1.5'
  const marginTop = docConf.margesHaut || '12'
  const marginBottom = docConf.margesBas || '12'
  const marginLeft = docConf.margesGauche || '15'
  const marginRight = docConf.margesDroite || '15'
  const showLogo = docConf.afficherLogo !== false
  const showHeader = docConf.afficherEnTete !== false
  const showFooter = docConf.afficherPiedPage !== false
  const footerText = docConf.textePiedPage || `${companyName} — ${companyVille}, Maroc`
  const signatureLabel = docConf.texteSignature || 'Signature et cachet'

  const lines = content.split('\n')
  const body = lines.map((line) => {
    const t = line.trim()
    if (!t) return '<div style="height:0.4rem"></div>'
    if (t === t.toUpperCase() && t.length > 3) {
      return `<h2 style="text-align:center;color:${primaryColor};margin:1.2rem 0 0.8rem 0;font-size:1.3rem;font-weight:700">${t}</h2>`
    }
    const isLabel = line.includes(':') && !line.startsWith(' ')
    const style = isLabel ? `line-height:${lineHeight};color:#000;font-weight:600` : `line-height:${lineHeight};color:#111`
    return `<div style="${style}">${line}</div>`
  }).join('')

  const headerHtml = showHeader ? `<div class="header">
    ${showLogo ? `<img src="/images/hs-infra-logo.svg" alt="${companyName}" onerror="this.style.display='none'">` : ''}
    <h1>${companyName}</h1>
  </div>` : ''

  const refHtml = `<div class="ref">N° RÉF : ${title || ''} — Date : ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>`

  const footerHtml = showFooter ? `<div class="footer">${footerText}</div>` : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  @page { margin: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm }
  * { margin: 0; padding: 0; box-sizing: border-box }
  body { font-family: '${font}', 'Segoe UI', Arial, sans-serif; font-size: ${fontSize}px; color: #111; line-height: ${lineHeight} }
  .doc { max-width: 210mm; margin: 0 auto; padding: 20px 30px; background: #fff; min-height: 297mm; position: relative }
  .header { text-align:center; border-bottom:2px solid ${primaryColor}; padding-bottom:10px; margin-bottom:15px }
  .header img { height: 45px }
  .header h1 { font-size:1.1rem; color:${primaryColor}; margin:3px 0 0 0; font-weight:700 }
  .ref { text-align:right; font-size:0.75rem; color:#666; margin-bottom:10px }
  .content { position:relative; z-index:1; min-height:350px }
  .sig { margin-top:40px; display:flex; justify-content:space-between; gap:40px }
  .sig .col { flex:1 }
  .sig .col .label { font-size:0.8rem; font-weight:600; color:${primaryColor}; margin-bottom:4px }
  .sig .col .line { border-bottom:1px solid #333; height:35px; margin-bottom:3px }
  .sig .col .name { font-size:0.75rem; color:#888 }
  .footer { position:absolute; bottom:15px; left:30px; right:30px; border-top:1px solid #ddd; padding-top:5px; font-size:0.65rem; color:#999; text-align:center }
</style></head>
<body>
<div class="doc">
  ${headerHtml}
  ${refHtml}
  <div class="content">${body}</div>
  <div class="sig">
    <div class="col">
      <div class="label">Signature de l'employé(e)</div>
      <div class="line"></div>
      <div class="name">Nom & Prénom : _______________</div>
    </div>
    <div class="col">
      <div class="label">Signature du Responsable RH</div>
      <div class="line"></div>
      <div class="name">${signatureLabel}</div>
    </div>
  </div>
  ${footerHtml}
</div>
</body></html>`
}

export const documentStore = {
  async list() {
    return tryApi(
      () => api.get('/documents').then((r) => {
        const apiDocs = r.data.map((d) => ({ ...d, htmlContent: d.html_content }))
        const localDocs = docStore.getAll()
        const apiRefs = new Set(apiDocs.map((d) => d.reference))
        const merged = [...apiDocs, ...localDocs.filter((d) => !apiRefs.has(d.reference))]
        merged.sort((a, b) => new Date(b.created_at?.replace(' ', 'T')) - new Date(a.created_at?.replace(' ', 'T')))
        return merged
      }),
      () => docStore.getAll()
    )
  },
  async generate(employeeId, templateId, extraData = {}) {
    return tryApi(() => api.post('/documents/generate', { employee_id: Number(employeeId), template_id: Number(templateId), ...extraData }).then((r) => { const d = r.data; return { ...d, htmlContent: d.html_content } }), () => {
      const emp = empStore.getAll().find((e) => e.id === Number(employeeId))
      const tpl = tplStore.getAll().find((t) => t.id === Number(templateId))
      const now = new Date()
      const ref = `DOC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(docStore.getAll().length + 1).padStart(3, '0')}`
      const civilite = emp?.genre && emp.genre[0] === 'F' ? 'Madame' : 'Monsieur'
      const { societe } = loadDocSettings()
      const pieceCount = docStore.getAll().filter((d) => d.document_type === 'Pièce de caisse dépense').length
      const ctx = { ...emp, civilite, ...extraData, raison_sociale: societe.raisonSociale || 'HS-INFRA', date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), numero_piece: pieceCount + 1 }
      const content = (tpl?.content || '').replace(/\{\{(\w+)\}\}/g, (_, key) => ctx?.[key] !== undefined ? ctx[key] : `{{${key}}}`)
      const isFullHtml = content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')
      const htmlContent = isFullHtml ? content : toHtml(ref, content)
      const doc = {
        id: Date.now(), reference: ref, employee_id: Number(employeeId),
        template_id: Number(templateId), content, htmlContent,
        employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Inconnu',
        document_type: tpl?.title || 'Document', created_at: now.toISOString(),
      }
      const all = docStore.getAll(); all.push(doc); docStore.saveAll(all)
      return doc
    })
  },
  async remove(id) {
    return tryApi(() => api.delete(`/documents/${id}`), () => {
      docStore.saveAll(docStore.getAll().filter((d) => d.id !== Number(id)))
    })
  },
}
