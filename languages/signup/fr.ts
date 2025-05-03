export default {
  meta: {
    title: 'Créer un compte - StackUnity',
    description: 'Créez votre compte StackUnity pour accéder à toutes les fonctionnalités et commencer votre expérience'
  },
  hero: {
    title: 'StackUnity - Développez plus rapidement et mieux avec StackUnity',
  },
  form: {
    title: "Créer un compte",
    subtitle: "Rejoignez StackUnity et commencez votre expérience",
    username: {
      label: "Nom d'utilisateur",
      required: "Nom d'utilisateur requis"
    },
    email: {
      label: "Adresse email",
      required: "Email requis",
      invalid: "Format d'email invalide"
    },
    password: {
      label: "Mot de passe",
      required: "Mot de passe requis",
      minLength: "Le mot de passe doit contenir au moins 8 caractères"
    },
    submit: "Créer un compte"
  },
  features: [
    {
      title: "Modèles professionnels",
      description: "Un studio avec des modèles de composants Vuetify personnalisés"
    },
    {
      title: "Analyses détaillées",
      description: "Audit d'accessibilité et de référencement, testez tous les aspects de votre site"
    },
    {
      title: "Surveillance et générateur SQL",
      description: "Surveillance de site et générateur SQL prêt à l'emploi"
    },
    {
      title: "Interface épurée",
      description: "Une interface simple et intuitive pour une utilisation plus facile"
    }
  ],
  createAccount: {
    question: "Vous avez déjà un compte ?",
    action: "Connexion"
  }
} 