Cahier des Charges : Refonte des Metrics
Contexte et objectifs
Le projet consiste à réaliser une refonte complète des metrics dans l'application, en se concentrant sur une présentation plus claire et intuitive des données SEO. Cette refonte implique la suppression des metrics existantes (hors Core Web Vitals) et la création d'une nouvelle ligne d'indicateurs dans la tab overview de seo-audit.vue.
Spécifications fonctionnelles
1. Suppression des éléments existants

Supprimer tous les éléments liés aux metrics actuelles, à l'exception des Core Web Vitals
Supprimer entièrement la première ligne du tableau d'overview dans seo-audit.vue (contenant "global score" et "critical issues")

2. Ajout de nouvelles metrics
Ajouter une nouvelle ligne comprenant 5 indicateurs sous forme de progress circulaires pour :

Meta tags
Content
SEO technique
Accessibilité
Security

3. Calcul des indicateurs

Créer un fichier dédié au calcul de ces 5 metrics
Utiliser les données reçues du backend pour effectuer les calculs
Renvoyer les résultats calculés au frontend pour affichage

4. Représentation visuelle

Utiliser un système de progress circular pour chaque metric
Appliquer le code couleur suivant :

Rouge (error) : pour les metrics à valeur faible
Orange (warning) : pour les metrics à valeur moyenne
Vert (success) : pour les metrics à valeur élevée



Spécifications techniques
Structure des fichiers

Modifier le fichier seo-audit.vue pour supprimer la ligne 1 existante
Créer un composant réutilisable pour les progress circulaires
Créer un fichier de service dédié aux calculs des nouvelles metrics

Intégration backend/frontend

S'assurer que toutes les données nécessaires sont bien reçues du backend
Implémenter les fonctions de calcul dans le fichier dédié
Transmettre les résultats au composant d'affichage

Normes UI/UX

Respecter les conventions de design existantes dans l'application
Assurer un affichage responsive des progress circulaires
Maintenir une cohérence visuelle avec le reste de l'interface
Assurer une bonne lisibilité des indicateurs

Planning de développement

Phase d'analyse et préparation
Suppression des éléments existants
Développement du service de calcul des metrics
Création du composant d'affichage des progress circulaires
Intégration dans seo-audit.vue
Tests et validation
Déploiement

Livrables attendus

Code source complet et documenté
Documentation technique sur les calculs effectués
Guide d'utilisation pour l'équipe

Critères d'acceptation

Affichage correct des 5 metrics sous forme de progress circulaires
Calculs précis basés sur les données du backend
Respect du code couleur défini
Interface responsive et conforme aux normes UI/UX
Performance optimale de l'application