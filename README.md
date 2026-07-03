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
