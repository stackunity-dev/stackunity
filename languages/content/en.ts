export default {
  meta: {
    title: 'Content Analysis - StackUnity',
    description: 'Analyze the structure and quality of your web pages to improve your SEO'
  },
  page: {
    title: 'Content Analysis',
    subtitle: 'Analyze the structure and quality of your web pages to improve your SEO'
  },
  form: {
    urlLabel: 'URL of the site to analyze',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Enter the complete URL including https://',
    urlRule: 'Please enter a valid URL starting with http:// or https://',
    crawlEnabled: 'Analyze also linked pages',
    crawlHint: 'Limit: 10 URLs maximum',
    analyzeButton: 'Analyze content'
  },
  loading: {
    text: 'Analyze in progress'
  },
  averageScore: {
    title: 'Average content score',
    calculated: 'Average score calculated from {count} analyzed pages',
    exportButton: 'Export'
  },
  contentScore: {
    title: 'Content score',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    critical: 'Critical'
  },
  improvement: {
    title: 'Improvement priority',
    lowestScore: 'The page with the lowest score ({score}%) is',
    openInNew: 'Open in new tab'
  },
  trends: {
    improving: 'Improving',
    declining: 'Declining',
    stable: 'Stable',
    tooltipImproving: 'Content quality is improving across pages',
    tooltipDeclining: 'Content quality is declining across pages',
    tooltipStable: 'Content quality is consistent across pages'
  },
  statistics: {
    title: 'Content statistics',
    wordCount: 'Number of words',
    readabilityScore: 'Readability score',
    headingsDetected: 'Headings detected',
    links: 'Links',
    internal: 'Internal',
    external: 'External'
  },
  readability: {
    veryEasy: 'Very easy',
    easy: 'Easy',
    fairlyEasy: 'Fairly easy',
    standard: 'Standard',
    fairlyDifficult: 'Fairly difficult',
    difficult: 'Difficult',
    veryDifficult: 'Very difficult'
  },
  wordCount: {
    tooShort: 'Too short',
    short: 'Short',
    good: 'Good',
    excellent: 'Excellent'
  },
  headings: {
    title: 'Heading structure',
    noHeadings: 'No headings (H1-H6) detected on this page.'
  },
  issues: {
    title: 'Detected issues',
    noIssues: 'No major issues detected in the content.',
    missingH1: 'Missing H1 heading',
    multipleH1: 'Multiple H1 headings',
    shortContent: 'Content is too short',
    poorReadability: 'Poor readability score',
    lowKeywordDensity: 'Low keyword density',
    missingAltText: 'Images missing alt text',
    brokenHeadingStructure: 'Broken heading structure',
    lowWordCount: 'Low word count',
    duplicateTitle: 'Duplicate title and H1',
    noExternalLinks: 'No external links',
    tooManyLinks: 'Too many links',
    lowTextToHtmlRatio: 'Low text-to-HTML ratio'
  },
  images: {
    title: 'Images Analysis',
    preview: 'Image preview',
    altText: 'Alt text',
    missingAlt: 'Missing alt text',
    hasAlt: 'Alt text present',
    dimensions: 'Dimensions',
    hasDimensions: 'Optimized',
    noDimensions: 'No dimensions'
  },
  keywords: {
    title: 'Keyword Analysis',
    topKeywords: 'Top keywords',
    density: 'Density',
    optimal: 'Optimal',
    tooLow: 'Too low',
    tooHigh: 'Too high',
    noKeywords: 'No significant keywords detected'
  },
  seo: {
    title: 'SEO Elements',
    metaTitle: 'Meta Title',
    metaDescription: 'Meta Description',
    canonical: 'Canonical URL',
    og: 'Open Graph Tags',
    missingElement: 'Missing',
    tooShort: 'Too short',
    tooLong: 'Too long',
    good: 'Good'
  },
  recommendations: {
    title: 'Recommendations',
    excellentQuality: {
      title: 'Excellent content quality',
      description: 'Your content is well-structured and optimized for SEO. Keep up the good work!'
    },
    improveContent: {
      title: 'How to improve your content',
      addMoreContent: {
        title: 'Add more content',
        description: 'Your content has {count} words. Consider expanding it to at least 800-1000 words for better SEO performance.'
      },
      addH1: {
        title: 'Add an H1 heading',
        description: 'Each page should have exactly one H1 heading that describes the content of the page.'
      },
      multipleH1: {
        title: 'Use only one H1 heading',
        description: 'Your page has {count} H1 headings. For better SEO, use exactly one H1 and structure the other headings with H2-H6.'
      },
      addH2: {
        title: 'Add H2 headings',
        description: 'Use H2 headings to divide your content into logical sections for better readability and SEO.'
      },
      addAltText: {
        title: 'Add alt text to images',
        description: '{count} images missing alt text. Add descriptive alt text to all images for better accessibility and SEO.'
      },
      improveReadability: {
        title: 'Improve readability',
        description: 'Your content has a readability score of {score}. Try using shorter sentences and simpler language.'
      },
      addInternalLinks: {
        title: 'Add internal links',
        description: 'Add links to other relevant pages on your site to improve navigation and SEO.'
      },
      addExternalLinks: {
        title: 'Add external links',
        description: 'Create links to external authority sources to increase credibility and SEO value.'
      },
      generalImprovements: {
        title: 'General improvements',
        description: '- Use more varied and engaging language\n- Add multimedia elements (images, videos, infographics)\n- Include specific examples and data to support your points\n- Structure the content with clear introductions and conclusions'
      }
    },
    seoTips: {
      title: 'SEO tips',
      useKeywords: {
        title: 'Use target keywords',
        description: 'Use target keywords in the title, meta description, and content.'
      },
      addAltText: {
        title: 'Add alt text to images',
        description: '{count} images missing alt text. Add descriptive alt text to all images for better accessibility and SEO.'
      },
      addH2: {
        title: 'Add H2 headings',
        description: 'Use H2 headings to divide your content into logical sections for better readability and SEO.'
      },
      addH1: {
        title: 'Add an H1 heading',
        description: 'Each page should have exactly one H1 heading that describes the content of the page.'
      },
      addMoreContent: {
        title: 'Add more content',
        description: 'Your content has {count} words. Consider expanding it to at least 800-1000 words for better SEO performance.'
      },
      addExternalLinks: {
        title: 'Add external links',
        description: 'Create links to external authority sources to increase credibility and SEO value.'
      },
      addInternalLinks: {
        title: 'Add internal links',
        description: 'Add links to other relevant pages on your site to improve navigation and SEO.'
      },
      generalImprovements: {
        title: 'General improvements',
        description: '- Use more varied and engaging language\n- Add multimedia elements (images, videos, infographics)\n- Include specific examples and data to support your points\n- Structure the content with clear introductions and conclusions'
      },
      optimizeMeta: {
        title: 'Optimize meta description',
        description: 'Create a compelling meta description (150-160 characters) that includes your target keywords.'
      },
      improveSpeed: {
        title: 'Improve page speed',
        description: 'Optimize images, reduce scripts, and use browser caching to improve loading times.'
      },
      mobileOptimization: {
        title: 'Mobile optimization',
        description: 'Ensure your page is fully responsive and offers a good user experience on mobile devices.'
      },
      useSchema: {
        title: 'Use schema',
        description: 'Use schema.org markup to describe your content to help search engines understand and increase click-through rates in search results.'
      }
    }
  },
  error: {
    title: 'Error',
    message: 'Failed to analyze URL. Please check the URL and try again.',
    retry: 'Retry'
  }
} 