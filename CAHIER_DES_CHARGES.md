# Cahier des Charges — Système de Gestion RH HS-INFRA

---

## 1. Présentation Générale

### 1.1 Définition du Projet
Application web de **Gestion des Ressources Humaines** pour la société **HS-INFRA**. Le système permet la gestion des employés, la création et gestion de modèles de documents RH, la génération d'attestations et documents officiels, et le suivi de l'historique des documents générés.

### 1.2 Objectifs
- Centraliser la gestion des données employés
- Automatiser la génération de documents RH (attestations de travail, salaire, certificats, etc.)
- Permettre la délégation de tâches via deux profils (Responsable RH et Agent RH)
- Assurer un suivi et un historique complet des documents générés
- Support multilingue (Français, Anglais, Arabe)

### 1.3 Société
- **Raison sociale** : HS-INFRA
- **Sigle** : HSI
- **Forme juridique** : SARL
- **Siège** : Tanger, Maroc

---

## 2. Analyse des Besoins

### 2.1 Contexte
La société HS-INFRA a besoin d'un outil de gestion RH pour :
- Gérer les fiches employés avec toutes les informations personnelles et professionnelles
- Générer des documents RH standardisés (attestations, certificats, demandes)
- Permettre à un Agent RH de générer des documents sous la supervision du Responsable RH
- Assurer la traçabilité de tous les documents générés

### 2.2 Problématique
- Processus manuel de création de documents RH
- Absence de centralisation des données employés
- Difficulté de suivi des documents générés
- Nécessité de déléguer la génération de documents à un Agent RH

### 2.3 Solution Proposée
Application web avec :
- Interface moderne avec tableau de bord
- Gestion complète des employés (CRUD)
- Modèles de documents personnalisables avec variables dynamiques
- Génération de documents en formats PDF, Word, HTML
- Système d'authentification avec deux rôles (Responsable, Agent)
- Notifications en temps réel
- Support multilingue (FR/EN/AR)
- Thème clair/sombre
- Mode hors-ligne (fallback localStorage)

---

## 3. Acteurs et Rôles

### 3.1 Responsable RH
- Accès complet à toutes les fonctionnalités
- Gestion des employés (ajout, modification, suppression)
- Gestion des modèles de documents (ajout, modification, suppression, activation/désactivation)
- Gestion des agents (CRUD)
- Génération de documents
- Consultation de l'historique
- Paramètres de l'application
- Réception des notifications lors de la génération de documents par les Agents

### 3.2 Agent RH
- Consultation de la liste des employés
- Consultation des modèles de documents
- Génération de documents
- Consultation de l'historique des documents
- Accès aux paramètres
- Déclenche une notification vers le Responsable lors de chaque génération

---

## 4. Besoins Fonctionnels

### 4.1 Authentification et Gestion des Utilisateurs
- Page de connexion avec email et mot de passe
- Authentification via API Laravel Sanctum
- Création de compte (inscription)
- Gestion des sessions avec tokens
- Déconnexion
- Gestion des agents (CRUD) réservée au Responsable
- Deux comptes pré-installés :
  - Responsable : `Qettaribadr@gmail.com` / `0000` (BADR)
  - Agent : `ahmed.mhaira@uit.ac.ma` / `0000` (AHMED)

### 4.2 Tableau de Bord
- Message de bienvenue personnalisé ("Bienvenue M. {first_name}")
- Affichage du rôle connecté
- Cartes statistiques :
  - Nombre d'employés
  - Modèles actifs
  - Documents générés (total)
  - Documents générés ce mois-ci
- Graphique répartition par département
- Graphique tendance des documents générés (6 mois)
- Actions rapides (nouvel employé, gérer agents, générer, historique)
- Liste des 5 documents récents

### 4.3 Gestion des Employés
- **Liste** : tableau avec colonnes (N°, Nom, Prénom, Genre, Nationalité, Ville, Email, Téléphone, Poste, Département, Agence, Date embauche, Salaire, Actions)
- **Recherche** : filtre texte sur tous les champs
- **Ajout** : formulaire avec sections :
  - *Informations personnelles* : Nom, Prénom, Civilité, Genre, Nationalité, Ville, Date naissance, Lieu naissance, CIN, CNSS, Email, Téléphone, Type banque, RIB
  - *Informations professionnelles* : Poste, Département, Agence, Date embauche, Salaire, Type banque (Pro), RIB (Pro)
- **Modification** : mêmes champs que l'ajout
- **Suppression** : avec confirmation
- Contrôle d'accès : l'Agent ne peut que visualiser (pas d'ajout/modification/suppression)

### 4.4 Gestion des Modèles de Documents
- **Liste** : tableau avec colonnes (N°, Titre, Type, Statut, Actions)
- **Activation/Désactivation** : toggle par modèle
- **Ajout** : Titre, Type (select avec prédéfinis ou saisie libre), Contenu (textarea avec variables `{{variable}}`)
- **Modification** : mêmes champs
- **Suppression** : avec confirmation
- **Variables disponibles** : `{{civilite}}`, `{{first_name}}`, `{{last_name}}`, `{{birth_date}}`, `{{birth_place}}`, `{{cin}}`, `{{cnss}}`, `{{genre}}`, `{{nationalite}}`, `{{ville}}`, `{{position}}`, `{{department}}`, `{{agence}}`, `{{bank_type}}`, `{{rib}}`, `{{salary}}`, `{{hire_date}}`, `{{date}}`, `{{motif}}`, `{{montant}}`
- **12 modèles pré-installés** :
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

### 4.5 Génération de Documents
- Sélection d'un employé
- Sélection d'un modèle actif
- Champs supplémentaires conditionnels (ex : motif et montant pour "Demande de prime")
- Aperçu HTML dans un iframe
- Téléchargement en formats :
  - **PDF** (impression navigateur)
  - **Word** (.doc)
  - **HTML**
- Référence automatique format : `DOC-YYYYMMDD-NNN`
- Gestion des variables dynamiques via `preg_replace_callback`
- Notification au Responsable si l'Agent génère un document

### 4.6 Historique des Documents
- Tableau avec colonnes (Référence, Employé, Type, Généré le, Actions)
- Filtres :
  - Recherche textuelle (réf., employé, type, date)
  - Filtre par date (de/à)
  - Bouton réinitialiser
- Téléchargement PDF et Word

### 4.7 Notifications
- 🔔 Cloche de notification dans le sidebar
- Badge rouge avec compteur de notifications non lues
- Dropdown listant les notifications (message + date)
- Marquage individuel comme lu (clic)
- "Tout marquer lu"
- Rafraîchissement automatique toutes les 15 secondes
- Création automatique lors de la génération d'un document par un Agent
- Message type : "L'agent AHMED Agent RH a généré une attestation : Attestation de travail pour Ahmed Benali"

### 4.8 Paramètres
- **6 onglets** avec menu latéral :
  1. **Société** : Raison sociale, Sigle, Forme juridique, ICE, RC, IF, CNSS, Patente, Adresse, Ville, Téléphone, Email, Site web
  2. **Responsable RH** : Civilité, Nom complet, Date naissance, Lieu naissance, Fonction, Téléphone, Email
  3. **Documents** : Format référence, Langue, Format papier (A4/A3/Letter/Legal), Police, Taille police, Interligne, Marges (Haut/Bas/Gauche/Droite), Logo, En-tête, Pied de page, Texte signature, Couleur principale
  4. **Employés** : Types de contrat, Contrat par défaut, Saisie automatique
  5. **Notifications** : Email confirmation, Email relance, Délai relance
  6. **Apparence** : Thème (Clair/Sombre), Langue (FR/EN/AR)

### 4.9 Gestion des Agents
- Liste des utilisateurs avec rôle Agent
- Ajout, modification, suppression
- Champs : Nom complet, Email, Téléphone, Mot de passe

### 4.10 Explorateur de Base de Données
- Visualisation des tables : Employés, Modèles, Utilisateurs, Documents
- Compteurs par table
- Bouton d'ouverture de la base

---

## 5. Besoins Non Fonctionnels

### 5.1 Architecture Technique
- **Frontend** : React 19 + Vite 8 (SPA)
- **Backend** : Laravel 12 (PHP 8.2)
- **Base de données** : SQLite (développement), MySQL (production)
- **Authentification** : Laravel Sanctum (token-based)
- **CSS** : Bootstrap 5.3 + CSS personnalisé
- **Icônes** : Bootstrap Icons

### 5.2 Performance
- Timeout API : 3s (standard), 1s (ping)
- Mise en cache du backend (60s) pour réduire les appels
- Génération de documents côté serveur et côté client

### 5.3 Sécurité
- Authentification via tokens Sanctum
- Hachage des mots de passe (bcrypt)
- Validation des données côté serveur
- Routes protégées par middleware `auth:sanctum`
- Contrôle d'accès basé sur les rôles (frontend)

### 5.4 Disponibilité
- Mode hors-ligne (offline-first) : fallback vers localStorage si API inaccessible
- Synchronisation des données entre localStorage et backend

### 5.5 Multilingue
- 3 langues : Français, Anglais, Arabe
- Support RTL pour l'Arabe
- Labels stockés dans un objet de traduction côté client

### 5.6 Compatibilité
- Application web responsive (adaptée mobile/tablette/desktop)
- Navigateurs modernes

---

## 6. Architecture Technique

### 6.1 Structure Frontend (React)

```
src/
├── App.jsx                    # Routes principales
├── main.jsx                   # Point d'entrée
├── index.css                  # Styles globaux + thème
├── components/
│   ├── Layout.jsx             # Sidebar + structure principale
│   ├── ProtectedRoute.jsx     # Garde d'accès par rôle
│   └── NotificationBell.jsx   # 🔔 Système de notifications
├── pages/
│   ├── Login.jsx              # Authentification
│   ├── Register.jsx           # Inscription
│   ├── Dashboard.jsx          # Tableau de bord
│   ├── Settings.jsx           # Paramètres (6 onglets)
│   ├── employees/
│   │   ├── EmployeeList.jsx   # Liste des employés
│   │   └── EmployeeForm.jsx   # Ajout/Modification employé
│   ├── templates/
│   │   ├── TemplateList.jsx   # Liste des modèles
│   │   └── TemplateForm.jsx   # Ajout/Modification modèle
│   ├── agents/
│   │   └── AgentList.jsx      # Gestion des agents
│   ├── documents/
│   │   ├── Generate.jsx       # Génération de documents
│   │   └── History.jsx        # Historique
│   └── admin/
│       └── Database.jsx       # Explorateur DB
├── services/
│   ├── api.js                 # Axios + checkBackend
│   └── store.js               # Offline-first CRUD + seed data
├── context/
│   ├── AuthContext.jsx        # Contexte d'authentification
│   └── SettingsContext.jsx    # Contexte des paramètres
└── config/
    └── permissions.js         # Rôles et permissions
```

### 6.2 Structure Backend (Laravel)

```
server-laravel/
├── routes/
│   ├── api.php                # Routes API
│   └── web.php                # SPA fallback
├── app/
│   ├── Models/
│   │   ├── User.php           # Utilisateur (HasApiTokens)
│   │   ├── Employee.php       # Employé
│   │   ├── Template.php       # Modèle de document
│   │   ├── Document.php       # Document généré
│   │   └── AppNotification.php # Notification
│   └── Http/Controllers/Api/
│       ├── AuthController.php      # Login/Register/Logout
│       ├── EmployeeController.php  # CRUD Employés
│       ├── TemplateController.php  # CRUD Modèles
│       ├── DocumentController.php  # Génération + CRUD
│       └── NotificationController.php # Notifications
├── database/
│   ├── migrations/
│   └── seeders/
│       └── DatabaseSeeder.php
└── public/
    ├── index.php              # Front controller Laravel
    └── index.html             # SPA build
```

### 6.3 API Endpoints

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/api/ping` | Non | Vérification serveur |
| POST | `/api/login` | Non | Connexion |
| POST | `/api/register` | Non | Inscription |
| POST | `/api/logout` | Sanctum | Déconnexion |
| GET | `/api/user` | Sanctum | Utilisateur connecté |
| GET | `/api/users` | Sanctum | Liste utilisateurs |
| PUT | `/api/users/{id}` | Sanctum | Modifier utilisateur |
| DELETE | `/api/users/{id}` | Sanctum | Supprimer utilisateur |
| GET | `/api/employees` | Sanctum | Liste employés |
| GET | `/api/employees/{id}` | Sanctum | Détail employé |
| POST | `/api/employees` | Sanctum | Créer employé |
| PUT | `/api/employees/{id}` | Sanctum | Modifier employé |
| DELETE | `/api/employees/{id}` | Sanctum | Supprimer employé |
| GET | `/api/templates` | Sanctum | Liste modèles |
| GET | `/api/templates/{id}` | Sanctum | Détail modèle |
| POST | `/api/templates` | Sanctum | Créer modèle |
| PUT | `/api/templates/{id}` | Sanctum | Modifier modèle |
| DELETE | `/api/templates/{id}` | Sanctum | Supprimer modèle |
| GET | `/api/documents` | Sanctum | Liste documents |
| POST | `/api/documents/generate` | Sanctum | Générer document |
| DELETE | `/api/documents/{id}` | Sanctum | Supprimer document |
| GET | `/api/notifications` | Sanctum | Mes notifications |
| PUT | `/api/notifications/{id}/read` | Sanctum | Marquer lue |
| PUT | `/api/notifications/read-all` | Sanctum | Tout marquer lu |

### 6.4 Base de Données

**Table `users`**
| Champ | Type | Description |
|-------|------|-------------|
| id | integer (PK) | |
| name | string | Nom complet |
| first_name | string | Prénom |
| email | string | Email (unique) |
| password | string (hashed) | Mot de passe bcrypt |
| role | string | 'responsable' ou 'agent' |
| phone | string (nullable) | Téléphone |

**Table `employees`**
| Champ | Type | Description |
|-------|------|-------------|
| id | integer (PK) | |
| first_name, last_name | string | Nom et prénom |
| civilite | string | M. / Mme |
| email, phone | string | Coordonnées |
| genre | string | Masculin / Féminin |
| nationalite | string | Nationalité |
| ville | string | Ville |
| position | string | Poste occupé |
| department | string | Département |
| agence | string | Agence |
| hire_date | date | Date d'embauche |
| salary | string | Salaire |
| birth_date, birth_place | string | Naissance |
| cin | string | Carte nationale |
| cnss | string | Numéro CNSS |
| bank_type, rib | string | Banque perso |
| bank_type_pro, rib_pro | string | Banque pro |

**Table `templates`**
| Champ | Type | Description |
|-------|------|-------------|
| id | integer (PK) | |
| title | string | Titre du modèle |
| type | string | Type de document |
| is_active | boolean | Actif/inactif |
| content | text | Contenu avec variables |

**Table `documents`**
| Champ | Type | Description |
|-------|------|-------------|
| id | integer (PK) | |
| reference | string | Référence unique |
| employee_id | integer (FK) | Employé concerné |
| template_id | integer (FK) | Modèle utilisé |
| content | text | Contenu résolu |
| html_content | text | HTML complet |
| employee_name | string | Nom employé |
| document_type | string | Type document |

**Table `notifications`**
| Champ | Type | Description |
|-------|------|-------------|
| id | integer (PK) | |
| user_id | integer (FK) | Destinataire |
| type | string | Type notification |
| message | text | Message |
| document_id | integer (FK) nullable | Document lié |
| read_at | datetime nullable | Date de lecture |

**Table `personal_access_tokens`** (Sanctum)

---

## 7. Interface Utilisateur

### 7.1 Thème et Design
- **Couleur principale** : Bleu marine `#0f2b4a`
- **Accent** : Bleu clair `#2d7dd2`
- **Sidebar** : Dégradé bleu foncé avec navigation verticale
- **Cartes** : Coins arrondis (14px), ombres légères
- **Tableaux** : En-têtes bleu marine, texte blanc
- **Boutons** : Coins arrondis (8px)
- **Animations** : Fade-in, slideUp, hover effects
- **Mode sombre** : Palette sombre avec dégradés adaptés

### 7.2 Pages et Maquette Fonctionnelle

**Page de connexion** :
- Fond dégradé bleu
- Carte centrée avec logo HS-INFRA
- Champs : Email professionnel, Mot de passe
- Bouton "Se connecter"

**Tableau de bord** (après connexion) :
- Bannière de bienvenue avec nom + rôle + date
- 4 cartes statistiques (dégradés colorés)
- Répartition par département (barres horizontales)
- Tendance 6 mois (barres verticales)
- Actions rapides (5 boutons)
- Documents récents (liste)

**Sidebar** (navigation principale) :
- Logo + titre "HS-INFRA RH"
- Menu : Dashboard, Employés, Modèles, Agents, Générer, Historique, Paramètres
- Footer : Nom utilisateur + rôle + 🔔 notifications + Déconnexion

---

## 8. Contraintes Techniques

### 8.1 Environnement de Développement
- PHP 8.2+
- Composer 2.x
- Node.js 18+
- SQLite (local) / MySQL (production)
- Laravel 12
- React 19 + Vite 8

### 8.2 Déploiement
- Serveur : Laravel (PHP) sert l'API
- Frontend buildé copié dans `public/` de Laravel
- SPA fallback via `routes/web.php`
- Port : 9000 (développement local)

---
