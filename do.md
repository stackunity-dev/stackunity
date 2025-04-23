# Architecture de Gestion des Abonnements

## Types d'Abonnements
- **Gratuit** : Accès limité aux fonctionnalités de base
- **Standard** : Accès aux fonctionnalités standard
- **Premium** : Accès à toutes les fonctionnalités

## Statuts d'Utilisateur
La table `users` doit contenir les champs suivants pour gérer les abonnements :

- `isPremium` : Boolean (1/0) - Indique si l'utilisateur a un abonnement premium
- `isStandard` : Boolean (1/0) - Indique si l'utilisateur a un abonnement standard
- `trial_start_date` : Date - Date de début de la période d'essai
- `trial_end_date` : Date - Date de fin de la période d'essai (calculée automatiquement : trial_start_date + 7 jours)
- `subscription_status` : Enum('active', 'trial', 'expired', 'none') - État actuel de l'abonnement
- `payment_status` : Enum('paid', 'pending', 'none') - État du paiement

## Flux de Gestion des Abonnements

### Inscription
1. Lors de l'inscription (`signup.ts`):
   - `isPremium = 1`
   - `isStandard = 0`
   - `trial_start_date = NOW()`
   - `trial_end_date = NOW() + 7 jours`
   - `subscription_status = 'trial'`
   - `payment_status = 'none'`

### Période d'Essai
- Pendant les 7 jours d'essai, l'utilisateur a accès aux fonctionnalités premium
- `check-trial.ts` vérifie quotidiennement si la période d'essai est terminée

### Fin de la Période d'Essai
- Si `payment_status = 'paid'` :
  - Conserver `isPremium = 1` ou `isStandard = 1` selon l'abonnement payé
  - `subscription_status = 'active'`
- Si `payment_status = 'none'` ou `payment_status = 'pending'` :
  - `isPremium = 0`
  - `isStandard = 0`
  - `subscription_status = 'expired'`

### Paiement
1. Lorsqu'un paiement est initié (`create-intent.ts`) :
   - `payment_status = 'pending'`
2. Lorsqu'un paiement est confirmé (webhook Stripe) :
   - `payment_status = 'paid'`
   - Mettre à jour `isPremium` ou `isStandard` selon le plan choisi
   - `subscription_status = 'active'`

## Modifications Nécessaires

1. Ajouter les champs manquants à la table `users`:
   ```sql
   ALTER TABLE users 
   ADD COLUMN trial_start_date DATETIME,
   ADD COLUMN trial_end_date DATETIME,
   ADD COLUMN subscription_status ENUM('active', 'trial', 'expired', 'none') DEFAULT 'none',
   ADD COLUMN payment_status ENUM('paid', 'pending', 'none') DEFAULT 'none';
   ```

2. Créer une table pour stocker les IDs clients Stripe:
   ```sql
   CREATE TABLE stripe_customers (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     customer_id VARCHAR(255) NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     INDEX (user_id),
     INDEX (customer_id),
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   ```

3. Créer un endpoint webhook Stripe pour gérer les événements de paiement:
   - Créer `server/api/payment/webhook.ts` pour traiter les événements Stripe
   - Mettre à jour le statut d'abonnement en fonction des événements de paiement

4. Remplacer le champ `isBuying` par le nouveau système basé sur `payment_status` pour plus de clarté

5. Mettre à jour le middleware d'authentification pour vérifier correctement le statut d'abonnement

6. Créer un service de vérification périodique des essais expirés pour mettre à jour automatiquement les statuts

## Différence entre create-intent.ts et webhook.ts

Les deux fichiers ont des rôles différents dans le processus de paiement :

### server/api/payment/create-intent.ts
- Appelé lorsque l'utilisateur **initie** un paiement
- Crée l'intention de paiement chez Stripe
- Définit le statut de paiement de l'utilisateur à `pending`
- Renvoie le `clientSecret` qui permet au frontend de finaliser le paiement
- Ne confirme PAS le paiement lui-même

### server/api/payment/webhook.ts
- Appelé par Stripe APRÈS que le paiement soit réussi ou échoué
- Reçoit les événements de Stripe (`payment_intent.succeeded`, `payment_intent.payment_failed`, etc.)
- Met à jour l'état de l'abonnement en fonction du résultat du paiement
- Définit le statut de paiement à `paid` si le paiement a réussi
- CONFIRME réellement l'activation de l'abonnement premium/standard

## Résumé des Changements Effectués

### Fichiers créés
1. `server/api/payment/webhook.ts` - Endpoint pour gérer les événements Stripe
2. `server/api/cron/check-expired-trials.ts` - Job planifié pour vérifier et mettre à jour les essais expirés
3. `server/utils/subscription-migration.js` - Script pour migrer la base de données vers la nouvelle structure

### Fichiers modifiés
1. `server/api/auth/signup.ts` - Mise à jour pour initialiser les nouveaux champs lors de l'inscription
2. `server/api/auth/login.ts` - Vérification et correction des dates d'essai, mise à jour des statuts
3. `server/api/auth/check-trial.ts` - Nouvelle logique de vérification des essais avec les nouveaux champs
4. `server/api/payment/create-intent.ts` - Ajout du stockage des clients Stripe et du statut de paiement pending
5. `server/api/user/premium-status.ts` - Mise à jour pour gérer les nouveaux statuts d'abonnement
6. `stores/userStore.ts` - Ajout des propriétés et méthodes pour gérer les nouveaux statuts dans le frontend

### Corrections de bugs
1. Correction du problème des dates d'essai futures incorrectes
2. Correction des statuts d'abonnement incohérents entre les sessions
3. Correction de la logique de passage de trial à expired à la fin de la période d'essai
4. Association des clients Stripe aux utilisateurs pour un meilleur suivi des paiements
