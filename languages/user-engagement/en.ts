export default {
  meta: {
    title: 'User Engagement Analysis',
    description: 'Analyze the potential user engagement on your website'
  },
  form: {
    urlLabel: 'URL to analyze',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Enter the complete URL including https://',
    urlRuleInvalid: 'Please enter a valid URL starting with http:// or https://',
    analyzeButton: 'Analyze content',
    analyzeAriaLabel: 'Analyze content'
  },
  results: {
    title: 'Analysis results',
    averageScore: 'Average engagement score',
    avgCtaCount: 'Average CTA count',
    avgInteractiveElements: 'Average interactive elements',
    avgSocialElements: 'Average social elements'
  },
  tabs: {
    engagement: 'Engagement elements',
    issues: 'Detected issues',
    techniques: 'Engagement techniques',
    details: 'Detailed elements'
  },
  engagement: {
    statistics: 'Engagement statistics',
    ctaElements: 'Action calls (CTA)',
    interactiveElements: 'Interactive elements',
    visualElements: 'Visual elements',
    socialElements: 'Social elements',
    detailedScores: 'Detailed scores',
    navigation: 'Navigation',
    readability: 'Readability',
    globalScore: 'Global score'
  },
  issues: {
    title: 'Detected issues',
    noIssues: 'No issues detected',
    description: 'Description:',
    recommendation: 'Recommendation:'
  },
  techniques: {
    title: 'Engagement techniques',
    socialLinks: 'Social links',
    ctaButtons: 'CTA buttons',
    formsInputs: 'Forms or input fields',
    videos: 'Videos',
    images: 'Images',
    interactiveElements: 'Interactive elements',
    feedbackMechanisms: 'Feedback mechanisms'
  },
  detailedElements: {
    ctaTitle: 'CTA Elements',
    ctaText: 'Text',
    ctaType: 'Type',
    ctaLocation: 'Location',
    noCta: 'No CTA elements found',
    socialTitle: 'Social Media Elements',
    socialPlatform: 'Platform',
    socialType: 'Type',
    socialLocation: 'Location',
    noSocial: 'No social media elements found',
    interactiveTitle: 'Interactive Elements',
    interactiveDescription: 'Description',
    interactiveType: 'Type',
    interactiveLocation: 'Location',
    noInteractive: 'No interactive elements details found'
  }
} 