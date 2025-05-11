export default {
  meta: {
    title: "Paiement - StackUnity",
    description: "Complétez votre achat pour accéder aux fonctionnalités premium de StackUnity",
    keywords: "paiement, checkout, StackUnity premium, paiement sécurisé"
  },
  features: {
    advancedTools: {
      title: "Outils de Développement Avancés",
      description: "Accès aux outils et fonctionnalités premium de développement"
    },
    analytics: {
      title: "Outils d'Analyse Premium",
      description: "Accès aux données d'analyse complètes pour votre site web"
    },
    prioritySupport: {
      title: "Support Prioritaire",
      description: "Obtenez un support prioritaire pour toutes vos questions"
    },
    regularUpdates: {
      title: "Mises à Jour Régulières",
      description: "Restez à jour avec les dernières fonctionnalités et améliorations"
    },
    teamCollaboration: {
      title: "Collaboration d'Équipe",
      description: "Travaillez en toute fluidité avec les membres de votre équipe"
    },
    standardTools: {
      title: "Outils de Développement Standard",
      description: "Accès aux outils et fonctionnalités standard de développement"
    },
    basicSupport: {
      title: "Support de Base",
      description: "Obtenez un support de base pour vos questions"
    }
  },
  plans: {
    premium: {
      title: "Premium à Vie",
      description: "Accès illimité à toutes les fonctionnalités premium"
    },
    standard: {
      title: "Standard à Vie",
      description: "Accès aux fonctionnalités standard"
    },
    bestChoice: "Meilleur choix",
    option: {
      standard: "Standard",
      premium: "Premium"
    },
    tooltip: {
      lifetimeAccess: "Accès à vie",
      standardFeatures: "Accès aux fonctionnalités standard",
      premiumFeatures: "Toutes les fonctionnalités premium incluses"
    }
  },
  pricing: {
    htPrice: "Prix HT",
    discount: "Réduction",
    htPriceAfterDiscount: "Prix HT après réduction",
    vat: "TVA",
    totalTTC: "Total TTC",
    oneTimePayment: "Paiement unique, accès à vie",
    youSave: "Vous économisez",
    saveVsMonthly: "Économisez 100% vs mensuel"
  },
  vatInfo: {
    selfAssessment: "TVA non applicable, Art. 283-2 du CGI - Auto-liquidation de la TVA",
    vatNumber: "Numéro de TVA",
    exportOutsideEU: "Export hors UE - TVA non applicable"
  },
  benefits: {
    premiumTitle: "Fonctionnalités Premium",
    standardTitle: "Fonctionnalités Standard",
    premium: [
      "Accès illimité à toutes les fonctionnalités premium",
      "Support et mises à jour prioritaires",
      "Outils d'analyse SEO avancés",
      "Outils de développement personnalisés",
      "Fonctionnalités de collaboration d'équipe",
      "Pas de frais récurrents - payez une fois, utilisez pour toujours"
    ],
    standard: [
      "Accès aux fonctionnalités standard",
      "Mises à jour régulières",
      "Support de base",
      "Fonctionnalités de collaboration d'équipe"
    ]
  },
  payment: {
    paymentInformation: "Informations de paiement",
    billingCountry: "Pays de facturation",
    businessCustomer: "J'achète pour une entreprise",
    vatNumber: {
      label: "Numéro de TVA (pour les entreprises de l'UE)",
      placeholder: "ex. FR12345678901",
      hint: "Entrez votre numéro de TVA pour appliquer l'auto-liquidation si éligible"
    },
    promoCode: {
      label: "Code promo",
      placeholder: "Entrez votre code promo",
      success: "Code promo appliqué",
      error: "Code promo invalide ou déjà utilisé"
    },
    cardholderName: {
      label: "Nom du titulaire",
      placeholder: "Nom sur la carte"
    },
    payButton: "Payer",
    securePayment: "Paiement sécurisé via Stripe"
  },
  messages: {
    vatReverseCharge: "Auto-liquidation de TVA appliquée (0% de TVA)",
    taxCalculationError: "Échec du calcul des taxes",
    paymentConfigError: "Erreur de configuration du paiement. Veuillez contacter le support.",
    stripeUnavailable: "Système de paiement indisponible. Veuillez réessayer plus tard.",
    initError: "Erreur d'initialisation du formulaire de paiement. Veuillez rafraîchir la page.",
    stripeConnectionError: "Impossible de se connecter à Stripe. Veuillez réessayer.",
    paymentSuccess: "Paiement réussi ! Accès premium activé et facture envoyée à votre email.",
    invoiceError: "Paiement réussi, mais échec de la génération de la facture. Contactez le support si nécessaire.",
    postPaymentError: "Paiement réussi mais certaines opérations post-paiement ont échoué. Veuillez rafraîchir votre page.",
    premiumUpdateError: "Paiement réussi mais échec de la mise à jour du statut premium. Veuillez rafraîchir la page.",
    reloginRequired: "Votre statut premium a été mis à jour. Veuillez vous reconnecter pour accéder à vos fonctionnalités premium."
  },
  testimonials: {
    premium: {
      text: "StackUnity a complètement transformé mon workflow de développement. L'investissement en vaut vraiment la peine!",
      author: "Nûr D. - Développeur Full Stack"
    }
  }
} 