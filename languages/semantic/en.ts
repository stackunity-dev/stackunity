export default {
  meta: {
    title: 'Semantic Analysis - StackUnity',
    description: 'Analyze the semantic structure of your website, evaluate HTML, ARIA, and meta tags'
  },
  page: {
    title: 'Semantic Analysis',
    subtitle: 'Analyze the semantic structure of your website'
  },
  form: {
    urlLabel: 'URL to analyze',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Enter the complete URL including https://',
    urlRule: 'Please enter a valid URL starting with http:// or https://',
    analyzeButton: 'Analyze content'
  },
  loading: {
    text: 'Loading analysis results'
  },
  results: {
    title: 'Analysis Results',
    averageScore: 'Average Score',
    scoreLabel: 'Score: {score}%',
    html: {
      title: 'HTML Structure',
      score: 'HTML structure score: {score}%',
      elements: 'HTML structure elements'
    },
    aria: {
      title: 'Accessibility ARIA',
      score: 'ARIA score: {score}%',
      missingAttributes: 'Missing ARIA attributes',
      missingLabels: 'Missing labels',
      formElementsWithLabels: 'Form elements with labels',
      missingAriaCount: 'Missing ARIA attributes count',
      invalidAriaCount: 'Invalid ARIA attributes',
      interactiveElementsWithAria: 'Interactive elements with ARIA',
      totalInteractiveElements: 'Total interactive elements',
      elementsToCompleteWithAria: 'Elements to complete with ARIA'
    },
    meta: {
      title: 'Meta-tags',
      score: 'Meta-tags score: {score}%',
      requiredTags: 'Required meta tags',
      presentCount: 'Present: {count}',
      missingCount: 'Missing: {count}',
      availableTags: 'Available meta tags',
      detailedScore: 'Detailed meta tags score',
      essentialTags: 'Essential meta tags',
      socialTags: 'Social meta tags',
      technicalTags: 'Technical meta tags',
      contentTags: 'Content meta tags',
      socialSharingTags: 'Social sharing meta tags',
      htmlCodeOfMetaTags: 'HTML code of meta tags',
      detectedIssues: 'Detected issues'
    },
    readability: {
      title: 'Readability Analysis',
      score: 'Score:',
      grade: 'Grade:',
      words: 'Words:',
      sentences: 'Sentences:'
    },
    headings: {
      title: 'Heading Structure',
      structure: 'Page heading structure'
    },
    headingStructure: {
      title: 'Heading Structure'
    }
  },
  tabs: {
    htmlStructure: 'HTML Structure',
    accessibilityAria: 'Accessibility ARIA',
    metaTags: 'Meta-tags'
  },
  categories: {
    html: 'HTML',
    aria: 'ARIA',
    meta: 'META'
  },
  elementTitles: {
    doctype: 'DOCTYPE',
    html: 'HTML tag',
    head: 'HEAD tag',
    title: 'TITLE tag',
    body: 'BODY tag',
    header: 'HEADER tag',
    main: 'MAIN tag',
    footer: 'FOOTER tag',
    navigation: 'Navigation',
    headings: 'Headings',
    semanticElements: 'Semantic elements',
    lists: 'Lists',
    images: 'Images',
    links: 'Links',
    tables: 'Tables',
    forms: 'Forms'
  },
  suggestions: {
    title: 'Improvement Suggestions',
    htmlSuggestions: 'HTML Structure Suggestions',
    ariaSuggestions: 'ARIA Suggestions',
    metaSuggestions: 'Meta Tags Suggestions',
    noSuggestions: 'No suggestions available. Your website is well structured!'
  },
  export: {
    title: 'Export Results',
    pdf: 'Export as PDF',
    csv: 'Export as CSV',
    json: 'Export as JSON'
  },
  error: {
    title: 'Error',
    message: 'Failed to analyze URL. Please check the URL and try again.',
    retry: 'Retry'
  }
} 