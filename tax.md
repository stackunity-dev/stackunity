. Tu vends à des clients en France (particuliers ou pros)
Clients particuliers en France : Oui, tu dois appliquer la TVA si tu es assujetti à la TVA (c’est-à-dire si tu n'es plus en franchise en base de TVA).

Clients professionnels en France (avec ou sans TVA) : Oui, tu appliques la TVA normalement.

2. Tu vends à des clients dans l’UE (hors France)
Clients professionnels avec un numéro de TVA valide : Non, pas de TVA sur la facture (c’est le mécanisme d’autoliquidation).

Tu dois mentionner sur la facture :
"Exonération de TVA, article 283-2 du CGI – autoliquidation par le preneur"
ou l’équivalent dans la langue du client.

Clients particuliers dans l’UE : Oui, tu dois appliquer la TVA française, sauf si tu dépasses un certain seuil de vente à distance par pays, auquel cas tu deviens redevable de la TVA locale (et il faut s’enregistrer via le Guichet unique OSS).

3. Tu vends hors UE
Dans la majorité des cas : pas de TVA (exportation exonérée).

Et si tu es en micro-entreprise avec franchise en base de TVA ?
Dans ce cas, même si tu as un numéro de TVA intracommunautaire (souvent obligatoire pour vendre à l’étranger), tu ne collectes pas la TVA.

Tu dois juste mentionner sur tes factures :

"TVA non applicable, article 293 B du CGI"

Si tu veux me donner plus de détails (type d’activité, statut, à qui tu vends, etc.), je peux te répondre plus précisément !







Vous avez dit :
stripe a des client sque je ne connais pas


ChatGPT a dit :
Ok, si tu passes par Stripe pour recevoir des paiements et que tu as des clients que tu ne connais pas directement (par exemple, vente de services ou produits via une plateforme, abonnement SaaS, etc.), la question de la TVA dépend du type de clients (particuliers ou professionnels) et de leur localisation.

Voici ce que tu dois vérifier pour chaque vente via Stripe :
🔍 1. Est-ce un particulier ou une entreprise ?
Si le client est un particulier (pas de numéro de TVA fourni) → TVA à appliquer (sauf si hors UE).

Si c’est une entreprise avec un numéro de TVA valide → pas de TVA (autoliquidation dans l’UE).

🌍 2. Dans quel pays est le client ?
Type de client	En France	UE (hors France)	Hors UE
Particulier	TVA FR	TVA FR (ou OSS si tu dépasses les seuils)	Pas de TVA
Pro avec TVA	TVA FR	Pas de TVA (autoliquidation)	Pas de TVA
✅ Ce que tu peux faire concrètement avec Stripe :
Activer la collecte de TVA automatique avec Stripe Tax (si tu veux que Stripe détecte la TVA à appliquer en fonction du client).

Sinon, gérer la TVA toi-même :

Demander le pays du client.

Savoir s’il est pro ou particulier.

Vérifier son numéro de TVA intracommunautaire via VIES.

Appliquer ou non la TVA selon les règles ci-dessus.

🧾 Et sur la facture ?
Si tu appliques la TVA → indique le taux et le montant.

Si tu n’appliques pas la TVA car autoliquidation → mentionne :

"Exonération de TVA – article 283-2 du CGI – autoliquidation par le preneur"

Si tu es en franchise en base de TVA →

"TVA non applicable – article 293 B du CGI"

Tu veux que je t’aide à définir les règles de TVA pour ton cas précis (type de service, type de clients que tu vises avec ton SaaS) ? Je peux aussi t’aider à configurer la logique TVA dans Stripe ou dans ton backend si tu préfères gérer ça toi-même.







Vous avez dit :
ok comment configurer stripe tax


ChatGPT a dit :
Parfait, si tu veux automatiser la gestion de la TVA (et autres taxes comme la sales tax aux US) via Stripe Tax, c’est une super idée pour ton projet SaaS !

Voici un guide simple et clair pour configurer Stripe Tax pas à pas :

✅ Étape 1 : Activer Stripe Tax
Connecte-toi à ton dashboard Stripe.

Va dans Settings (Paramètres) > Tax and Compliance > clique sur Stripe Tax.

Clique sur "Get started" pour activer Stripe Tax.

✅ Étape 2 : Définir les pays où tu es enregistré pour la TVA
Dans le menu Tax > Registrations, indique les pays où tu es enregistré à la TVA (ex: France).

Stripe te demandera :

Ton numéro de TVA (ex : FR...).

Depuis quand tu es redevable.

Adresse de ton établissement.

💡 Tu peux aussi ajouter d'autres pays si un jour tu t’enregistres ailleurs (ex : via OSS ou ventes fréquentes dans un autre pays).

✅ Étape 3 : Configurer Stripe pour calculer la TVA automatiquement
a) Via les “Products” dans Stripe :
Crée ou modifie un Produit dans Stripe.

Active “Automatic Tax” dans les paramètres du produit.

b) Ou dans ton code avec l'API (si tu factures via code) :
Tu dois passer le paramètre automatic_tax: { enabled: true } dans tes appels à l’API Checkout Session ou PaymentIntent.

Exemple avec Checkout Session :

js
Copier
Modifier
const session = await stripe.checkout.sessions.create({
  mode: 'subscription', // ou 'payment'
  line_items: [{ price: 'price_XXXX', quantity: 1 }],
  customer: 'cus_XXXX',
  automatic_tax: { enabled: true },
  success_url: 'https://tonsite.com/success',
  cancel_url: 'https://tonsite.com/cancel',
});
✅ Étape 4 : Collecter les infos de ton client
Stripe Tax fonctionne mieux si :

Tu demandes à l'utilisateur son pays.

Tu récupères son code postal.

S’il est professionnel, tu peux demander son numéro de TVA intracommunautaire (Stripe peut le valider automatiquement via VIES).

✅ Étape 5 : Afficher la TVA sur la facture / reçu
Stripe gère ça automatiquement si :

Tu utilises Stripe Invoicing ou Checkout.

Tu actives Stripe Tax.

Sinon, si tu génères tes factures toi-même, il faudra que tu affiches :

Le montant HT

Le taux de TVA appliqué

Le montant de TVA

Les mentions légales éventuelles

✅ Étape 6 : Déclarer la TVA collectée
Stripe fournit un rapport de taxes collectées par pays dans :

Tax > Reports

Tu peux l'utiliser pour ta déclaration trimestrielle ou mensuelle (en France via ton espace impots.gouv).

Si tu veux, je peux t’aider à :

Configurer Stripe Checkout ou Billing avec TVA automatique dans ton code

Créer un petit système pour demander le numéro de TVA au client

Ou même faire un tableau logique avec les cas (France, UE, hors UE)

Tu utilises quoi pour ton système de paiement actuellement ? Stripe Checkout ? API directe ? Autre ?