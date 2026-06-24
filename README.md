# 🏛️ Intranet-MF - Intranet de la Ville de Montfermeil 2.0

Une plateforme d'intranet moderne pour la Ville de Montfermeil, permettant aux employés de consulter un annuaire, des articles, des recommandations et d'accéder à des applications externes.

## 🎯 Fonctionnalités principales

### 👥 Gestion des salariés
- **Annuaire complet** avec recherche par nom/prénom
- **Profils détaillés**: fonction, localisation, téléphone personnel/professionnel
- **Système de rôles**: utilisateurs classiques et administrateurs
- **Authentification JWT / Keycloak** avec traçabilité des connexions

### 📰 Gestion des articles
- Publication d'articles avec images/vidéos
- Support des types d'articles (news, événement, communiqué, etc.)
- Historique des publications par salarié
- Upload de fichiers multimédias

### 📮 Gestion des recommandés
- Création et suivi des recommandés (courrier)
- Recherche par numéro ou mot-clé
- Logs d'audit complets
- Réservé au service courrier

### 🔗 Portail applicatif
- Accès centralisé aux applications externes:
  - Outlook 365
  - GLPI (gestion IT)
  - CIRIL (courrier)
  - Arpège (RH)
  - Et d'autres...

---

## 🛠️ Stack technique

### Backend
- **Framework**: Spring Boot (Java)
- **Base de données**: SQL (Postgres / MySQL)
- **Authentification**: Keycloak (OIDC) + JWT
- **Gestion des fichiers**: Système de fichiers local (uploads/)

### Frontend
- **Framework**: Next.js (React) - app router
- **Langage**: TypeScript
- **Styles**: CSS custom
- **State Management**: React Hooks + SessionStorage

### Architecture (extrait)
```
Intranet-MF/
├── Intranet/                    # Backend Spring Boot
│   └── src/main/java/com/IntranetMF/Intranet/
│       ├── controller/          # REST Controllers
│       ├── modele/              # Entities JPA
│       ├── repository/          # Data Access Layer
│       └── config/              # Configuration
│
└── IntranetFront/my-montfermeil/ # Frontend Next.js
    ├── app/                     # Pages et layouts
    ├── components/              # Composants React
    └── public/                  # Assets statiques
```

---

## 🚀 Démarrage rapide (commandes mises à jour)

> Remarque : ce dépôt contient du code backend et frontend. Ci‑dessous les commandes exactes utilisées pour les environnements demandés.

### Prérequis
- Java 17+
- Node.js 18+
- npm / yarn / pnpm
- MySQL/PostgreSQL (ou autre base SQL)

### Keycloak - commandes (exactes fournies)

- Développement (PowerShell / CMD Windows) :
```powershell
.\kc.bat start-dev `
  --https-certificate-file=..\certs\192.168.56.11.pem `
  --https-certificate-key-file=..\certs\192.168.56.11-key.pem `
  --https-port=8081 `
  --http-port=8082
```

- Production (PowerShell / CMD Windows) :
```powershell
.\kc.bat start `
  --https-certificate-file=..\certs\192.168.56.11.pem `
  --https-certificate-key-file=..\certs\192.168.56.11-key.pem `
  --https-port=8081 `
  --http-port=8082 `
  --hostname=192.168.56.11
```

> IMPORTANT : placez Keycloak dans un dossier sur le disque C: pour les commandes et chemins utilisés ci‑dessous (ex : `C:\keycloak-26.5.7\keycloak-26.5.7\`). Veillez à ce que le dossier `certs` existe : `C:\keycloak-26.5.7\keycloak-26.5.7\certs\`.

### Spring Boot — Démarrage (exact demandé)
```
./gradlew bootrun
```

### Next.js — Démarrage (production-like)
```
node server.js
```

---

## 📋 API Endpoints (extrait)

### 👤 Salariés
| Méthode | Endpoint | Description |
|---------|---------:|-------------|
| GET | `/salaries/{id}` | Récupérer un salarié par ID |
| GET | `/salaries/` | Lister tous les salariés |
| GET | `/salaries/Salarie/{nom}` | Rechercher par nom/prénom |
| PATCH | `/salaries/Modification/Salarie/{id}` | Modifier un salarié |

### 📰 Articles
| Méthode | Endpoint | Description |
|---------|---------:|-------------|
| GET | `/Article/{id}` | Récupérer un article |
| GET | `/Article/getArticle` | Lister tous les articles |
| POST | `/Article/upload` | Créer un article avec fichier |

### 📮 Recommandés
| Méthode | Endpoint | Description |
|---------|---------:|-------------|
| POST | `/recommander/nouveaux` | Créer un recommandé |
| GET | `/recommander/recommander` | Lister tous les recommandés |
| GET | `/recommander/numero/{recherche}` | Rechercher un recommandé |

### 📁 Médias
| Méthode | Endpoint | Description |
|---------|---------:|-------------|
| GET | `/media/{filename}` | Récupérer un fichier |

---

## 🔐 Sécurité
- **Authentification**: Keycloak (OIDC) + JWT (Spring Security)
- **Autorisation**: Vérification des rôles (`@PreAuthorize` conseillé)
- **Upload de fichiers**: Validation MIME type
- **Logs d'audit**: Traçabilité des actions utilisateur

### Points d'amélioration recommandés:
- Ajouter `@PreAuthorize` sur endpoints sensibles
- Implémenter un `GlobalExceptionHandler`
- Externaliser les chemins (config)
- Utiliser SLF4J / logger adapté

---

## 📁 Structure des modèles (extraits)

### SalarieMF
```java
- id: Long
- nom: String
- prenom: String
- mail: String (unique)
- numero: Integer (téléphone personnel)
- numeroPro: Integer (téléphone professionnel)
- fonction: String
- password: String (hashé)
- isAdmin: Boolean
- isConnected: Boolean
- localisation: Localisation (enum)
- beginLogin: LocalDateTime
- lastLogin: LocalDateTime
```

### ArticleMF
```java
- id: Long
- salarie: SalarieMF (auteur)
- titre: String
- description: String
- date: LocalDate
- type: TypeArticle (enum)
- media: String (nom du fichier)
- path: String (chemin complet)
```

### RecommandeMF
```java
- id: Long
- recommande: String (contenu)
- service: String (service destinataire)
- date: LocalDate
```

---

## 🔧 Démarrage et troubleshooting (certificats Keycloak)

Si, après redirection vers Keycloak, le navigateur affiche une erreur de certificat :

1. Installer `mkcert` sur la machine Windows qui héberge Keycloak (ex: `choco install mkcert` ou `scoop install mkcert`).
2. Vider le contenu du dossier `certs` (supprimer uniquement les fichiers à l'intérieur — NE PAS supprimer le dossier). Exemple de chemin attendu :

```
C:\keycloak-26.5.7\keycloak-26.5.7\certs\
```

3. Ouvrir PowerShell en administrateur et exécuter depuis ce dossier la commande suivante :

```powershell
PS C:\keycloak-26.5.7\keycloak-26.5.7\certs> mkcert 192.168.56.11
```

4. `mkcert` générera le certificat et la clé (par ex. `192.168.56.11.pem` et `192.168.56.11-key.pem`). Assurez-vous que les noms correspondent aux chemins utilisés dans les commandes Keycloak ci‑dessus.
5. Relancer Keycloak avec la commande `kc.bat` appropriée.

> En production, utilisez un certificat émis par une CA digne de confiance (Let's Encrypt, CA interne, commerciale). `mkcert` est uniquement pour dev/local.

---

## 🖥️ Mise à jour du fichier hosts (Windows)

Sur chaque machine cliente (ou sur le serveur si nécessaire), ajoutez les lignes suivantes au fichier :

```
# ajouter à C:\Windows\System32\drivers\etc\hosts (ouvrir Bloc‑notes en administrateur)
127.0.0.1   keycloak.montfermeil.local
192.168.56.11 montfermeil-intranet
```

Procédure rapide : ouvrir le Bloc‑notes en tant qu'administrateur → Ouvrir `C:\Windows\System32\drivers\etc\hosts` → ajouter les lignes → enregistrer.

---

## ✅ Checklist de déploiement / production
- Utiliser un hostname DNS et certificats valides
- Protéger les secrets (KEYCLOAK_ADMIN_PASSWORD, DB, AD bind pass)
- Exposer uniquement HTTPS (reverse-proxy)
- Sauvegarder la base et les dossiers d'uploads
- Mettre en place monitoring et rotation des logs

---

## 🐛 Problèmes connus et TODOs
- Imports dupliqués dans certains contrôleurs
- Gestion des exceptions trop générique (`RuntimeException`)
- Validation des paramètres d'entrée à renforcer
- Externaliser chemins de fichiers en configuration
- Ajouter une couche de service (Service layer) et DTOs

---

## 👨‍💻 Contribution
1. Créer une branche (`git checkout -b feature/ma-feature`)
2. Commiter vos changements (`git commit -m 'Add: description'`)
3. Pousser la branche (`git push origin feature/ma-feature`)
4. Créer une Pull Request

Standards de code : conventions Java, tests, formatting, commentaires pour logique complexe.

---

## 📞 Support
- 📧 Contactez l'équipe IT de Montfermeil
- 🐛 Ouvrez une issue sur GitHub

---

## 📄 Licence
Ce projet est utilisé en interne par la Ville de Montfermeil.

---


**Dernière mise à jour**: Juin 2026
**Version**: 2.0
