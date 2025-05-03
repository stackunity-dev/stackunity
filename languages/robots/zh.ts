export default {
  meta: {
    title: 'Robots.txt 和 Schema.org 生成器',
    description: '为您的网站生成 robots.txt 文件和 Schema.org 结构化数据'
  },
  privacyNotice: {
    title: '数据隐私声明',
    content: '在生成过程中，我们的服务器不会收集或存储任何数据。所有内容都在您的浏览器中本地处理。'
  },
  errorInfo: {
    title: '信息：',
    stillGenerate: 'SEO 审核失败，但您仍然可以使用当前数据生成内容。',
    solutions: '审核的可能解决方案：',
    chromeServer: '检查服务器上是否安装了 Google Chrome',
    chromeAccess: '服务器用户必须有权访问 chrome.exe 文件'
  },
  configuration: {
    title: '配置',
    websiteInfo: '网站信息',
    domain: '网站域名',
    domainHint: '输入您的网站域名，不含协议（http/https）',
    protocol: '协议',
    skipAnalysis: '不分析网站直接生成（仅使用输入数据）',
    skipAnalysisHint: '如果网站分析失败，请启用此选项'
  },
  tabs: {
    robots: 'Robots.txt',
    schema: 'Schema.org'
  },
  robotsConfig: {
    pathManagement: '路径管理',
    templates: '预定义模板',
    disallowedPaths: '禁止路径',
    allowedPaths: '允许路径',
    pathToDisallow: '要禁止的路径',
    pathToAllow: '要允许的路径'
  },
  schemaConfig: {
    templates: 'Schema.org 模板'
  },
  robotsSettings: {
    title: 'Robots.txt 设置',
    userAgent: '用户代理',
    customUserAgent: '自定义用户代理',
    crawlDelay: '爬行延迟（秒）',
    noDelay: '留空表示无延迟',
    disallowedPaths: '禁止路径',
    allowedPaths: '允许路径',
    add: '添加',
    sitemapUrl: '网站地图 URL'
  },
  schemaSettings: {
    title: 'Schema.org 设置',
    schemaType: 'Schema 类型',
    name: '名称',
    description: '描述',
    url: 'URL',
    commonProperties: '常用属性',
    imageUrl: '图片 URL',
    telephone: '电话',
    email: '电子邮件',
    address: '地址',
    logoUrl: '徽标 URL',
    properties: '属性'
  },
  templateTitles: {
    wordpress: 'WordPress',
    ecommerce: '电子商务',
    blog: '博客',
    article: '文章',
    product: '产品',
    organization: '组织',
    localBusiness: '本地企业'
  },
  templateDescriptions: {
    wordpress: 'WordPress 网站的最佳配置',
    ecommerce: '电子商务网站的最佳配置',
    blog: '博客的最佳配置',
    article: '博客文章的结构',
    product: '电子商务产品的结构',
    organization: '组织的结构',
    localBusiness: '本地企业的结构'
  },
  templateTypes: {
    wordpress: {
      name: 'WordPress',
      description: 'WordPress 网站的最佳配置'
    },
    ecommerce: {
      name: '电子商务',
      description: '电子商务网站的最佳配置'
    },
    blog: {
      name: '博客',
      description: '博客的最佳配置'
    },
    article: {
      name: '文章',
      description: '博客文章的结构'
    },
    product: {
      name: '产品',
      description: '电子商务产品的结构'
    },
    organization: {
      name: '组织',
      description: '组织的结构'
    },
    localBusiness: {
      name: '本地企业',
      description: '本地企业的结构'
    }
  },
  preview: {
    configureSettings: '配置您的设置',
    andGenerate: '并点击"生成"',
    generatedCode: '生成的代码'
  },
  actions: {
    generate: '生成内容',
    analyzing: '分析中...'
  },
  codePreview: {
    code: '代码',
    preview: '预览',
    copy: '复制',
    download: '下载',
    errorParsingJson: 'JSON 解析错误'
  },
  errors: {
    validDomain: '请输入有效的域名。',
    auditFailed: '分析服务器遇到错误 (500)。这可能是由于服务器过载或被分析网站的问题。',
    notFound: '找不到请求的网站 (404)。检查 URL 是否正确以及网站是否可访问。',
    connectionRefused: '无法连接到网站。确保网站可访问且您的互联网连接正常。',
    timeout: '分析时间过长被中断。尝试分析较小的网站或增加超时时间。',
    generic: '网站分析过程中发生错误。',
    contentGeneration: '生成内容时发生错误。',
    continueWithSettings: '您仍然可以使用当前设置生成内容。',
    warning: '警告：'
  },
  templates: {
    rules: {
      description: '描述',
      severity: '重要性',
      category: '类别',
      path: '路径',
      type: '类型'
    },
    properties: {
      headline: '文章标题',
      author: '作者名称',
      datePublished: '发布日期',
      dateModified: '修改日期',
      image: '主图',
      description: '描述',
      articleBody: '文章内容',
      publisher: '发布者名称',
      keywords: '关键词',
      articleSection: '分类',
      inLanguage: '语言',
      name: '名称',
      offers: '价格和可用性',
      brand: '品牌',
      sku: '产品编号',
      gtin: '产品全球贸易项目代码',
      mpn: '制造商零件编号',
      color: '颜色',
      material: '材料',
      weight: '重量',
      category: '类别',
      aggregateRating: '平均评分',
      logo: '徽标',
      telephone: '电话号码',
      email: '电子邮件地址',
      address: '邮寄地址',
      foundingDate: '成立日期',
      legalName: '法定名称',
      numberOfEmployees: '员工数量',
      socialProfiles: '社交资料',
      url: '网站 URL',
      openingHours: '营业时间',
      priceRange: '价格范围',
      areaServed: '服务区域',
      hasMap: '地图链接',
      geo: '地理坐标'
    },
    categories: {
      admin: '管理',
      system: '系统',
      plugins: '插件',
      themes: '主题',
      security: '安全',
      auth: '认证',
      media: '媒体',
      cache: '缓存',
      checkout: '结账',
      cart: '购物车',
      user: '用户',
      search: '搜索',
      catalog: '目录',
      products: '产品',
      categories: '类别',
      api: 'API',
      static: '静态文件',
      tags: '标签',
      authors: '作者',
      feeds: 'RSS 源',
      comments: '评论'
    },
    severity: {
      high: '高',
      medium: '中',
      low: '低'
    }
  },
  tools: {
    new: '新',
    premium: '高级',
    explore: '探索'
  }
} 