# StackUnity

StackUnity est une plateforme tout-en-un pour les développeurs qui souhaitent créer, gérer et optimiser leurs projets web. Elle combine des outils de développement, de surveillance, d'audit SEO, et bien plus encore.

## Fonctionnalités principales

- **Database Designer**: Créez et gérez visuellement vos schémas de base de données avec prise en charge des conversions SQL vers NoSQL et des exportations ORM (Prisma, TypeORM, Sequelize)
- **API Testing Hub**: Testez vos API avec prise en charge de différentes méthodes HTTP (GET, POST, PUT, DELETE, PATCH) et visualisez les réponses
- **Website Audit**: Analysez et optimisez votre site web pour une meilleure visibilité dans les moteurs de recherche, accessibilité et plus encore
- **Robots & Schema Generator**: Générez des fichiers robots.txt et des structures de données schema.org pour améliorer le référencement
- **Outils d'accessibilité**: Vérifiez le contraste des couleurs et simulez différentes déficiences visuelles pour garantir l'accessibilité de votre site
- **Studio de développement**: Environnement de développement visuel pour créer et personnaliser des composants
- **Responsive Design Tester**: Testez votre site web sur différentes tailles d'écran et appareils
- **Analyse sémantique**: Outils d'analyse du contenu et de la structure sémantique
- **Premium Components**: Accédez à des composants et templates Vuetify de haute qualité

## Stack technologique

- **Frontend**: Nuxt.js 3 avec Vue 3, TypeScript et Vuetify 3
- **Sécurité**: Authentification sécurisée basée sur JWT
- **Intégration de paiement**: Stripe avec calcul dynamique des taxes basé sur le pays de l'utilisateur
- **Outils d'analyse**: Analytiques intégrées et suivi des performances avec Plausible
- **Visualisation de données**: Chart.js et ECharts pour des visualisations riches
- **Traitement de documents**: PDF generation avec PDFKit

## Installation et développement

```bash
# Installation des dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en mode production
npm run start
```

## Structure du projet

- `/components`: Composants réutilisables de l'application
- `/layouts`: Mise en page principale pour les différentes sections
- `/pages`: Pages de l'application (Dashboard, Database Designer, API Testing, etc.)
- `/stores`: Stores Pinia pour la gestion de l'état global
- `/server`: API et services côté serveur
- `/public`: Ressources publiques

## Accessibilité et SEO

L'application est conçue avec une forte attention portée à l'accessibilité (WCAG 2.1) et aux bonnes pratiques SEO:
- Structure sémantique HTML5
- Implémentation ARIA complète
- Optimisations des Core Web Vitals
- Génération de méta-données structurées

## Mode Premium

Certaines fonctionnalités avancées sont réservées aux utilisateurs premium:
- Analyse de site web complète
- Fonctionnalités avancées de test d'API
- Simulateur complet de déficiences visuelles
- Accès à tous les composants premium

## Licence

Voir le fichier [LICENSE](LICENSE) pour plus de détails. 