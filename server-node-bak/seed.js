import { query, queryOne, execute } from './db.js'
import bcrypt from 'bcryptjs'

export async function seed() {
  const seedUsers = [
    { name: 'Responsable RH', email: 'Qettarbadr@gmail.com', password: '0000', role: 'responsable' },
    { name: 'Agent RH', email: 'ahmed.mhaira@uit.ac.ma', password: '0000', role: 'agent' },
  ]
  const seedEmails = seedUsers.map(u => u.email)
  const allUsers = await query('SELECT id, email FROM users')
  for (const u of allUsers) {
    if (!seedEmails.includes(u.email)) {
      await execute('DELETE FROM users WHERE id = ?', [u.id])
    }
  }
  for (const u of seedUsers) {
    const exists = await queryOne('SELECT id FROM users WHERE email = ?', [u.email])
    if (!exists) {
      await execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [u.name, u.email, bcrypt.hashSync(u.password, 10), u.role])
    } else {
      await execute('UPDATE users SET password = ?, name = ? WHERE email = ?', [bcrypt.hashSync(u.password, 10), u.name, u.email])
    }
  }

  const empCount = Number((await queryOne('SELECT COUNT(*) as count FROM employees'))?.count || 0)
  if (empCount === 0) {
    const emps = [
      ['Ahmed', 'Benali', 'M.', 'ahmed.benali@hs-infra.ma', '0612345678', 'Masculin', 'Marocaine', 'Tanger', 'Développeur', 'IT', 'Tanger', '2023-01-15', '15000', '1995-04-12', 'Tanger'],
      ['Fatima', 'Zahra', 'Mme', 'fatima.zahra@hs-infra.ma', '0623456789', 'Féminin', 'Marocaine', 'Casablanca', 'Comptable', 'Finance', 'Casablanca', '2022-06-01', '12000', '1998-09-25', 'Casablanca'],
      ['Hassan', 'El Khadir', 'M.', 'hassan.elkhadir@hs-infra.ma', '0634567890', 'Masculin', 'Marocaine', 'Tanger', 'Responsable RH', 'RH', 'Tanger', '2021-03-20', '20000', '1990-11-03', 'Fès'],
    ]
    for (const e of emps) {
      await execute(`INSERT INTO employees (first_name, last_name, civilite, email, phone, genre, nationalite, ville, position, department, agence, hire_date, salary, birth_date, birth_place) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, e)
    }
  }

  const tplCount = Number((await queryOne('SELECT COUNT(*) as count FROM templates'))?.count || 0)
  if (tplCount === 0) {
    const tpls = [
      ['Attestation de travail', 'Attestation de travail', 1, "ATTESTATION DE TRAVAIL\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA, ayant son siège social à Tanger (Maroc),\n\nAtteste par la présente que :\n\n{{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\n\nLa présente attestation est délivrée à l'intéressé(e) sur sa demande pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger"],
      ['Attestation de salaire', 'Attestation de salaire', 1, "ATTESTATION DE SALAIRE\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA,\n\nAtteste que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\n\nPerçoit un salaire mensuel brut de : {{salary}} DH\n\nLa présente attestation est délivrée à l'intéressé(e) pour tous usages légaux.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger"],
      ['Demande de prime', 'Demande de prime', 1, "Tanger, le {{date}}\n\n\nDEMANDE DE PRIME\n\n\nInformations du demandeur :\n\nNom & Prénom : {{first_name}} {{last_name}}\nFonction : {{position}}\nDépartement : {{department}}\nAgence : {{agence}}\n\nMotif :\n{{motif}}\n\nMontant accordé :\n{{montant}} DH\n\n\nSIGNATURE\n\nDemandeur : ______________________\n\nResponsable hiérarchique : ______________________\n\nDépartement RH : ______________________\n\nDirection Générale : ______________________"],
      ['Certificat médical', 'Certificat médical', 1, "CERTIFICAT MÉDICAL\n\nJe soussigné, Docteur ______________________, certifie avoir examiné {{civilite}} {{first_name}} {{last_name}}.\nNé(e) le {{birth_date}} à {{birth_place}}\n\nRésultat :\n\n\n\nArrêt de travail du ______________ au ______________\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet du médecin : ______________________"],
      ["Demande d'avance", "Demande d'avance", 1, "DEMANDE D'AVANCE\n\nTanger, le {{date}}\n\nMadame/Monsieur le Responsable RH,\n\nJe soussigné(e) {{first_name}} {{last_name}}, exerçant la fonction de {{position}} au sein du département {{department}} (Agence : {{agence}}), sollicite une avance sur salaire d'un montant de {{montant}} DH.\n\nMotif : {{motif}}\n\nJe m'engage à rembourser cette avance selon les modalités convenues avec l'administration.\n\nSignature du demandeur : ______________________\n\nAvis du responsable hiérarchique : ______________________\n\nDécision RH : ______________________"],
      ['Certificat de travail', 'Certificat de travail', 1, "CERTIFICAT DE TRAVAIL\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA,\n\nCertifie que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\n\nA été employé(e) dans notre société du ______________ au ______________\nDurée totale : ______________\nDernier salaire perçu : {{salary}} DH\n\nCe certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger"],
      ['Attestation de travail et salaire', 'Attestation de travail et salaire', 1, "ATTESTATION DE TRAVAIL ET SALAIRE\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA,\n\nAtteste que {{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\n\nEst employé(e) à notre société depuis le {{hire_date}}\nSalaire mensuel actuel : {{salary}} DH\n\nCette attestation est délivrée à l'intéressé(e) pour tous usages légaux.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger"],
      ['Attestation de travail en bonne et due forme', 'Attestation de travail en bonne et due forme', 1, "ATTESTATION DE TRAVAIL EN BONNE ET DUE FORME\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA, ayant son siège social à Tanger (Maroc),\n\nAtteste par la présente que {{civilite}} {{first_name}} {{last_name}}\n\nNé(e) le : {{birth_date}}\nLieu de naissance : {{birth_place}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de : {{position}}\nDépartement : {{department}} — Agence : {{agence}}\n\nEmployé(e) sous le matricule : ______________\n\nLa présente attestation est délivrée à l'intéressé(e) sur sa demande pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger"],
      ["Attestation de domiciliation irrévocable de salaire", "Attestation de domiciliation irrévocable de salaire", 1, "ATTESTATION DE DOMICILIATION IRRÉVOCABLE DE SALAIRE\n\nJe soussigné(e) {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nExerçant la fonction de {{position}} — Agence : {{agence}}\n\nDéclare par la présente domicilier mon salaire de façon irrévocable auprès de la banque :\n\nBanque : ______________________\nAgence bancaire : ______________________\nNuméro de compte : ______________________\n\nMontant mensuel domicilié : {{salary}} DH\n\nJe reconnais que cette domiciliation reste irrévocable pendant toute la durée de mon contrat de travail.\n\nFait à Tanger, le {{date}}\n\nSignature de l'employé(e) : ______________________\nCachet de la banque : ______________________"],
      ["Demande d'aide sociale", "Demande d'aide sociale", 1, "DEMANDE D'AIDE SOCIALE\n\nTanger, le {{date}}\n\nObjet : Demande d'aide sociale\n\nMadame/Monsieur le Responsable RH,\n\nJe soussigné(e) {{first_name}} {{last_name}}, matricule ______________, exerçant la fonction de {{position}} au département {{department}}, agence {{agence}}, ai l'honneur de solliciter votre bienveillance pour une aide sociale.\n\nMotif de la demande :\n{{motif}}\n\nMontant sollicité : {{montant}} DH\n\nPièces jointes :\n- ______________\n- ______________\n\nSignature du demandeur : ______________________\n\nAvis du responsable : ______________________\n\nDécision de la commission : ______________________"],
      ["Pièce de caisse dépense", "Pièce de caisse dépense", 1, "PIÈCE DE CAISSE DÉPENSE\n\nN° : ______________\nDate : {{date}}\n\nNom du bénéficiaire : {{first_name}} {{last_name}}\nFonction : {{position}}\n\nObjet de la dépense : {{motif}}\n\nMontant : {{montant}} DH\n\nArrêté la présente pièce à la somme de : ______________ DH\n\nSignatures :\n\nLe bénéficiaire : ______________________\n\nLe responsable : ______________________\n\nLe comptable : ______________________\n\nLe caissier : ______________________"],
      ["Demande prime", "Demande prime", 1, "DEMANDE DE PRIME\n\nTanger, le {{date}}\n\nMadame/Monsieur le Responsable,\n\nJe soussigné(e) {{first_name}} {{last_name}}, {{position}}, ai l'honneur de solliciter l'octroi d'une prime pour le motif suivant :\n\n{{motif}}\n\nMontant sollicité : {{montant}} DH\n\nSignature du demandeur : ______________________\n\nAvis du supérieur hiérarchique : ______________________\n\nDécision de la direction : ______________________"],
    ]
    for (const t of tpls) {
      await execute('INSERT INTO templates (title, type, is_active, content) VALUES (?, ?, ?, ?)', t)
    }
  }
}
