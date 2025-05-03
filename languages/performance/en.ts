export default {
  meta: {
    title: 'Website Performance Analysis - StackUnity',
    description: 'Analyze the loading speed and performance metrics of your website'
  },
  page: {
    title: 'Website Performance Analysis',
    subtitle: 'Analyze the loading speed and performance metrics of your website'
  },
  form: {
    urlLabel: 'URL to analyze',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Enter the complete URL including https://',
    urlRule: 'Please enter a valid URL starting with http:// or https://',
    analyzeButton: 'Analyze performance'
  },
  loading: {
    text: 'Loading analysis results'
  },
  results: {
    title: 'Performance Analysis Results',
    averageScore: 'Average Performance Score',
    scoreLabel: 'Score: {score}%',
    metrics: {
      title: 'Core Metrics',
      loadingMetrics: 'Loading Metrics',
      scoreBreakdown: 'Performance Score Breakdown',
      firstContentfulPaint: {
        title: 'First Contentful Paint',
        short: 'FCP',
        description: 'Time until the browser renders the first piece of content'
      },
      largestContentfulPaint: {
        title: 'Largest Contentful Paint',
        short: 'LCP',
        description: 'Time until the largest content element is rendered'
      },
      speedIndex: {
        title: 'Speed Index',
        short: 'SI',
        description: 'How quickly content is visually displayed during page load'
      },
      totalBlockingTime: {
        title: 'Total Blocking Time',
        short: 'TBT',
        description: 'Sum of time where the main thread was blocked'
      },
      cumulativeLayoutShift: {
        title: 'Cumulative Layout Shift',
        short: 'CLS',
        description: 'Measure of visual stability during page load'
      },
      timeToInteractive: {
        title: 'Time to Interactive',
        short: 'TTI',
        description: 'Time until the page becomes fully interactive'
      }
    },
    resources: {
      title: 'Resources',
      networkRequests: 'Network Requests',
      resourceSizes: 'Resource Sizes',
      resourceTypes: 'Resource Types',
      requestCount: 'Request Count:',
      totalSize: 'Total Size:',
      transferSize: 'Transfer Size:',
      contentType: 'Content Type',
      size: 'Size',
      transferTime: 'Transfer Time'
    },
    optimization: {
      title: 'Optimization',
      opportunities: 'Optimization Opportunities',
      diagnostics: 'Performance Diagnostics',
      passed: 'Passed Audits',
      wastefulResizing: 'Images with inefficient encoding or sizing',
      uncompressedImages: 'Efficiently encode images',
      unusedJavascript: 'Remove unused JavaScript',
      unusedCss: 'Remove unused CSS',
      preconnectOrigins: 'Preconnect to required origins',
      thirdParty: 'Reduce impact of third-party code',
      fontDisplay: 'Ensure text remains visible during webfont load',
      potential: 'Potential savings:'
    },
    scoreIntervals: {
      excellent: 'Excellent',
      needsImprovement: 'Needs improvement',
      poor: 'Poor',
      excellentRange: '90-100: Excellent',
      improvementRange: '50-89: Needs improvement',
      poorRange: '0-49: Poor'
    }
  },
  tabs: {
    metrics: 'Core Metrics',
    resources: 'Resources',
    optimization: 'Optimization'
  },
  summary: {
    title: 'Performance Summary',
    baselineMetrics: 'Baseline Metrics',
    optimizationScore: 'Optimization Score:',
    resourceEfficiency: 'Resource Efficiency:',
    loadingSpeed: 'Loading Speed:',
    userExperience: 'User Experience:'
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