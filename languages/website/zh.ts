export default {
  meta: {
    title: '网站分析',
    description: '分析您网站的性能、安全性和搜索引擎优化'
  },
  alerts: {
    noWebsiteData: '此账户没有可用的网站数据。请在下方添加网站到您的账户。',
    addWebsite: '添加网站'
  },
  loading: {
    progress: '{value}%'
  },
  cards: {
    websiteData: {
      title: '网站数据',
      mainUrl: '主要网址',
      urlsDetected: '已检测到 {count} 个网址',
      socialMedia: '社交媒体预览',
      socialUnavailable: '社交媒体元数据不可用',
      generatedSitemap: '生成的地图',
      copySitemap: '复制地图',
      showLess: '显示更少',
      showMore: '显示 {count} 更多',
    },
    analysis: {
      title: '网站分析',
      description: '运行网站的完整分析，获取有关性能、安全性等方面的见解。',
      startAnalysis: '开始分析'
    },
    metrics: {
      title: 'SSUC 指标',
      averageOf: '{count} 个网址的平均值',
      performance: '性能',
      seo: '搜索引擎优化',
      security: '安全性',
      usability: '可用性',
      tooltips: {
        fcp: '首次内容绘制',
        lcp: '最大内容绘制',
        cls: '累积布局偏移'
      }
    },
    technical: {
      title: '技术分析',
      robotsTxt: 'Robots.txt',
      sitemap: '网站地图',
      ssl: 'SSL 证书',
      responsiveness: '响应式设计',
      headers: 'HTTP 头',
      mobileFriendly: '移动友好',
      found: '已找到',
      notFound: '未找到',
      valid: '有效',
      invalid: '无效',
      enabled: '已启用',
      disabled: '已禁用',
      secure: '安全',
      notSecure: '不安全'
    }
  },
  issues: {
    title: '检测到的问题',
    severity: {
      critical: '严重',
      high: '高',
      medium: '中',
      low: '低',
      info: '信息'
    },
    noIssues: '未检测到问题',
    viewAll: '查看所有问题',
    fix: '修复',
    ignore: '忽略'
  },
  pageDetails: {
    title: '页面详情',
    mainUrl: '主要网址',
    lastAnalyzed: '最后分析: {date}',
    metaTags: '元标签',
    headings: '标题结构',
    images: '图片',
    links: '链接',
    scripts: '脚本',
    stylesheets: '样式表',
    noItems: '未找到项目'
  },
  insights: {
    title: '网站统计',
    pageCount: '已分析页面',
    totalIssues: '总问题数',
    avgPageSize: '平均页面大小',
    avgLoadTime: '平均加载时间'
  },
  buttons: {
    reanalyze: '重新分析',
    export: '导出报告',
    settings: '设置',
    viewDetails: '查看详情',
    found: '已找到',
    notFound: '未找到',
    viewContent: '查看内容',
    issues: '问题'
  }
} 