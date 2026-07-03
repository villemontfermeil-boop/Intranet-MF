# Intranet-MF - Intranet de la Ville de Montfermeil 2.0

Une plateforme d'intranet moderne pour la Ville de Montfermeil, permettant aux employés de consulter un annuaire, des articles, des recommandations et d'accéder à des applications externes.

## 🎯 Fonctionnalités principales

### 👥 Gestion des salariés
- Annuaire complet avec recherche par nom/prénom
- Profils détaillés: fonction, localisation, téléphone personnel/professionnel
- Système de rôles: utilisateurs classiques et administrateurs
- Authentification JWT / Keycloak avec traçabilité des connexions

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
- Accès centralisé aux applications externes (Outlook, GLPI, etc.)
- Gestion des redirections sécurisées
- Traçabilité des accès

## 🛠️ Stack technique

### Backend
- **Framework**: Spring Boot (Java)
- **Base de données**: SQL (PostgreSQL / MySQL)
- **Authentification**: Keycloak (OIDC) + JWT
- **Gestion des fichiers**: Système de fichiers local

### Frontend
- **Framework**: Next.js (React) - app router
- **Langage**: TypeScript
- **Styles**: CSS custom
- **State Management**: React Hooks + SessionStorage

## 📁 Architecture

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

## 🚀 Démarrage rapide

### Prérequis
- Java 17+
- Node.js 18+
- npm / yarn / pnpm
- MySQL/PostgreSQL
- Keycloak (voir la documentation interne pour la configuration)

### Configuration d'environnement
1. Créer un fichier `.env.local` à la racine du projet
2. Utiliser `.env.example` comme template
3. Configurer les variables essentielles:
   - `DATABASE_URL`: Connexion à la base de données
   - `KEYCLOAK_URL`: URL du serveur Keycloak
   - `JWT_SECRET`: Clé secrète JWT
   - `FILE_UPLOAD_PATH`: Chemin d'upload des fichiers

### Démarrage du backend (Spring Boot)
```bash
cd Intranet
./gradlew bootrun
```

### Démarrage du frontend (Next.js)
```bash
cd IntranetFront/my-montfermeil
npm install
node server.js
```

## 📋 API Endpoints (extrait)

### 👤 Salariés
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/salaries/{id}` | Récupérer un salarié par ID |
| GET | `/salaries/` | Lister tous les salariés |
| GET | `/salaries/Salarie/{nom}` | Rechercher par nom/prénom |
| PATCH | `/salaries/Modification/Salarie/{id}` | Modifier un salarié |

### 📰 Articles
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/Article/{id}` | Récupérer un article |
| GET | `/Article/getArticle` | Lister tous les articles |
| POST | `/Article/upload` | Créer un article avec fichier |

### 📮 Recommandés
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/recommander/nouveaux` | Créer un recommandé |
| GET | `/recommander/recommander` | Lister tous les recommandés |
| GET | `/recommander/numero/{recherche}` | Rechercher un recommandé |

### 📁 Médias
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/media/{filename}` | Récupérer un fichier |

## 🔐 Sécurité

- **Authentification**: Keycloak (OIDC) + JWT (Spring Security)
- **Autorisation**: Vérification des rôles via @PreAuthorize
- **Upload de fichiers**: Validation MIME type
- **Logs d'audit**: Traçabilité des actions utilisateur
- **HTTPS**: Obligatoire en production

### Points d'amélioration recommandés
- [ ] Ajouter @PreAuthorize sur tous les endpoints sensibles
- [ ] Implémenter un GlobalExceptionHandler
- [ ] Externaliser les chemins en configuration
- [ ] Utiliser SLF4J / logger adapté
- [ ] Renforcer la validation des paramètres d'entrée
- [ ] Ajouter une couche Service + DTOs

## 📁 Modèles de données (extraits)

### SalarieMF
```
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
```
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
```
- id: Long
- recommande: String (contenu)
- service: String (service destinataire)
- date: LocalDate
```

## ✅ Checklist de déploiement / Production

- [ ] Utiliser HTTPS avec certificats valides (CA reconnue)
- [ ] Protéger tous les secrets dans un gestionnaire (vault, env chiffré)
- [ ] Exposer uniquement via reverse-proxy
- [ ] Sauvegarder régulièrement la base et les uploads
- [ ] Mettre en place monitoring et rotation des logs
- [ ] Configurer les backups automatisés
- [ ] Activer les logs d'audit complets
- [ ] Effectuer un audit de sécurité avant mise en production

## 🐛 Problèmes connus et TODOs

- Imports dupliqués dans certains contrôleurs
- Gestion des exceptions trop générique (RuntimeException)
- Validation des paramètres d'entrée à renforcer
- Externaliser chemins de fichiers en configuration
- Ajouter une couche de service (Service layer) et DTOs

## 👨‍💻 Contribution

1. Créer une branche (`git checkout -b feature/ma-feature`)
2. Commiter vos changements (`git commit -m 'Add: description'`)
3. Pousser la branche (`git push origin feature/ma-feature`)
4. Créer une Pull Request

**Standards de code**:
- Conventions Java/TypeScript
- Tests unitaires pour les nouvelles fonctionnalités
- Formatage cohérent
- Commentaires pour la logique complexe

## 📞 Support

- 📧 Contactez l'équipe IT de Montfermeil
- 🐛 Ouvrez une issue sur GitHub
- 📚 Consultez la [documentation complète](./docs/)

## 📄 Licence

Ce projet est utilisé en interne par la Ville de Montfermeil.

---

**Dernière mise à jour**: Juin 2026 | **Version**: 2.0

> **Note**: Pour les informations de déploiement, configuration sensible et accès au serveur, veuillez consulter le document interne `SETUP_INTERNAL.md` (accès restreint).
