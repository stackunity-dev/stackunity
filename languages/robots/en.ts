export default {
  meta: {
    title: 'Robots.txt & Schema.org Generator',
    description: 'Generate robots.txt files and Schema.org structured data for your website'
  },
  privacyNotice: {
    title: 'Data Privacy Notice',
    content: 'No data is collected or stored on our servers during the generation process. All content is processed locally in your browser.'
  },
  errorInfo: {
    title: 'Information:',
    stillGenerate: 'The SEO audit failed, but you can still generate content with the current data.',
    solutions: 'Possible solutions for the audit:',
    chromeServer: 'Check that Google Chrome is installed on the server',
    chromeAccess: 'The server user must have access to the chrome.exe file'
  },
  configuration: {
    title: 'Configuration',
    websiteInfo: 'Website Information',
    domain: 'Website Domain',
    domainHint: 'Enter your website domain without protocol (http/https)',
    protocol: 'Protocol',
    skipAnalysis: 'Generate without site analysis (use only input data)',
    skipAnalysisHint: 'Enable this option if the site analysis fails'
  },
  tabs: {
    robots: 'Robots.txt',
    schema: 'Schema.org'
  },
  robotsConfig: {
    pathManagement: 'Path Management',
    templates: 'Predefined templates',
    disallowedPaths: 'Disallowed Paths',
    allowedPaths: 'Allowed Paths',
    pathToDisallow: 'Path to disallow',
    pathToAllow: 'Path to allow'
  },
  schemaConfig: {
    templates: 'Schema.org Templates'
  },
  robotsSettings: {
    title: 'Robots.txt Settings',
    userAgent: 'User Agent',
    customUserAgent: 'Custom User Agent',
    crawlDelay: 'Crawl Delay (seconds)',
    noDelay: 'Leave empty for no delay',
    disallowedPaths: 'Disallowed Paths',
    allowedPaths: 'Allowed Paths',
    add: 'Add',
    sitemapUrl: 'Sitemap URL'
  },
  schemaSettings: {
    title: 'Schema.org Settings',
    schemaType: 'Schema Type',
    name: 'Name',
    description: 'Description',
    url: 'URL',
    commonProperties: 'Common Properties',
    imageUrl: 'Image URL',
    telephone: 'Telephone',
    email: 'Email',
    address: 'Address',
    logoUrl: 'Logo URL',
    properties: 'Properties'
  },
  templateTitles: {
    wordpress: 'WordPress',
    ecommerce: 'E-commerce',
    blog: 'Blog',
    article: 'Article',
    product: 'Product',
    organization: 'Organization',
    localBusiness: 'LocalBusiness'
  },
  templateDescriptions: {
    wordpress: 'Optimal configuration for WordPress sites',
    ecommerce: 'Optimal configuration for e-commerce sites',
    blog: 'Optimal configuration for blogs',
    article: 'Structure for blog articles',
    product: 'Structure for e-commerce products',
    organization: 'Structure for organizations',
    localBusiness: 'Structure for local business'
  },
  templateTypes: {
    wordpress: {
      name: 'WordPress',
      description: 'Optimal configuration for WordPress sites'
    },
    ecommerce: {
      name: 'E-commerce',
      description: 'Optimal configuration for e-commerce sites'
    },
    blog: {
      name: 'Blog',
      description: 'Optimal configuration for blogs'
    },
    article: {
      name: 'Article',
      description: 'Structure for blog articles'
    },
    product: {
      name: 'Product',
      description: 'Structure for e-commerce products'
    },
    organization: {
      name: 'Organization',
      description: 'Structure for organizations'
    },
    localBusiness: {
      name: 'LocalBusiness',
      description: 'Structure for local business'
    }
  },
  preview: {
    configureSettings: 'Configure your settings',
    andGenerate: 'and click "Generate"',
    generatedCode: 'Generated Code'
  },
  actions: {
    generate: 'Generate Content',
    analyzing: 'Analysing...'
  },
  codePreview: {
    code: 'Code',
    preview: 'Preview',
    copy: 'Copy',
    download: 'Download',
    errorParsingJson: 'JSON parsing error'
  },
  errors: {
    validDomain: 'Please enter a valid domain.',
    auditFailed: 'The analysis server encountered an error (500). This may be due to server overload or a problem with the site being analyzed.',
    notFound: 'The requested site was not found (404). Check that the URL is correct and the site is accessible.',
    connectionRefused: 'Impossible to connect to the site. Ensure the site is accessible and your internet connection is working.',
    timeout: 'The analysis took too long and was interrupted. Try analyzing a smaller site or increase the timeout.',
    generic: 'An error occurred during site analysis.',
    contentGeneration: 'An error occurred while generating content.',
    continueWithSettings: 'You can still generate content with the current settings.',
    warning: 'Warning:'
  },
  templates: {
    rules: {
      description: 'Description',
      severity: 'Importance',
      category: 'Category',
      path: 'Path',
      type: 'Type'
    },
    properties: {
      headline: 'Article headline',
      author: 'Author name',
      datePublished: 'Publication date',
      dateModified: 'Modification date',
      image: 'Main image',
      description: 'Description',
      articleBody: 'Article content',
      publisher: 'Publisher name',
      keywords: 'Keywords',
      articleSection: 'Category',
      inLanguage: 'Language',
      name: 'Name',
      offers: 'Price and availability',
      brand: 'Brand',
      sku: 'Product reference',
      gtin: 'Product GTIN',
      mpn: 'Manufacturer part number',
      color: 'Color',
      material: 'Material',
      weight: 'Weight',
      category: 'Category',
      aggregateRating: 'Average rating',
      logo: 'Logo',
      telephone: 'Phone number',
      email: 'Email address',
      address: 'Postal address',
      foundingDate: 'Founding date',
      legalName: 'Legal name',
      numberOfEmployees: 'Number of employees',
      socialProfiles: 'Social profiles',
      url: 'Website URL',
      openingHours: 'Opening hours',
      priceRange: 'Price range',
      areaServed: 'Served area',
      hasMap: 'Link to the map',
      geo: 'Geographic coordinates'
    },
    categories: {
      admin: 'Administration',
      system: 'System',
      plugins: 'Plugins',
      themes: 'Themes',
      security: 'Security',
      auth: 'Authentication',
      media: 'Media',
      cache: 'Cache',
      checkout: 'Checkout',
      cart: 'Cart',
      user: 'User',
      search: 'Search',
      catalog: 'Catalog',
      products: 'Products',
      categories: 'Categories',
      api: 'API',
      static: 'Static files',
      tags: 'Tags',
      authors: 'Authors',
      feeds: 'RSS feeds',
      comments: 'Comments'
    },
    severity: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    }
  },
  tools: {
    new: 'New',
    premium: 'Premium',
    explore: 'Explore'
  }
} 