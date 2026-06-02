# 🏛️ Intranet-MF - Intranet de la Ville de Montfermeil 2.0

Une plateforme d'intranet moderne pour la Ville de Montfermeil, permettant aux employés de consulter un annuaire, des articles, des recommandations et d'accéder à des applications externes.

## 🎯 Fonctionnalités principales

### 👥 Gestion des salariés
- **Annuaire complet** avec recherche par nom/prénom
- **Profils détaillés**: fonction, localisation, téléphone personnel/professionnel
- **Système de rôles**: utilisateurs classiques et administrateurs
- **Authentification JWT** avec traçabilité des connexions

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
- **Base de données**: SQL
- **Authentification**: OAuth2 / JWT
- **Gestion des fichiers**: Système de fichiers local

### Frontend
- **Framework**: Next.js 15+ (React)
- **Langage**: TypeScript
- **Styles**: CSS custom
- **State Management**: React Hooks + SessionStorage

### Architecture
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

## 🚀 Démarrage rapide

### Prérequis
- **Java 17+**
- **Node.js 18+**
- **npm / yarn / pnpm**
- **MySQL/PostgreSQL** (ou base de données SQL)

### Installation Backend

```bash
cd Intranet

# Configurer la base de données
# Éditer: src/main/resources/application.properties ou application.yml
# Ajouter les configurations:
# - spring.datasource.url
# - spring.datasource.username
# - spring.datasource.password
# - spring.jpa.hibernate.ddl-auto

# Compiler et lancer
mvn clean install
mvn spring-boot:run
```

Le backend sera disponible sur `http://localhost:8080`

### Installation Frontend

```bash
cd IntranetFront/my-montfermeil

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

---

## 📋 API Endpoints

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

---

## 🔐 Sécurité

- **Authentification**: JWT (JSON Web Tokens)
- **Autorisation**: Vérification des rôles (`@PreAuthorize` recommandé)
- **Upload de fichiers**: Validation MIME type
- **Logs d'audit**: Traçabilité complète des actions utilisateur
- **SessionStorage**: Maintien de session côté client (effacé à la fermeture)

### Points d'amélioration recommandés:
- ✅ Ajouter `@PreAuthorize` sur les endpoints sensibles
- ✅ Implémenter une vraie gestion des erreurs (ExceptionHandler)
- ✅ Externaliser les chemins de fichiers en configuration
- ✅ Ajouter un vrai logger (SLF4J) au lieu de `printStackTrace()`

---

## 📁 Structure des modèles

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

## 🐛 Problèmes connus et TODOs

### À corriger (Bug/Sécurité)
- [ ] Imports dupliqués dans les contrôleurs
- [ ] Gestion des exceptions trop générique (`RuntimeException`)
- [ ] Manque de validation des paramètres d'entrée
- [ ] Fautes d'orthographe: "Recommander" vs "Recommandé", "Courier" vs "Courrier"

### À améliorer (Architecture)
- [ ] Créer une `ServiceLayer` pour la logique métier
- [ ] Ajouter un `GlobalExceptionHandler`
- [ ] Externaliser la configuration (chemins, paramètres)
- [ ] Utiliser un vrai logger (SLF4J)
- [ ] Ajouter des DTOs pour les requêtes/réponses
- [ ] Implémenter la pagination pour les listes

### Documentation
- [ ] Ajouter des commentaires JavaDoc
- [ ] Créer un guide de contribution
- [ ] Documenter les modèles de données
- [ ] Ajouter un guide de déploiement

---

## 👨‍💻 Contribution

Les contributions sont bienvenues! Veuillez:

1. Créer une branche (`git checkout -b feature/ma-feature`)
2. Commiter vos changements (`git commit -m 'Add: description'`)
3. Pousser la branche (`git push origin feature/ma-feature`)
4. Créer une Pull Request

### Standards de code
- Utiliser les conventions Java (camelCase)
- Ajouter des commentaires pour la logique complexe
- Tester vos changements avant de pusher
- Corriger les imports et formater le code

---

## 📞 Support

Pour toute question ou problème:
- 📧 Contactez l'équipe IT de Montfermeil
- 🐛 Ouvrez une issue sur GitHub
- 💬 Consultez la documentation du projet

---

## 📄 Licence

Ce projet est utilisé en interne par la Ville de Montfermeil.

---

## 🎉 Remerciements

Merci à tous les contributeurs qui ont aidé à développer et maintenir cet intranet!

---

**Dernière mise à jour**: Juin 2026
**Version**: 2.0
