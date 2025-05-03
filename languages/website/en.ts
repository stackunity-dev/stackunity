export default {
  meta: {
    title: 'Website Analysis',
    description: 'Analyze your website performance, security, and SEO'
  },
  alerts: {
    noWebsiteData: 'No website data available for this account. Please add a website to your account below.',
    addWebsite: 'Add website'
  },
  loading: {
    progress: '{value}%'
  },
  cards: {
    websiteData: {
      title: 'Website data',
      mainUrl: 'Main URL',
      urlsDetected: '{count} URL{plural} detected',
      socialMedia: 'Social media preview',
      socialUnavailable: 'Social media metadata not available',
      generatedSitemap: 'Generated Sitemap',
      copySitemap: 'Copy Sitemap',
      showLess: 'Show less',
      showMore: 'Show {count} more'
    },
    analysis: {
      title: 'Website Analysis',
      description: 'Run a complete analysis of your website to get insights on performance, security, and more.',
      startAnalysis: 'Start Analysis'
    },
    metrics: {
      title: 'SSUC metrics',
      averageOf: 'Average of {count} URLs',
      performance: 'Performance',
      seo: 'SEO',
      security: 'Security',
      usability: 'Usability',
      tooltips: {
        fcp: 'First Contentful Paint',
        lcp: 'Largest Contentful Paint',
        cls: 'Cumulative Layout Shift'
      }
    },
    technical: {
      title: 'Technical Analysis',
      robotsTxt: 'Robots.txt',
      sitemap: 'Sitemap',
      ssl: 'SSL Certificate',
      responsiveness: 'Responsive Design',
      headers: 'HTTP Headers',
      mobileFriendly: 'Mobile Friendly',
      found: 'Found',
      notFound: 'Not Found',
      valid: 'Valid',
      invalid: 'Invalid',
      enabled: 'Enabled',
      disabled: 'Disabled',
      secure: 'Secure',
      notSecure: 'Not Secure'
    }
  },
  issues: {
    title: 'Detected Issues',
    severity: {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      info: 'Info'
    },
    noIssues: 'No issues detected',
    viewAll: 'View all issues',
    fix: 'Fix',
    ignore: 'Ignore'
  },
  pageDetails: {
    title: 'Page Details',
    mainUrl: 'Main URL',
    lastAnalyzed: 'Last analyzed: {date}',
    metaTags: 'Meta Tags',
    headings: 'Heading Structure',
    images: 'Images',
    links: 'Links',
    scripts: 'Scripts',
    stylesheets: 'Stylesheets',
    noItems: 'No items found'
  },
  insights: {
    title: 'Site Statistics',
    pageCount: 'Pages analyzed',
    totalIssues: 'Total issues',
    avgPageSize: 'Average page size',
    avgLoadTime: 'Average load time'
  },
  buttons: {
    reanalyze: 'Reanalyze',
    export: 'Export Report',
    settings: 'Settings',
    viewDetails: 'View Details',
    found: 'Found',
    notFound: 'Not found',
    viewContent: 'View Content',
    issues: 'Issues'
  }
} 