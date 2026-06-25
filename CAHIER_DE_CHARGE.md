# Cahier de Charges — Système de Gestion RH HS-INFRA

## 1. Présentation du Projet

**Nom du projet :** HS-INFRA RH — Système de Gestion des Ressources Humaines  
**Version :** 1.0.0  
**Client :** HS-INFRA (Société à Responsabilité Limitée, Tanger, Maroc)  
**Objectif :** Application web de gestion RH permettant la gestion des employés, des modèles de documents et la génération automatisée d'attestations et documents RH.

---

## 2. Architecture Technique

### 2.1 Stack Technique

| Composant | Technologie | Version |
|-----------|------------|---------|
| Frontend | React | 19 |
| Backend | Laravel | 12 |
| Base de données | SQLite (dev) / PostgreSQL (prod) | — |
| Auth | Laravel Sanctum | 4.3 |
| Bundler | Vite | 8 |
| CSS | Bootstrap 5.3 + Bootstrap Icons | — |
| HTTP Client | Axios | 1.18 |
| Routeur | React Router DOM | 7 |

### 2.2 Structure du Projet

```
commerce/
├── src/                          # Frontend React
│   ├── components/               # Composants réutilisables
│   ├── config/                   # Permissions & configuration
│   ├── context/                  # Contextes React (Auth, Settings)
│   ├── pages/                    # Pages de l'application
│   │   ├── admin/                # Administration (DB viewer)
│   │   ├── agents/               # Gestion des agents
│   │   ├── documents/            # Génération & historique
│   │   ├── employees/            # Gestion des employés
│   │   ├── templates/            # Gestion des modèles
│   │   ├── Dashboard.jsx         # Tableau de bord
│   │   ├── Login.jsx             # Connexion
│   │   ├── Register.jsx          # Inscription
│   │   └── Settings.jsx          # Paramètres
│   └── services/                 # Services API & Store
├── server-laravel/               # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/ # Contrôleurs API
│   │   └── Models/               # Modèles Eloquent
│   ├── config/                   # Configuration Laravel
│   ├── database/
│   │   ├── migrations/           # Migrations DB
│   │   └── seeders/              # Seeders
│   └── routes/                   # Routes API
└── .railway/                     # Déploiement Railway
```

### 2.3 Base de Données

#### Tables

**users**
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | bigint (PK) | Auto-increment |
| name | string | Requis |
| first_name | string | Nullable |
| email | string | Unique, requis |
| password | string | Requis, hashé |
| role | string | Default: 'agent' |
| phone | string | Nullable |
| timestamps | — | created_at, updated_at |

**employees**
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | bigint (PK) | Auto-increment |
| first_name | string | Requis |
| last_name | string | Requis |
| civilite | string | M. / Mme |
| email | string | Requis |
| phone | string | Nullable |
| genre | string | Masculin / Féminin |
| nationalite | string | Requis |
| ville | string | Requis |
| position | string | Requis |
| department | string | Requis |
| agence | string | Requis |
| hire_date | date | Requis |
| salary | string | Requis |
| birth_date | date | Requis |
| birth_place | string | Requis |
| bank_type | string | Nullable |
| rib | string | Nullable |
| bank_type_pro | string | Nullable |
| rib_pro | string | Nullable |

**templates**
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | bigint (PK) | Auto-increment |
| title | string | Requis |
| type | string | Requis |
| is_active | boolean | Default: true |
| content | text | Requis |

**documents**
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | bigint (PK) | Auto-increment |
| reference | string | Requis |
| employee_id | bigint (FK) | → employees.id CASCADE |
| template_id | bigint (FK) | → templates.id CASCADE |
| content | text | Requis |
| html_content | text | Requis |
| employee_name | string | Requis |
| document_type | string | Requis |

---

## 3. Fonctionnalités

### 3.1 Authentification et Gestion des Comptes

- **Connexion** par email + mot de passe (token Sanctum)
- **Inscription** avec création de compte
- **Déconnexion** avec révocation du token
- **Rôles :** Responsable RH / Agent RH
- **Mode offline :** Fallback localStorage si backend indisponible

### 3.2 Gestion des Employés

- **CRUD complet** (Créer, Lire, Modifier, Supprimer)
- **Champs personnels :** Nom, Prénom, Civilité, Genre, Nationalité, Ville, Date/Lieu de naissance, Email, Téléphone, Type de banque, RIB
- **Champs professionnels :** Poste, Département, Agence, Date d'embauche, Salaire, Type de banque (Pro), RIB (Pro)

### 3.3 Gestion des Modèles de Documents

- **CRUD complet** des modèles
- **12 modèles prédéfinis :**
  1. Attestation de travail
  2. Attestation de salaire
  3. Demande de prime
  4. Certificat médical
  5. Demande d'avance
  6. Certificat de travail
  7. Attestation de domiciliation irrévocable de salaire
  8. Demande d'aide sociale
  9. Pièce de caisse dépense
  10. Demande prime
  11. Attestation de travail et salaire
  12. Attestation de travail en bonne et due forme
- **Variables dynamiques :** `{{civilite}}`, `{{first_name}}`, `{{last_name}}`, `{{birth_date}}`, `{{birth_place}}`, `{{genre}}`, `{{nationalite}}`, `{{ville}}`, `{{position}}`, `{{department}}`, `{{agence}}`, `{{bank_type}}`, `{{rib}}`, `{{salary}}`, `{{hire_date}}`, `{{date}}`, `{{motif}}`, `{{montant}}`
- **Types personnalisés :** Saisie libre du type de document

### 3.4 Génération de Documents

- **Moteur de template** avec remplacement des variables
- **Référence automatique :** DOC-YYYYMMDD-NNN
- **Signature du responsable RH** avec coordonnées bancaires (Agence Barid Bank — RIB)
- **Infos bancaires de l'employé :** Type agence + RIB
- **Export :** HTML, Word (.doc), PDF (impression navigateur)
- **Aperçu avant téléchargement** dans un iframe

### 3.5 Gestion des Agents

- **CRUD complet** des utilisateurs (réservé au Responsable)
- Attribution des rôles (agent/responsable)
- Liste avec nom, email, téléphone, rôle

### 3.6 Paramètres (Multilingue & Thème)

- **Langues :** Français (défaut), Anglais, Arabe (RTL)
- **Thèmes :** Clair / Sombre
- **Configuration société :** Raison sociale, adresse, contacts, ICE, RC, IF, CNSS, Patente
- **Configuration RH Manager :** Civilité, nom, date/lieu naissance, fonction
- **Configuration document :** Format papier, polices, marges, en-tête/pied de page

### 3.7 Dashboard

- **Bienvenue personnalisée :** "Bienvenue M. {first_name}" + rôle
- **Statistiques :** Nombre d'employés, modèles actifs, documents générés, documents du mois
- **Graphiques :** Répartition par département (barres), tendance 6 mois (barres)
- **Actions rapides** selon permissions
- **Documents récents** (5 derniers)

---

## 4. Permissions et Rôles

### 4.1 Rôle : Responsable RH

| Permission | Accès |
|-----------|-------|
| VIEW_EMPLOYEES | Voir la liste des employés |
| MANAGE_EMPLOYEES | Créer/modifier/supprimer des employés |
| VIEW_TEMPLATES | Voir les modèles |
| MANAGE_TEMPLATES | Créer/modifier/supprimer des modèles |
| GENERATE_DOCUMENTS | Générer des documents |
| VIEW_HISTORY | Voir l'historique des documents |
| MANAGE_USERS | Gérer les agents |
| MANAGE_SETTINGS | Modifier les paramètres |

### 4.2 Rôle : Agent RH

| Permission | Accès |
|-----------|-------|
| VIEW_EMPLOYEES | Voir la liste des employés |
| VIEW_TEMPLATES | Voir les modèles |
| GENERATE_DOCUMENTS | Générer des documents |
| VIEW_HISTORY | Voir l'historique |
| MANAGE_SETTINGS | Modifier les paramètres |

---

## 5. API REST

### 5.1 Routes Publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/ping` | Health check → `{"ok": true}` |
| POST | `/api/login` | Authentification |
| POST | `/api/register` | Création de compte |

### 5.2 Routes Protégées (Sanctum)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/logout` | Déconnexion |
| GET | `/api/user` | Infos utilisateur courant |
| GET | `/api/users` | Liste des utilisateurs |
| PUT | `/api/users/{id}` | Modifier un utilisateur |
| DELETE | `/api/users/{id}` | Supprimer un utilisateur |
| GET | `/api/employees` | Liste des employés |
| GET | `/api/employees/{id}` | Détail employé |
| POST | `/api/employees` | Créer employé |
| PUT | `/api/employees/{id}` | Modifier employé |
| DELETE | `/api/employees/{id}` | Supprimer employé |
| GET | `/api/templates` | Liste modèles (?active=1) |
| GET | `/api/templates/{id}` | Détail modèle |
| POST | `/api/templates` | Créer modèle |
| PUT | `/api/templates/{id}` | Modifier modèle |
| DELETE | `/api/templates/{id}` | Supprimer modèle |
| GET | `/api/documents` | Historique documents |
| POST | `/api/documents/generate` | Générer document |
| DELETE | `/api/documents/{id}` | Supprimer document |

---

## 6. Comptes par Défaut (Seed)

| Nom | Prénom | Email | Mot de passe | Rôle |
|-----|--------|-------|-------------|------|
| Responsable RH | BADR | Qettaribadr@gmail.com | 0000 | responsable |
| Agent RH | AHMED | ahmed.mhaira@uit.ac.ma | 0000 | agent |

---

## 7. Déploiement

### 7.1 Local

```bash
# Backend (terminal 1)
cd server-laravel
php artisan serve --host=127.0.0.1 --port=9000

# Frontend (terminal 2)
npm run dev
```

### 7.2 Production (Railway)

- **Service :** Laravel PHP 8.2
- **Base de données :** PostgreSQL Railway
- **Variables :** `APP_KEY`, `DB_CONNECTION=pgsql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

---

## 8. État d'Avancement

| Module | Statut |
|--------|--------|
| Authentification | ✅ Terminé |
| Gestion employés | ✅ Terminé |
| Gestion modèles | ✅ Terminé |
| Génération documents | ✅ Terminé |
| Dashboard | ✅ Terminé |
| Paramètres (i18n, thème) | ✅ Terminé |
| Gestion agents | ✅ Terminé |
| Mode offline (localStorage) | ✅ Terminé |
| Permissions RBAC | ✅ Terminé |
| Types de modèles personnalisés | ✅ Terminé |
| Infos bancaires (employé + signataire) | ✅ Terminé |
| Déploiement Railway | 🔄 En cours |

---

*Document généré le 24 juin 2026*
