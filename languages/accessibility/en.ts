export default {
  meta: {
    title: 'Accessibility - StackUnity',
    description: 'Accessibility tools for web developers'
  },
  contrastChecker: {
    title: 'Contrast Checker',
    textColor: 'Text color',
    backgroundColor: 'Background color',
    colorHint: 'Supports hex, rgb, hsl or color names',
    calculateButton: 'Calculate contrast',
    preview: {
      title: 'Contrast Preview',
      normalText: 'Normal Text (16px)',
      largeText: 'Large Text (18px+)',
      boldText: 'Bold Text',
      italicText: 'Italic Text',
      linkExample: 'Link Example'
    },
    results: {
      contrastRatio: 'Contrast Ratio',
      insufficientContrast: 'Insufficient Contrast',
      acceptableContrast: 'Acceptable Contrast',
      excellentContrast: 'Excellent Contrast',
      normalTextRequirement: 'Normal Text (min. 4.5:1)',
      largeTextRequirement: 'Large Text (min. 3:1)',
      insufficientMessage: 'The contrast is insufficient for good readability. Try more contrasting colors.',
      successMessage: 'Congratulations! Your colors meet contrast standards for an accessible site.',
      wcagAA: 'WCAG 2.1 AA Standard',
      wcagAAA: 'WCAG 2.1 AAA Standard'
    }
  },
  visionSimulator: {
    title: 'Visual Impairment Simulator',
    urlLabel: 'URL of the site to simulate',
    urlHint: 'Enter the complete URL (https://...)',
    visionTypeLabel: 'Type of visual impairment',
    intensityLabel: 'Intensity of the filter',
    loading: 'Loading...',
    enterUrl: 'Enter an URL to start',
    limitedAccess: {
      title: 'Limited access',
      description: 'Upgrade to the premium version to access all types of visual impairments.',
      upgradeButton: 'Upgrade'
    },
    visionTypes: {
      normal: 'Normal vision',
      protanopia: 'Protanopia (Red-Green)',
      deuteranopia: 'Deuteranopia (Red-Green)',
      tritanopia: 'Tritanopia (Blue-Yellow)',
      achromatopsia: 'Achromatopsia (Black and White)',
      blur: 'Blur'
    },
    fullscreenControls: {
      exitFullscreen: 'Exit fullscreen',
      refreshPage: 'Refresh page',
      visionType: 'Vision type',
      otherTypes: 'Other types (Standard)'
    },
    alerts: {
      invalidUrl: 'Please enter a valid URL',
      accessAlert: 'This simulation is only available for standard users. Upgrade to the standard version to access all types of visual impairments.'
    }
  }
} 