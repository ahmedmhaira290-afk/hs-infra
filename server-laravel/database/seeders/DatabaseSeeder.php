<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\Template;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'Qettaribadr@hs-infra.com'], ['name' => 'Responsable RH', 'first_name' => 'BADR', 'password' => '0000', 'role' => 'responsable']);
        User::updateOrCreate(['email' => 'ahmed.mhaira@uit.ac.ma'], ['name' => 'Agent RH', 'first_name' => 'AHMED', 'password' => '0000', 'role' => 'agent']);

        Employee::create(['first_name' => 'Ahmed', 'last_name' => 'Benali', 'civilite' => 'M.', 'email' => 'ahmed.benali@hs-infra.ma', 'phone' => '0612345678', 'genre' => 'Masculin', 'nationalite' => 'Marocaine', 'ville' => 'Tanger', 'position' => 'Développeur', 'department' => 'IT', 'agence' => 'Tanger', 'hire_date' => '2023-01-15', 'salary' => '15000', 'birth_date' => '1995-04-12', 'birth_place' => 'Tanger', 'cin' => 'GN258778', 'cnss' => '254878795', 'cnss_remb' => 5000, 'montant_accorde' => 3000, 'bank_type' => 'Banque Populaire', 'rib' => '007 000 010000000000000000', 'bank_type_pro' => 'Banque Populaire Pro', 'rib_pro' => '007 001 010000000000000000']);
        Employee::create(['first_name' => 'Fatima', 'last_name' => 'Zahra', 'civilite' => 'Mme', 'email' => 'fatima.zahra@hs-infra.ma', 'phone' => '0623456789', 'genre' => 'Féminin', 'nationalite' => 'Marocaine', 'ville' => 'Casablanca', 'position' => 'Comptable', 'department' => 'Finance', 'agence' => 'Casablanca', 'hire_date' => '2022-06-01', 'salary' => '12000', 'birth_date' => '1998-09-25', 'birth_place' => 'Casablanca', 'cin' => 'GN345678', 'cnss' => '345678901', 'cnss_remb' => 3000, 'montant_accorde' => 2000, 'bank_type' => 'CIH', 'rib' => '007 000 020000000000000000', 'bank_type_pro' => 'CIH Pro', 'rib_pro' => '007 001 020000000000000000']);
        Employee::create(['first_name' => 'Hassan', 'last_name' => 'El Khadir', 'civilite' => 'M.', 'email' => 'hassan.elkhadir@hs-infra.ma', 'phone' => '0634567890', 'genre' => 'Masculin', 'nationalite' => 'Marocaine', 'ville' => 'Tanger', 'position' => 'Responsable RH', 'department' => 'RH', 'agence' => 'Tanger', 'hire_date' => '2021-03-20', 'salary' => '20000', 'birth_date' => '1990-11-03', 'birth_place' => 'Fès', 'cin' => 'GN456789', 'cnss' => '456789012', 'cnss_remb' => 8000, 'montant_accorde' => 5000, 'bank_type' => 'BMCE', 'rib' => '007 000 030000000000000000', 'bank_type_pro' => 'BMCE Pro', 'rib_pro' => '007 001 030000000000000000']);

        $templates = [
            [1, 'Attestation de travail', 'Attestation de travail', true, "<!DOCTYPE html>
<html lang=\"fr\">
<head>
<meta charset=\"UTF-8\">
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
  @media print {
    body { background:#fff; padding:0; }
    .sheet { box-shadow:none; }
    @page { size:A4; margin:0; }
  }
</style>
</head>
<body>
  <div class=\"sheet\">
  <div class=\"header\">
    <img src=\"/images/hs-infra-logo.png\" alt=\"HS-INFRA\" onerror=\"this.style.display='none'\" style=\"height:50px\">
    <div class=\"h-date\">{{date}}</div>
  </div>
  <h1>ATTESTATION DE TRAVAIL</h1>
  <p class=\"paragraphe\">
    Nous, soussignés Sté
    <span class=\"val\">{{raison_sociale}}</span>,
    attestons par la présente que Mr / Mme :
    <span class=\"val\">{{first_name}} {{last_name}}</span>
    N&eacute;(e) le :
    <span class=\"val\">{{birth_date}}</span>.
    N&deg; C.I.N
    <span class=\"val\">{{cin}}</span>,
    immatricul&eacute;(e) &agrave; la C.N.S.S sous le N&deg;
    <span class=\"val\">{{cnss}}</span>,
    est employ&eacute;(e) au sein de notre &eacute;tablissement en qualit&eacute; de
    &laquo; <span class=\"val\">{{position}}</span> &raquo;,
    et ce depuis le
    <span class=\"val\">{{hire_date}}</span>
    jusqu&rsquo;&agrave; nos jours.
  </p>
  <p class=\"conclusion\">
    Cette attestation est d&eacute;livr&eacute;e &agrave; l&rsquo;int&eacute;ress&eacute;(e) sur sa demande pour servir
    et valoir ce que de droit.
  </p>
  <div class=\"footer-signature\">
    Fait &agrave; <span class=\"val\">{{ville}}</span>, le :
    <span class=\"val\">{{date}}</span>
    <div style=\"margin-top:20px\">Responsable RH</div>
  </div>
  <div class=\"footer-code\">RH/AT/1/19</div>
</div>
</body>
</html>"],
            [2, 'Attestation de salaire', 'Attestation de salaire', true, "<!DOCTYPE html>
<html lang=\"fr\">
<head>
<meta charset=\"UTF-8\">
<title>Attestation de Travail et Salaire</title>
<style>
  body {
    background: #d9d9d9;
    font-family: \"Times New Roman\", Times, serif;
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
  <div class=\"page\">
    <div class=\"logo-row\">
      <img src=\"/images/hs-infra-logo.png\" alt=\"HS-INFRA\" onerror=\"this.style.display='none'\">
      <span class=\"titre\">HS-INFRA</span>
    </div>
    <h1>ATTESTATION DE TRAVAIL ET SALAIRE</h1>

    <p>Nous, soussign&eacute;s St&eacute; <span class=\"hl\">{{raison_sociale}}</span>, attestons par la pr&eacute;sente que {{civilite}} : <span class=\"hl\">{{first_name}} {{last_name}}</span> N&eacute; le : <span class=\"hl\">{{birth_date}}</span>, N&deg; C.I.N <span class=\"hl\">{{cin}}</span>, immatricul&eacute; &agrave; la C.N.S.S sous le <span class=\"hl\">N&deg;{{cnss}}</span>, est employ&eacute; au sein de notre &eacute;tablissement en qualit&eacute; de &laquo;<span class=\"hl\">{{position}}</span>&raquo;, et ce depuis le <span class=\"hl\">{{hire_date}}</span> jusqu'&agrave; nos jours, percevant un salaire mensuel brut de <span class=\"blank\">{{salary}}</span> DH ( {{salary_letters}} ).</p>

    <p>Cette attestation est d&eacute;livr&eacute;e &agrave; l'int&eacute;ress&eacute; sur sa demande pour servir et valoir ce que de droit.</p>

    <div class=\"fait\">Fait &agrave; {{ville}} le : {{date}}</div>

    <div class=\"responsable\">Responsable RH</div>

    <div class=\"footer\">RH/ATS/1/19</div>
  </div>
</body>
</html>"],
            [3, 'Demande de prime', 'Demande de prime', true, "<!DOCTYPE html>
<html lang=\"fr\">
<head>
<meta charset=\"UTF-8\">
<title>Demande de Prime</title>
<style>
  body {
    background: #d9d9d9;
    font-family: \"Times New Roman\", Times, serif;
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
  .page {
    background: #fff;
    width: 800px;
    padding: 60px 70px;
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
    margin-bottom: 60px;
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
  <div class=\"page\">
    <div class=\"logo-row\">
      <img src=\"/images/hs-infra-logo.png\" alt=\"HS-INFRA\" onerror=\"this.style.display='none'\" style=\"height:50px\">
      <div class=\"date\">{{ville}}, le : {{date}}</div>
    </div>
    <h1>DEMANDE DE PRIME</h1>

    <div class=\"field\"><label>Nom &amp; Pr&eacute;nom:</label> <strong>{{first_name}} {{last_name}}</strong></div>
    <div class=\"field\"><label>Fonction :</label> <strong>{{position}}</strong></div>
    <div class=\"field\"><label>D&eacute;partement :</label> <strong>{{department}}</strong></div>
    <div class=\"field\"><label>Agence:</label> <strong>{{agence}}</strong></div>
    <div class=\"field\"><label>Motif :</label> <strong>{{motif}}</strong></div>

    <div class=\"motif-row\">
      Naissance <span class=\"box\"></span> &nbsp;&nbsp;&nbsp; Mariage <span class=\"box\"></span> &nbsp;&nbsp;&nbsp; Autres (&agrave; pr&eacute;ciser) <span class=\"box\"></span> .........
    </div>

    <div class=\"montant-label\">
      Montant accord&eacute; :
      <span class=\"montant-box\">{{montant}}</span>
    </div>

    <div class=\"signature\">SIGNATURE</div>

    <div class=\"sign-row\">
      <div>Demandeur :</div>
      <div>Responsables hi&eacute;rarchiques :</div>
    </div>
    <div class=\"sign-row\">
      <div>D&eacute;partement RH :</div>
      <div>Direction G&eacute;n&eacute;rale :</div>
    </div>
  </div>
</body>
</html>"],
            [5, 'Demande d\'avance', 'Demande d\'avance', true, "<!DOCTYPE html>
<html lang=\"fr\">
<head>
<meta charset=\"UTF-8\">
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
<div class=\"sheet\">

  <div class=\"header-top\">
    {{ville}}, le : {{date}}
  </div>

  <div class=\"logo-row\">
    <div class=\"logo\">
      <img src=\"/images/hs-infra-logo.png\" alt=\"HS-INFRA\" onerror=\"this.style.display='none'\">
    </div>
    <div class=\"titre-banner\">DEMANDE D'AVANCE</div>
  </div>

  <div class=\"cadre\">
    <div class=\"field-row\">
      <label>- Nom &amp; Prénom :</label>
      <span class=\"val\">{{first_name}} {{last_name}}</span>
    </div>
    <div class=\"field-row\">
      <label>- Fonction :</label>
      <span class=\"val\">{{position}}</span>
    </div>
    <div class=\"field-row\">
      <label>- Département :</label>
      <span class=\"val\">{{department}}</span>
    </div>
    <div class=\"field-row\">
      <label>- Agence :</label>
      <span class=\"val\">{{agence}}</span>
    </div>
  </div>

  <div class=\"motif-box\">
    <label>Motif :</label>
    <div class=\"val\">{{motif}}</div>
  </div>

  <div class=\"montants-cadre\">
    <div class=\"montant-row\">
      <label>Montant demandé :</label>
      <div class=\"box\">{{montant}}</div>
      <span>Dhs</span>
    </div>
    <div class=\"montant-row\">
      <label>Montant accordé :</label>
      <div class=\"box\">{{montant_accorde}}</div>
      <span>Dhs</span>
    </div>
    <div class=\"date-prelevement\">
      <span>➤ Date de prélèvement :</span>
      <span class=\"val\">{{date}}</span>
    </div>
  </div>

  <div class=\"signature\">
    <h2>SIGNATURE</h2>
    <div class=\"sign-grid\">
      <div>Demandeur :</div>
      <div>Responsables hiérarchiques :</div>
      <div>Département RH :</div>
      <div>Département Financier :</div>
    </div>
  </div>

  <div class=\"footer-code\">RH/DA/1/19</div>

</div>
</body>
</html>"],
            [6, 'Certificat de travail', 'Certificat de travail', true, "<!DOCTYPE html>
<html lang=\"fr\">
<head>
<meta charset=\"UTF-8\">
<title>Certificat de Travail</title>
<style>
  body {
    background: #d9d9d9;
    font-family: \"Times New Roman\", Times, serif;
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
  <div class=\"page\">
    <div class=\"logo-row\">
      <img src=\"/images/hs-infra-logo.png\" alt=\"HS-INFRA\" onerror=\"this.style.display='none'\">
      <span class=\"titre\">HS-INFRA</span>
    </div>
    <h1>CERTIFICAT DE TRAVAIL</h1>

    <p>Nous, soussign&eacute;s Ste <span class=\"hl\">{{raison_sociale}}</span> certifions par la pr&eacute;sente que {{civilite}} : <span class=\"hl\">{{first_name}} {{last_name}}</span> n&eacute; le <span class=\"hl\">{{birth_date}}</span>, titulaire de la <span class=\"hl\">CIN N&deg;</span> <span class=\"hl\">{{cin}}</span>, immatricul&eacute; &agrave; la C.N.S.S sous le <span class=\"hl\">N&deg; {{cnss}}</span> a &eacute;t&eacute; employ&eacute; au sein de notre &eacute;tablissement en qualit&eacute; de &laquo;<span class=\"hl\">{{position}}</span>&raquo;, et ce depuis le <span class=\"hl\">{{hire_date}}</span>.</p>

    <p>{{civilite}} <span class=\"hl\">{{first_name}} {{last_name}}</span> nous a quitt&eacute; le <span class=\"hl\">{{date}}</span> libre de tout engagement.</p>

    <p>Ce certificat est d&eacute;livr&eacute; &agrave; l'int&eacute;ress&eacute; sur sa demande pour servir et valoir ce que de droit.</p>

    <div class=\"fait\">Fait &agrave; {{ville}} le, <span class=\"hl\">{{date}}</span></div>

    <div class=\"direction\">La Direction</div>
  </div>
</body>
</html>"],
            [7, 'Attestation de domiciliation irrévocable de salaire', 'Attestation de domiciliation irrévocable de salaire', true, "<!DOCTYPE html>
<html lang=\"fr\">
<head>
<meta charset=\"UTF-8\">
<title>Attestation de Domiciliation Irrévocable de Salaire</title>
<style>
  body {
    background: #d9d9d9;
    font-family: \"Times New Roman\", Times, serif;
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
  .page {
    background: #fff;
    width: 800px;
    padding: 60px 70px;
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
  <div class=\"page\">
    <div class=\"logo-row\">
      <img src=\"/images/hs-infra-logo.png\" alt=\"HS-INFRA\" onerror=\"this.style.display='none'\">
      <span class=\"titre\">HS-INFRA</span>
    </div>
    <h1>ATTESTATION DE DOMICILIATION IRREVOCABLE</h1>
    <h2>DE SALAIRE</h2>

    <p>Nous, soussign&eacute;s Ste <i><span class=\"blank\">{{raison_sociale}}</span></i> au capital de <span class=\"blank\">{{capital}}</span> Immatricul&eacute; au RC n&deg; <span class=\"blank\">{{immatricule}}</span>.</p>

    <p>Attestons par la pr&eacute;sente que le salaire mensuel de {{civilite}} <i><span class=\"blank\">{{first_name}} {{last_name}}</span></i></p>

    <p>Est (ou sera &agrave; compter de ce jour) vir&eacute; irr&eacute;vocablement chaque mois sur son compte bancaire</p>

    <p>N&deg; <span class=\"blank\">{{rib}}</span> ouvert aupr&egrave;s de &laquo;<span class=\"blank\">{{bank_type}}</span>&raquo;.</p>

    <p>Au cas o&ugrave;, celui-ci cesserait son activit&eacute; au sein de notre &eacute;tablissement, nous nous</p>

    <p>Engageons &agrave; en informer &laquo;<span class=\"blank\">{{bank_type}}</span>&raquo;, et &agrave; virer son solde de tout compte au compte bancaire sus mentionn&eacute;.</p>

    <div class=\"sign-row\">
      <div>Accord du Salari&eacute;</div>
      <div>Cachet et Signature de l'Employeur</div>
    </div>
    <div class=\"sign-boxes\">
      <div class=\"sign-box\"></div>
      <div class=\"sign-box\">
        <span class=\"date-in-box\">Date {{date}}.</span>
      </div>
    </div>
  </div>
</body>
</html>"],
            [8, 'Demande d\'aide sociale', 'Demande d\'aide sociale', true, <<<'HTML'
<!DOCTYPE html>
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
    width: 800px;
    padding: 60px 70px;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    color: #000;
  }
  .logo-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
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

    <div class=\"charges\">
      <div class=\"field\"><label>Total des charges :</label> <span class=\"value\">{{total_charges}}</span></div>
      <div class=\"field\"><label>Remboursement CNSS :</label> <span class=\"blank\">{{cnss_remb}}</span> DH</div>
      <div class=\"field\"><label>Montant d'aide accord&eacute;e :</label> <span class=\"blank\">{{montant_accorde}}</span> DH</div>
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
</html>
HTML
],
            [9, 'Pièce de caisse dépense', 'Pièce de caisse dépense', true, "<!DOCTYPE html>
<html lang=\"fr\">
<head>
<meta charset=\"UTF-8\">
<title>Pi&egrave;ce de Caisse - D&eacute;penses</title>
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
  @media print {
    body { background:#fff; padding:0; }
    .sheet { box-shadow:none; }
    @page { size:A4; margin:0; }
  }
</style>
</head>
<body>
<div class=\"sheet\">

  <div class=\"header\">
    <img src=\"/images/hs-infra-logo.png\" alt=\"HS-INFRA\" onerror=\"this.style.display='none'\" style=\"height:50px\">
  </div>

  <div class=\"top-row\">
    <div class=\"titre\">
      <div class=\"l1\">Pi&egrave;ce de Caisse</div>
      <div class=\"l2\">D&Eacute;PENSES</div>
    </div>
    <div class=\"droite\">
      <div class=\"droite-row\">
        <label>N&deg; :</label>
        <span class=\"val\">{{reference}}</span>
      </div>
      <div class=\"droite-row\">
        <label>DH :</label>
        <span class=\"val\">{{montant}}</span>
      </div>
      <div class=\"droite-row\">
        <label>Imputation :</label>
        <span class=\"val\">{{department}}</span>
      </div>
      <div class=\"droite-row\">
        <label>Date :</label>
        <span class=\"val\">{{date}}</span>
      </div>
    </div>
  </div>

  <div class=\"champ-row\">
    <label>B&eacute;n&eacute;ficiaire</label>
    <span class=\"val\">{{first_name}} {{last_name}}</span>
  </div>
  <div class=\"champ-row\">
    <label>Montant</label>
    <span class=\"val\">{{montant}} DH</span>
  </div>
  <div class=\"champ-row\">
    <label>Motif</label>
    <span class=\"val\">{{motif}}</span>
  </div>

  <div class=\"ligne-vide\"></div>

  <div class=\"visas\">
    <div>Visa Caissier</div>
    <div>Visa B&eacute;n&eacute;ficiaire</div>
    <div>Visa Direction</div>
  </div>

</div>
</body>
</html>"],
        ];

        foreach ($templates as $t) {
            Template::insertOrIgnore(['id' => $t[0], 'title' => $t[1], 'type' => $t[2], 'is_active' => $t[3], 'content' => $t[4], 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}
