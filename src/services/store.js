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
    background:var(--paper); width:21cm; min-height:29.7cm;
    padding:2.5cm 2.5cm; box-shadow:0 4px 20px rgba(0,0,0,.15);
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
  @media print {
    body { background:#fff; padding:0; }
    .sheet { box-shadow:none; }
    @page { size:A4; margin:0; }
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
  { id: 2, title: "Attestation de salaire", type: "Attestation de salaire", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Attestation de Travail et Salaire</title>
<style>
  body {
    background: #d9d9d9;
    font-family: "Times New Roman", Times, serif;
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  .page {
    background: #fff;
    width: 21cm;
    min-height: 29.7cm;
    padding: 2.5cm 2.5cm;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    color: #000;
    font-size: 19px;
    line-height: 1.9;
    box-sizing: border-box;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 40px;
  }
  .logo-row img { height: 46px; }
  .logo-row .titre {
    font-size: 14px;
    font-weight: bold;
    color: #555;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .page { box-shadow: none; width: 21cm; min-height: 29.7cm; }
    @page { size: A4; margin: 0; }
  }
  h1 {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    text-decoration: underline;
    margin: 0 0 50px 0;
  }
  p {
    margin: 0 0 24px 0;
    text-align: justify;
  }
  .hl {
    font-weight: bold;
    font-style: italic;
    color: #1a3d8f;
  }
  .blank {
    display: inline-block;
    min-width: 90px;
    border-bottom: 1px solid #000;
  }
  .fait {
    margin-top: 60px;
    text-align: right;
  }
  .responsable {
    margin-top: 30px;
    text-align: right;
  }
  .footer {
    text-align: right;
    font-size: 13px;
    margin-top: 60px;
  }
</style>
</head>
<body>
  <div class="page">
    <div class="logo-row">
      <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'">
      <span class="titre">HS-INFRA</span>
    </div>
    <h1>ATTESTATION DE TRAVAIL ET SALAIRE</h1>

    <p>Nous, soussign&eacute;s St&eacute; <span class="hl">{{raison_sociale}}</span>, attestons par la pr&eacute;sente que {{civilite}} : <span class="hl">{{first_name}} {{last_name}}</span> N&eacute; le : <span class="hl">{{birth_date}}</span>, N&deg; C.I.N <span class="hl">{{cin}}</span>, immatricul&eacute; &agrave; la C.N.S.S sous le <span class="hl">N&deg;{{cnss}}</span>, est employ&eacute; au sein de notre &eacute;tablissement en qualit&eacute; de &laquo;<span class="hl">{{position}}</span>&raquo;, et ce depuis le <span class="hl">{{hire_date}}</span> jusqu'&agrave; nos jours, percevant un salaire mensuel brut de <span class="blank">{{salary}}</span> DH ( {{salary_letters}} ).</p>

    <p>Cette attestation est d&eacute;livr&eacute;e &agrave; l'int&eacute;ress&eacute; sur sa demande pour servir et valoir ce que de droit.</p>

    <div class="fait">Fait &agrave; {{ville}} le : {{date}}</div>

    <div class="responsable">Responsable RH</div>

    <div class="footer">RH/ATS/1/19</div>
  </div>
</body>
</html>` },
  { id: 3, title: "Demande de prime", type: "Demande de prime", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Demande de Prime</title>
<style>
  body {
    background: #d9d9d9;
    font-family: "Times New Roman", Times, serif;
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
  .page {
    background: #fff;
    width: 21cm;
    min-height: 29.7cm;
    padding: 2.5cm 2.5cm;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    color: #000;
  }
  .logo-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .logo-row img { height: 50px; }
  .date {
    text-align: right;
    font-weight: bold;
    font-size: 17px;
  }
  .field {
    margin-bottom: 24px;
    font-size: 19px;
  }
  .field label {
    font-weight: bold;
    text-decoration: underline;
  }
  .motif-row {
    font-size: 19px;
    margin: 10px 0 40px 0;
  }
  .box {
    display: inline-block;
    width: 15px;
    height: 15px;
    border: 1px solid #000;
    margin: 0 6px;
    vertical-align: middle;
  }
  .montant-label {
    font-weight: bold;
    text-decoration: underline;
    font-size: 19px;
  }
  .montant-box {
    display: inline-block;
    border: 1px solid #000;
    width: 220px;
    height: 45px;
    margin-left: 20px;
    vertical-align: middle;
  }
  .signature {
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    margin: 70px 0 60px 0;
    font-size: 19px;
  }
  .sign-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 90px;
    font-weight: bold;
    font-size: 19px;
  }
  @media print {
    body { background:#fff; padding:0; }
    .page { box-shadow:none; }
    @page { size:A4; margin:0; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="logo-row">
      <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'" style="height:50px">
      <div class="date">{{ville}}, le : {{date}}</div>
    </div>
    <h1>DEMANDE DE PRIME</h1>

    <div class="field"><label>Nom &amp; Pr&eacute;nom:</label> <strong>{{first_name}} {{last_name}}</strong></div>
    <div class="field"><label>Fonction :</label> <strong>{{position}}</strong></div>
    <div class="field"><label>D&eacute;partement :</label> <strong>{{department}}</strong></div>
    <div class="field"><label>Agence:</label> <strong>{{agence}}</strong></div>
    <div class="field"><label>Motif :</label> <strong>{{motif}}</strong></div>

    <div class="motif-row">
      Naissance <span class="box"></span> &nbsp;&nbsp;&nbsp; Mariage <span class="box"></span> &nbsp;&nbsp;&nbsp; Autres (&agrave; pr&eacute;ciser) <span class="box"></span> .........
    </div>

    <div class="montant-label">
      Montant accord&eacute; :
      <span class="montant-box">{{montant}}</span>
    </div>

    <div class="signature">SIGNATURE</div>

    <div class="sign-row">
      <div>Demandeur :</div>
      <div>Responsables hi&eacute;rarchiques :</div>
    </div>
    <div class="sign-row">
      <div>D&eacute;partement RH :</div>
      <div>Direction G&eacute;n&eacute;rale :</div>
    </div>
  </div>
</body>
</html>` },
  { id: 5, title: "Demande d'avance", type: "Demande d'avance", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Demande d'Avance</title>
<style>
  :root{ --ink:#1c2430; --paper:#ffffff; --muted:#6b7280; }
  *{box-sizing:border-box;}
  body{
    background:#dfe3e8; font-family:'Georgia','Times New Roman',serif;
    display:flex; justify-content:center; padding:40px 20px; margin:0;
  }
  .sheet{
    background:var(--paper); width:820px; max-width:100%;
    padding:50px 60px; box-shadow:0 4px 20px rgba(0,0,0,.15);
  }
  .header-top{ text-align:right; font-style:italic; font-size:15px; margin-bottom:20px; color:var(--ink); }
  .logo-row{
    display:flex; align-items:center; gap:16px; margin-bottom:30px;
  }
  .logo img{ height:38px; }
  .titre-banner{
    flex:1; border:1.5px solid var(--ink); border-radius:4px;
    text-align:center; padding:14px; font-size:24px; font-weight:bold; font-style:italic;
  }
  .cadre{
    border:1.5px solid var(--ink); padding:25px 30px; margin-bottom:25px;
  }
  .field-row{
    display:flex; align-items:baseline; gap:10px; margin-bottom:10px; font-size:16px;
  }
  .field-row label{ min-width:140px; color:var(--ink); }
  .field-row .val{
    border-bottom:1px dotted #999; font-family:inherit; font-weight:bold;
    font-size:16px; padding:2px 4px; min-width:200px; display:inline-block;
  }
  .motif-box{
    border:1.5px solid var(--ink); padding:15px 20px; margin-bottom:25px;
  }
  .motif-box label{ font-weight:bold; text-decoration:underline; }
  .motif-box .val{
    display:block; font-size:16px; margin-top:8px; min-height:40px;
  }
  .montants-cadre{
    border:1.5px solid var(--ink); padding:20px 30px; margin-bottom:25px;
  }
  .montant-row{
    display:flex; align-items:center; gap:16px; margin-bottom:16px; font-size:16px;
  }
  .montant-row label{ min-width:160px; }
  .montant-row .box{
    border:1.5px solid var(--ink); display:flex; align-items:center;
    padding:8px 12px; min-width:120px; font-weight:bold; font-size:16px;
  }
  .date-prelevement{
    display:flex; align-items:baseline; gap:10px; font-size:16px;
    color:var(--ink);
  }
  .date-prelevement .val{
    border-bottom:1px dotted #999; font-weight:bold; padding:2px 4px; min-width:120px;
    display:inline-block;
  }
  .signature{ margin-top:50px; }
  .signature h2{
    text-align:center; text-decoration:underline; font-size:18px; margin-bottom:40px;
  }
  .sign-grid{
    display:grid; grid-template-columns:1fr 1fr; row-gap:60px; font-size:15px; font-weight:bold;
  }
  .footer-code{ text-align:right; font-size:12px; color:var(--muted); margin-top:40px; }
  @media print {
    body { background:#fff; padding:0; }
    .sheet { box-shadow:none; }
    @page { size:A4; margin:0; }
  }
</style>
</head>
<body>
<div class="sheet">

  <div class="header-top">
    {{ville}}, le : {{date}}
  </div>

  <div class="logo-row">
    <div class="logo">
      <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'">
    </div>
    <div class="titre-banner">DEMANDE D'AVANCE</div>
  </div>

  <div class="cadre">
    <div class="field-row">
      <label>- Nom &amp; Pr&eacute;nom :</label>
      <span class="val">{{first_name}} {{last_name}}</span>
    </div>
    <div class="field-row">
      <label>- Fonction :</label>
      <span class="val">{{position}}</span>
    </div>
    <div class="field-row">
      <label>- D&eacute;partement :</label>
      <span class="val">{{department}}</span>
    </div>
    <div class="field-row">
      <label>- Agence :</label>
      <span class="val">{{agence}}</span>
    </div>
  </div>

  <div class="motif-box">
    <label>Motif :</label>
    <div class="val">{{motif}}</div>
  </div>

  <div class="montants-cadre">
    <div class="montant-row">
      <label>Montant demand&eacute; :</label>
      <div class="box">{{montant}}</div>
      <span>Dhs</span>
    </div>
    <div class="montant-row">
      <label>Montant accord&eacute; :</label>
      <div class="box">{{montant_accorde}}</div>
      <span>Dhs</span>
    </div>
    <div class="date-prelevement">
      <span>&#10132; Date de pr&eacute;l&egrave;vement :</span>
      <span class="val">{{date}}</span>
    </div>
  </div>

  <div class="signature">
    <h2>SIGNATURE</h2>
    <div class="sign-grid">
      <div>Demandeur :</div>
      <div>Responsables hi&eacute;rarchiques :</div>
      <div>D&eacute;partement RH :</div>
      <div>D&eacute;partement Financier :</div>
    </div>
  </div>

  <div class="footer-code">RH/DA/1/19</div>

</div>
</body>
</html>` },
  { id: 6, title: "Certificat de travail", type: "Certificat de travail", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Certificat de Travail</title>
<style>
  body {
    background: #d9d9d9;
    font-family: "Times New Roman", Times, serif;
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  .page {
    background: #fff;
    width: 21cm;
    min-height: 29.7cm;
    padding: 2.5cm 2.5cm;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    color: #000;
    font-size: 19px;
    line-height: 1.9;
    box-sizing: border-box;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 40px;
  }
  .logo-row img { height: 46px; }
  .logo-row .titre {
    font-size: 14px;
    font-weight: bold;
    color: #555;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .page { box-shadow: none; width: 21cm; min-height: 29.7cm; }
    @page { size: A4; margin: 0; }
  }
  h1 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    text-decoration: underline;
    margin: 0 0 50px 0;
    letter-spacing: 1px;
  }
  p {
    margin: 0 0 24px 0;
    text-align: justify;
  }
  .hl {
    font-weight: bold;
  }
  .fait {
    text-align: right;
    margin-top: 50px;
  }
  .direction {
    text-align: right;
    margin-top: 90px;
  }
</style>
</head>
<body>
  <div class="page">
    <div class="logo-row">
      <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'">
      <span class="titre">HS-INFRA</span>
    </div>
    <h1>CERTIFICAT DE TRAVAIL</h1>

    <p>Nous, soussign&eacute;s Ste <span class="hl">{{raison_sociale}}</span> certifions par la pr&eacute;sente que {{civilite}} : <span class="hl">{{first_name}} {{last_name}}</span> n&eacute; le <span class="hl">{{birth_date}}</span>, titulaire de la <span class="hl">CIN N&deg;</span> <span class="hl">{{cin}}</span>, immatricul&eacute; &agrave; la C.N.S.S sous le <span class="hl">N&deg; {{cnss}}</span> a &eacute;t&eacute; employ&eacute; au sein de notre &eacute;tablissement en qualit&eacute; de &laquo;<span class="hl">{{position}}</span>&raquo;, et ce depuis le <span class="hl">{{hire_date}}</span>.</p>

    <p>{{civilite}} <span class="hl">{{first_name}} {{last_name}}</span> nous a quitt&eacute; le <span class="hl">{{date}}</span> libre de tout engagement.</p>

    <p>Ce certificat est d&eacute;livr&eacute; &agrave; l'int&eacute;ress&eacute; sur sa demande pour servir et valoir ce que de droit.</p>

    <div class="fait">Fait &agrave; {{ville}} le, <span class="hl">{{date}}</span></div>

    <div class="direction">La Direction</div>
  </div>
</body>
</html>` },
  { id: 7, title: "Attestation de domiciliation irrévocable de salaire", type: "Attestation de domiciliation irrévocable de salaire", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Attestation de Domiciliation Irrévocable de Salaire</title>
<style>
  body {
    background: #d9d9d9;
    font-family: "Times New Roman", Times, serif;
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
  .page {
    background: #fff;
    width: 21cm;
    min-height: 29.7cm;
    padding: 2.5cm 2.5cm;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    color: #000;
    font-size: 19px;
    line-height: 1.7;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;
  }
  .logo-row img { height: 46px; }
  .logo-row .titre {
    font-size: 14px;
    font-weight: bold;
    color: #444;
  }
  h1 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
  h2 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 50px 0;
  }
  p {
    margin: 0 0 22px 0;
    text-align: justify;
  }
  .blank {
    display: inline-block;
    min-width: 90px;
    border-bottom: 1px solid #000;
    font-weight: bold;
  }
  .sign-row {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-top: 60px;
  }
  .sign-boxes {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-top: 15px;
  }
  .sign-box {
    border: 1px solid #000;
    width: 320px;
    height: 130px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 12px;
    box-sizing: border-box;
  }
  .date-in-box {
    font-weight: normal;
  }
  @media print {
    body { background:#fff; padding:0; }
    .page { box-shadow:none; }
    @page { size:A4; margin:0; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="logo-row">
      <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'">
      <span class="titre">HS-INFRA</span>
    </div>
    <h1>ATTESTATION DE DOMICILIATION IRREVOCABLE</h1>
    <h2>DE SALAIRE</h2>

    <p>Nous, soussign&eacute;s Ste <i><span class="blank">{{raison_sociale}}</span></i> au capital de <span class="blank">{{capital}}</span> Immatricul&eacute; au RC n&deg; <span class="blank">{{immatricule}}</span>.</p>

    <p>Attestons par la pr&eacute;sente que le salaire mensuel de {{civilite}} <i><span class="blank">{{first_name}} {{last_name}}</span></i></p>

    <p>Est (ou sera &agrave; compter de ce jour) vir&eacute; irr&eacute;vocablement chaque mois sur son compte bancaire</p>

    <p>N&deg; <span class="blank">{{rib}}</span> ouvert aupr&egrave;s de &laquo;<span class="blank">{{bank_type}}</span>&raquo;.</p>

    <p>Au cas o&ugrave;, celui-ci cesserait son activit&eacute; au sein de notre &eacute;tablissement, nous nous</p>

    <p>Engageons &agrave; en informer &laquo;<span class="blank">{{bank_type}}</span>&raquo;, et &agrave; virer son solde de tout compte au compte bancaire sus mentionn&eacute;.</p>

    <div class="sign-row">
      <div>Accord du Salari&eacute;</div>
      <div>Cachet et Signature de l'Employeur</div>
    </div>
    <div class="sign-boxes">
      <div class="sign-box"></div>
      <div class="sign-box">
        <span class="date-in-box">Date {{date}}.</span>
      </div>
    </div>
  </div>
</body>
</html>` },
  { id: 8, title: "Demande d'aide sociale", type: "Demande d'aide sociale", is_active: true, content: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Demande d'Aide Sociale</title>
<style>
  body {
    background: #d9d9d9;
    font-family: "Times New Roman", Times, serif;
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
  .page {
    background: #fff;
    width: 21cm;
    min-height: 29.7cm;
    padding: 2.5cm 2.5cm;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    color: #000;
  }
  .logo-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .logo-row img { height: 50px; }
  .date {
    text-align: right;
    font-weight: bold;
    font-size: 17px;
  }
  h1 {
    text-align: center;
    font-size: 26px;
    letter-spacing: 1px;
    margin-bottom: 50px;
  }
  .field {
    margin-bottom: 22px;
    font-size: 19px;
  }
  .field label {
    font-weight: bold;
    text-decoration: underline;
  }
  .value {
    font-weight: bold;
  }
  .motif-value {
    font-weight: bold;
  }
  .dots {
    font-size: 19px;
    margin: 4px 0;
    letter-spacing: 1px;
  }
  .charges {
    margin-top: 30px;
  }
  .charges .field {
    font-size: 19px;
  }
  .footer {
    text-align: right;
    font-size: 13px;
    margin-top: 40px;
  }
  .signature {
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    margin: 60px 0 60px 0;
    font-size: 19px;
  }
  .sign-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 90px;
    font-weight: bold;
    font-size: 19px;
  }
  @media print {
    body { background:#fff; padding:0; }
    .page { box-shadow:none; }
    @page { size:A4; margin:0; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="logo-row">
      <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display='none'" style="height:50px">
      <div class="date">{{ville}}, le : {{date}}</div>
    </div>
    <h1>DEMANDE D'AIDE SOCIALE</h1>

    <div class="field"><label>Nom &amp; Pr&eacute;nom:</label> <span class="value">{{first_name}} {{last_name}}</span></div>
    <div class="field"><label>Fonction :</label> <span class="value">{{position}}</span></div>
    <div class="field"><label>D&eacute;partement :</label> <span class="value">{{department}}</span></div>
    <div class="field"><label>Agence:</label> <span class="value">{{agence}}</span></div>
    <div class="field"><label>Motif :</label> <span class="motif-value">{{motif}}</span></div>

    <div class="dots">..........................................................................................................</div>
    <div class="dots">..........................................................................................................</div>

    <div class="charges">
      <div class="field"><label>Total des charges :</label> <span class="value">{{total_charges}}</span></div>
      <div class="field"><label>Remboursement CNSS :</label> <span class="blank">{{cnss_remb}}</span> DH</div>
      <div class="field"><label>Montant d'aide accord&eacute;e :</label> <span class="blank">{{montant_accorde}}</span> DH</div>
    </div>

    <div class="signature">SIGNATURE</div>

    <div class="sign-row">
      <div>Demandeur :</div>
      <div>Responsables hi&eacute;rarchiques :</div>
    </div>
    <div class="sign-row">
      <div>D&eacute;partement RH:</div>
      <div>Direction G&eacute;n&eacute;rale:</div>
    </div>

    <div class="footer">RH/AS/1/19</div>
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
    background:var(--paper); width:21cm; min-height:29.7cm;
    padding:2.5cm 2.5cm; box-shadow:0 4px 20px rgba(0,0,0,.15);
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
  @media print {
    body { background:#fff; padding:0; }
    .sheet { box-shadow:none; }
    @page { size:A4; margin:0; }
  }
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
        <span class="val">{{reference}}</span>
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

const TPL_VERSION = 19
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
      () => api.get(`/templates${activeOnly ? '?active=1' : ''}`).then((r) => {
        const apiData = r.data
        const merged = apiData.map((t) => {
          const seed = seedTpls.find((s) => s.id === t.id)
          if (seed && (seed.content !== t.content || seed.is_active !== t.is_active)) {
            api.put(`/templates/${t.id}`, { content: seed.content, title: seed.title, type: seed.type, is_active: seed.is_active }).catch(() => {})
          }
          return seed ? { ...t, content: seed.content, title: seed.title, type: seed.type, is_active: seed.is_active } : t
        })
        for (const s of seedTpls) {
          if (!merged.find((m) => m.id === s.id)) merged.push(s)
        }
        return activeOnly ? merged.filter((t) => t.is_active) : merged
      }),
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
    const style = isLabel ? `line-height:${lineHeight};color:#000;font-weight:700` : `line-height:${lineHeight};color:#000;font-weight:700`
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

export function numberToFrench(n) {
  const num = parseFloat(String(n).replace(/\s/g, '').replace(',', '.'))
  if (isNaN(num)) return ''
  const entier = Math.floor(Math.abs(num))
  const cents = Math.round((Math.abs(num) - entier) * 100)
  if (entier === 0 && cents === 0) return 'zéro dirham'
  const u = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix',
    'onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf']
  const d = ['','','vingt','trente','quarante','cinquante','soixante','soixante-dix','quatre-vingt','quatre-vingt-dix']
  function convert(n) {
    if (n < 20) return u[n]
    if (n < 70) {
      const t = d[Math.floor(n / 10)]
      const r = n % 10
      if (r === 1) return t + ' et un'
      if (r === 0) return t
      return t + '-' + u[r]
    }
    if (n < 80) {
      const r = n - 60
      if (r === 11) return 'soixante et onze'
      return 'soixante-' + u[r]
    }
    if (n < 90) {
      const r = n - 80
      if (r === 0) return 'quatre-vingts'
      if (r === 1) return 'quatre-vingt-un'
      return 'quatre-vingt-' + u[r]
    }
    if (n < 100) {
      const r = n - 90
      if (r === 11) return 'quatre-vingt-onze'
      return 'quatre-vingt-' + u[r]
    }
    return ''
  }
  function millier(n) {
    if (n === 0) return ''
    if (n < 100) return convert(n)
    if (n < 1000) {
      const c = Math.floor(n / 100)
      const r = n % 100
      const cent = c === 1 ? 'cent' : convert(c) + ' cent'
      if (r === 0) return c > 1 ? cent + 's' : cent
      return cent + ' ' + convert(r)
    }
    return ''
  }
  function mots(n) {
    if (n === 0) return ''
    if (n < 1000) return millier(n)
    if (n < 1000000) {
      const m = Math.floor(n / 1000)
      const r = n % 1000
      const mil = m === 1 ? 'mille' : millier(m) + ' mille'
      if (r === 0) return mil
      return mil + ' ' + millier(r)
    }
    if (n < 1000000000) {
      const m = Math.floor(n / 1000000)
      const r = n % 1000000
      const mil = m === 1 ? 'un million' : mots(m) + ' millions'
      if (r === 0) return mil
      return mil + ' ' + mots(r)
    }
    return ''
  }
  let result = mots(entier)
  if (result === '') result = 'zéro'
  if (cents > 0) {
    result += ' dirhams et ' + mots(cents) + ' centimes'
  } else if (entier > 1) {
    result += ' dirhams'
  } else {
    result += ' dirham'
  }
  return result
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
    return tryApi(() => { const tpl = tplStore.getAll().find((t) => t.id === Number(templateId)); return api.post('/documents/generate', { employee_id: Number(employeeId), template_id: Number(templateId), content: tpl?.content || '', ...extraData }).then((r) => { const d = r.data; return { ...d, htmlContent: d.html_content } }) }, () => {
      const emp = empStore.getAll().find((e) => e.id === Number(employeeId))
      const tpl = tplStore.getAll().find((t) => t.id === Number(templateId))
      const now = new Date()
      const ref = `DOC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(docStore.getAll().length + 1).padStart(3, '0')}`
      const civilite = emp?.genre && emp.genre[0] === 'F' ? 'Madame' : 'Monsieur'
      const { societe } = loadDocSettings()
      const salary = extraData.salary || emp?.salary || ''
      const ctx = { ...emp, civilite, ...extraData, salary, salary_letters: numberToFrench(salary), raison_sociale: societe.raisonSociale || 'HS-INFRA', capital: societe.capital || '', immatricule: societe.immatricule || '', date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }
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
