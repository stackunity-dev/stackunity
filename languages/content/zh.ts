export default {
  meta: {
    title: '内容分析 - StackUnity',
    description: '分析您的网页结构和质量以提高您的SEO'
  },
  page: {
    title: '内容分析',
    subtitle: '分析您的网页结构和质量以提高您的SEO'
  },
  form: {
    urlLabel: '要分析的网站URL',
    urlPlaceholder: 'https://example.com',
    urlHint: '输入完整的URL，包括https://',
    urlRule: '请输入一个有效的URL，以http://或https://开头',
    crawlEnabled: '分析链接的页面',
    crawlHint: '限制: 最多10个URL',
    analyzeButton: '分析内容'
  },
  loading: {
    text: '分析中'
  },
  averageScore: {
    title: '平均内容得分',
    calculated: '从{count}个分析页面计算平均得分',
    exportButton: '导出'
  },
  contentScore: {
    title: '内容得分',
    excellent: '优秀',
    good: '良好',
    average: '中等',
    poor: '较差',
    critical: '严重'
  },
  improvement: {
    title: '优先改进',
    lowestScore: '得分最低的页面是({score}%)',
    openInNew: '在新标签页中打开'
  },
  trends: {
    improving: '改善中',
    declining: '下降中',
    stable: '稳定',
    tooltipImproving: '所有页面的内容质量都在改善',
    tooltipDeclining: '所有页面的内容质量都在下降',
    tooltipStable: '所有页面的内容质量都很稳定'
  },
  statistics: {
    title: '内容统计',
    wordCount: '单词数',
    readabilityScore: '可读性得分',
    headingsDetected: '检测到的标题',
    links: '链接',
    internal: '内部',
    external: '外部'
  },
  readability: {
    veryEasy: '非常容易',
    easy: '容易',
    fairlyEasy: '相当容易',
    standard: '标准',
    fairlyDifficult: '相当困难',
    difficult: '困难',
    veryDifficult: '非常困难'
  },
  wordCount: {
    tooShort: '太短',
    short: '短',
    good: '好',
    excellent: '优秀'
  },
  headings: {
    title: '标题结构',
    noHeadings: '没有检测到标题(H1-H6)。'
  },
  issues: {
    title: '检测的问题',
    noIssues: '没有检测到主要问题。',
    missingH1: '缺少H1标题',
    multipleH1: '多个H1标题',
    shortContent: '内容太短',
    poorReadability: '可读性得分低',
    lowKeywordDensity: '关键词密度低',
    missingAltText: '图片缺少alt文本',
    brokenHeadingStructure: '标题结构断裂',
    lowWordCount: '单词数低',
    duplicateTitle: '标题重复',
    noExternalLinks: '没有外部链接',
    tooManyLinks: '链接太多',
    lowTextToHtmlRatio: '文本与HTML的比例低'
  },
  images: {
    title: '图片分析',
    preview: '图片预览',
    altText: 'Alt文本',
    missingAlt: '缺少alt文本',
    hasAlt: 'Alt文本存在',
    dimensions: '尺寸',
    hasDimensions: '优化',
    noDimensions: '没有尺寸'
  },
  keywords: {
    title: '关键词分析',
    topKeywords: 'Top关键词',
    density: '密度',
    optimal: '优化',
    tooLow: '太低',
    tooHigh: '太高',
    noKeywords: '没有显著的关键词'
  },
  seo: {
    title: 'SEO元素',
    metaTitle: 'Meta标题',
    metaDescription: 'Meta描述',
    canonical: 'Canonical URL',
    og: 'Open Graph标签',
    missingElement: '缺少',
    tooShort: '太短',
    tooLong: '太长',
    good: '好'
  },
  recommendations: {
    title: 'Recommendations',
    excellentQuality: {
      title: '优秀内容质量',
      description: '您的内容结构良好且优化了SEO。继续保持良好的工作！'
    },
    improveContent: {
      title: 'How to improve your content',
      addMoreContent: {
        title: '添加更多内容',
        description: '您的内容有{count}个单词。考虑扩展它至少到800-1000个单词以获得更好的SEO性能。'
      },
      addH1: {
        title: '添加一个H1标题',
        description: '每个页面应该只有一个H1标题，描述页面的内容。'
      },
      multipleH1: {
        title: '使用一个H1标题',
        description: '您的页面有{count}个H1标题。为了更好的SEO，使用一个H1标题，并使用H2-H6结构其他标题。'
      },
      addH2: {
        title: '添加H2标题',
        description: '使用H2标题将您的内容分成逻辑部分，以获得更好的可读性和SEO。'
      },
      addAltText: {
        title: '添加alt文本到图片',
        description: '{count}个图片缺少alt文本。为所有图片添加描述性的alt文本以获得更好的可访问性和SEO。'
      },
      improveReadability: {
        title: '改善可读性',
        description: '您的内容有{score}的可读性得分。尝试使用更短的句子和平易近人的语言。'
      },
      addInternalLinks: {
        title: '添加内部链接',
        description: '添加链接到您的网站上的其他相关页面以改善导航和SEO。'
      },
      addExternalLinks: {
        title: '添加外部链接',
        description: '创建链接到外部权威来源以增加可信度和SEO价值。'
      },
      generalImprovements: {
        title: '一般改进',
        description: '- 使用更多多样化和吸引人的语言\n- 添加多媒体元素（图片，视频，信息图表）\n- 包含具体示例和数据以支持您的观点\n- 使用清晰的介绍和结论结构内容'
      }
    },
    seoTips: {
      title: 'SEO tips',
      useKeywords: {
        title: '使用目标关键词',
        description: '在标题、Meta描述和内容中使用目标关键词。'
      },
      addAltText: {
        title: '添加alt文本到图片',
        description: '{count}个图片缺少alt文本。为所有图片添加描述性的alt文本以获得更好的可访问性和SEO。'
      },
      addH2: {
        title: '添加H2标题',
        description: '使用H2标题将您的内容分成逻辑部分，以获得更好的可读性和SEO。'
      },
      addH1: {
        title: '添加一个H1标题',
        description: '每个页面应该只有一个H1标题，描述页面的内容。'
      },
      addMoreContent: {
        title: '添加更多内容',
        description: '您的内容有{count}个单词。考虑扩展它至少到800-1000个单词以获得更好的SEO性能。'
      },
      addExternalLinks: {
        title: '添加外部链接',
        description: '创建链接到外部权威来源以增加可信度和SEO价值。'
      },
      addInternalLinks: {
        title: '添加内部链接',
        description: '添加链接到您的网站上的其他相关页面以改善导航和SEO。'
      },
      generalImprovements: {
        title: '一般改进',
        description: '- 使用更多多样化和吸引人的语言\n- 添加多媒体元素（图片，视频，信息图表）\n- 包含具体示例和数据以支持您的观点\n- 使用清晰的介绍和结论结构内容'
      },
      optimizeMeta: {
        title: '优化Meta描述',
        description: '创建一个引人入胜的Meta描述（150-160个字符），包含您的目标关键词。'
      },
      improveSpeed: {
        title: '改善页面速度',
        description: '优化图片，减少脚本，并使用浏览器缓存以提高加载时间。'
      },
      mobileOptimization: {
        title: '移动优化',
        description: '确保您的页面完全响应，并在移动设备上提供良好的用户体验。'
      },
      useSchema: {
        title: '使用schema',
        description: '使用schema.org标记描述您的内容以帮助搜索引擎理解并增加在搜索结果中的点击率。'
      }
    }
  },
  error: {
    title: '错误',
    message: '分析URL失败。请检查URL并重试。',
    retry: '重试'
  }
} 