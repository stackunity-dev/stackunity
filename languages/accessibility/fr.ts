export default {
  meta: {
    title: 'Accessibilité - StackUnity',
    description: 'Outils d\'accessibilité pour les développeurs web'
  },
  contrastChecker: {
    title: 'Vérificateur de Contraste',
    textColor: 'Couleur du texte',
    backgroundColor: 'Couleur d\'arrière-plan',
    colorHint: 'Supporte hex, rgb, hsl ou noms de couleurs',
    calculateButton: 'Calculer le contraste',
    preview: {
      title: 'Aperçu du Contraste',
      normalText: 'Texte Normal (16px)',
      largeText: 'Grand Texte (18px+)',
      boldText: 'Texte en Gras',
      italicText: 'Texte en Italique',
      linkExample: 'Exemple de Lien'
    },
    results: {
      contrastRatio: 'Ratio de Contraste',
      insufficientContrast: 'Contraste Insuffisant',
      acceptableContrast: 'Contraste Acceptable',
      excellentContrast: 'Excellent Contraste',
      normalTextRequirement: 'Texte Normal (min. 4.5:1)',
      largeTextRequirement: 'Grand Texte (min. 3:1)',
      insufficientMessage: 'Le contraste est insuffisant pour une bonne lisibilité. Essayez des couleurs plus contrastées.',
      successMessage: 'Félicitations ! Vos couleurs respectent les normes de contraste pour un site accessible.',
      wcagAA: 'Norme WCAG 2.1 AA',
      wcagAAA: 'Norme WCAG 2.1 AAA'
    }
  },
  visionSimulator: {
    title: 'Simulateur de Déficience Visuelle',
    urlLabel: 'URL du site à simuler',
    urlHint: 'Entrez l\'URL complète (https://...)',
    visionTypeLabel: 'Type de déficience visuelle',
    intensityLabel: 'Intensité du filtre',
    loading: 'Chargement...',
    enterUrl: 'Entrez une URL pour commencer',
    limitedAccess: {
      title: 'Accès limité',
      description: 'Passez à la version premium pour accéder à tous les types de déficiences visuelles.',
      upgradeButton: 'Mettre à niveau'
    },
    visionTypes: {
      normal: 'Vision normale',
      protanopia: 'Protanopie (Rouge-Vert)',
      deuteranopia: 'Deutéranopie (Rouge-Vert)',
      tritanopia: 'Tritanopie (Bleu-Jaune)',
      achromatopsia: 'Achromatopsie (Noir et Blanc)',
      blur: 'Flou'
    },
    fullscreenControls: {
      exitFullscreen: 'Quitter le mode plein écran',
      refreshPage: 'Actualiser la page',
      visionType: 'Type de vision',
      otherTypes: 'Autres types (Standard)'
    },
    alerts: {
      invalidUrl: 'Veuillez entrer une URL valide',
      accessAlert: 'Cette simulation est uniquement disponible pour les utilisateurs standard. Passez à la version standard pour accéder à tous les types de déficiences visuelles.'
    }
  }
} 