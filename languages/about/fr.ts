export default {
  meta: {
    title: 'À propos & Contact - StackUnity',
    description: 'En savoir plus sur StackUnity et contactez notre équipe pour toute question ou assistance.',
    keywords: 'StackUnity, à propos, contact, mission, valeurs, développement web, équipe, support, développeurs, accessibilité',
    author: 'StackUnity'
  },
  nav: {
    backToHome: 'Retour à la page d\'accueil'
  },
  about: {
    title: 'À propos de StackUnity',
    subtitle: 'Votre boîte à outils de développement tout-en-un',
    mission: {
      title: 'Notre Mission',
      content: 'Chez StackUnity, notre mission est de donner aux développeurs les moyens de créer des applications web exceptionnelles, tout en réduisant la complexité et le temps de développement. Nous croyons que le développement web devrait être accessible à tous, des débutants aux experts, et que les bons outils peuvent faire toute la différence dans la qualité et l\'efficacité du travail d\'un développeur.'
    },
    quote: {
      content: "Notre vision est de créer un écosystème où chaque développeur peut facilement transformer ses idées en applications web fonctionnelles, belles et performantes, sans avoir à maîtriser une multitude d'outils différents.",
      author: "Nûr Djedidi, Fondateur"
    },
    team: {
      title: 'Notre Équipe',
      content: 'Nous sommes une équipe passionnée de développeurs, designers et passionnés de technologie déterminés à créer des solutions intuitives et efficaces pour la communauté des développeurs. Nos parcours et expertises diversifiés nous permettent de comprendre les défis auxquels sont confrontés les développeurs modernes.'
    },
    values: {
      title: 'Nos Valeurs',
      items: [
        {
          title: 'Innovation',
          content: 'Nous recherchons constamment de nouvelles façons d\'améliorer notre plateforme et d\'offrir plus de valeur à nos utilisateurs.',
          icon: 'mdi-lightbulb-on',
          color: 'info'
        },
        {
          title: 'Simplicité',
          content: 'Nous croyons que les meilleurs outils sont ceux qui sont faciles à utiliser, tout en étant puissants et flexibles.',
          icon: 'mdi-leaf',
          color: 'success'
        },
        {
          title: 'Excellence',
          content: 'Nous nous efforçons de fournir des outils de la plus haute qualité, fiables et performants pour nos utilisateurs.',
          icon: 'mdi-trophy',
          color: 'warning'
        },
        {
          title: 'Communauté',
          content: 'Nous valorisons la collaboration et le soutien mutuel au sein de notre communauté de développeurs.',
          icon: 'mdi-account-group',
          color: 'primary'
        }
      ]
    },
    getInTouch: {
      title: 'Contactez-nous',
      content: 'Vous avez des questions sur StackUnity ou souhaitez en savoir plus sur notre entreprise ? N\'hésitez pas à nous contacter.',
      button: 'Contactez-nous'
    }
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Nous sommes toujours heureux d\'entendre vos questions, commentaires ou suggestions. Remplissez le formulaire ci-dessous et nous vous répondrons dès que possible.',
    form: {
      name: 'Votre nom',
      email: 'Votre e-mail',
      subject: 'Sujet',
      subjects: {
        general: 'Question générale',
        technical: 'Support technique',
        feature: 'Demande de fonctionnalité',
        bug: 'Signalement de bug',
        partnership: 'Partenariat',
        other: 'Autre',
      },
      message: 'Votre message',
      submit: 'Envoyer le message',
      sending: 'Envoi en cours...',
      successTitle: 'Message envoyé !',
      successMessage: 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.',
      errorTitle: 'Erreur',
      errorMessage: 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.',
      required: 'Champ obligatoire',
      invalidEmail: 'Veuillez saisir une adresse e-mail valide',
      fillAllFields: 'Veuillez remplir tous les champs.'
    },
    info: {
      title: 'Autres moyens de nous contacter',
      email: {
        title: 'Contactez-nous par e-mail',
        content: 'Pour les demandes générales : hello@stackunity.com',
        support: 'Pour le support technique : support@stackunity.com'
      },
      social: {
        title: 'Réseaux sociaux',
        content: 'Suivez-nous sur les réseaux sociaux pour les mises à jour, conseils et plus encore.'
      },
      office: {
        title: 'Notre Bureau',
        content: 'StackUnity HQ, 123 Tech Avenue, San Francisco, CA 94107'
      }
    },
    faq: {
      title: 'Questions fréquemment posées',
      questions: [
        {
          question: 'Qu\'est-ce que StackUnity ?',
          answer: 'StackUnity est une boîte à outils complète pour le développement web qui fournit une gamme d\'utilitaires pour les développeurs web, incluant les tests d\'API, la conception de bases de données, la validation d\'accessibilité, et plus encore.'
        },
        {
          question: 'Comment démarrer avec StackUnity ?',
          answer: 'Créez simplement un compte gratuit et vous pourrez immédiatement commencer à utiliser nos outils de base. Pour accéder aux fonctionnalités premium, consultez nos options d\'abonnement.'
        },
        {
          question: 'Y a-t-il un plan gratuit disponible ?',
          answer: 'Oui, StackUnity offre un niveau gratuit qui inclut les fonctionnalités de base. Les fonctionnalités premium sont disponibles via nos forfaits d\'abonnement payants.'
        },
        {
          question: 'Comment puis-je signaler un problème ou suggérer une fonctionnalité ?',
          answer: 'Vous pouvez soumettre des problèmes ou des demandes de fonctionnalités via notre formulaire de contact ou en envoyant un e-mail à support@stackunity.com.'
        }
      ]
    }
  },
  footer: {
    copyright: "Tous droits réservés."
  }
} 