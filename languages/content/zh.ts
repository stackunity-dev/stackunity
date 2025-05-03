export default {
  meta: {
    title: '内容分析 - StackUnity',
    description: '分析网页的结构和质量以提高您的SEO'
  },
  page: {
    title: '内容分析',
    subtitle: '分析网页的结构和质量以提高您的SEO'
  },
  form: {
    urlLabel: '要分析的网站URL',
    urlPlaceholder: 'https://example.com',
    urlHint: '输入完整URL（包括https://）',
    urlRule: '请输入以http://或https://开头的有效URL',
    crawlEnabled: '同时分析链接页面',
    crawlHint: '限制：最多10个URL',
    analyzeButton: '分析内容'
  },
  loading: {
    text: '分析进行中'
  },
  averageScore: {
    title: '平均内容得分',
    calculated: '根据{count}个已分析页面计算的平均得分',
    exportButton: '导出'
  },
  contentScore: {
    title: '内容得分',
    excellent: '优秀',
    good: '良好',
    average: '一般',
    poor: '较差',
    critical: '严重不足'
  },
  improvement: {
    title: '改进优先级',
    lowestScore: '得分最低的页面({score}%)是',
    openInNew: '在新标签页中打开'
  },
  trends: {
    improving: '正在改善',
    declining: '正在下降',
    stable: '稳定',
    tooltipImproving: '所有页面的内容质量正在改善',
    tooltipDeclining: '所有页面的内容质量正在下降',
    tooltipStable: '所有页面的内容质量保持一致'
  },
  statistics: {
    title: '内容统计',
    wordCount: '字数',
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
    good: '良好',
    excellent: '优秀'
  },
  headings: {
    title: '标题结构',
    noHeadings: '此页面未检测到标题（H1-H6）。'
  },
  issues: {
    title: '检测到的问题',
    noIssues: '内容中未检测到重大问题。',
    missingH1: '缺少H1标题',
    multipleH1: '多个H1标题',
    shortContent: '内容太短',
    poorReadability: '可读性得分低',
    lowKeywordDensity: '关键词密度低',
    missingAltText: '图片缺少替代文本',
    brokenHeadingStructure: '标题结构混乱',
    lowWordCount: '字数过少',
    duplicateTitle: '标题和H1重复',
    noExternalLinks: '没有外部链接',
    tooManyLinks: '链接过多',
    lowTextToHtmlRatio: '文本与HTML比率低'
  },
  images: {
    title: '图片分析',
    preview: '图片预览',
    altText: '替代文本',
    missingAlt: '缺少替代文本',
    hasAlt: '已有替代文本',
    dimensions: '尺寸',
    hasDimensions: '已优化',
    noDimensions: '无尺寸信息'
  },
  keywords: {
    title: '关键词分析',
    topKeywords: '主要关键词',
    density: '密度',
    optimal: '最佳',
    tooLow: '过低',
    tooHigh: '过高',
    noKeywords: '未检测到重要关键词'
  },
  seo: {
    title: 'SEO元素',
    metaTitle: '元标题',
    metaDescription: '元描述',
    canonical: '规范URL',
    og: 'Open Graph标签',
    missingElement: '缺失',
    tooShort: '太短',
    tooLong: '太长',
    good: '良好'
  },
  recommendations: {
    title: '推荐改进',
    excellentQuality: {
      title: '优秀内容质量',
      description: '您的内容结构良好且优化了SEO。继续保持良好的工作！'
    },
    improveContent: {
      title: '如何改进您的内容',
      addMoreContent: {
        title: '添加更多内容',
        description: '您的内容有{count}字。考虑扩展到至少800-1000字以提高SEO性能。'
      },
      addH1: {
        title: '添加H1标题',
        description: '每个页面应该只有一个H1标题，描述页面内容。'
      },
      multipleH1: {
        title: '使用一个H1标题',
        description: '您的页面有{count}个H1标题。为了更好的SEO，使用一个H1标题并使用H2-H6结构其他标题。'
      },
      addH2: {
        title: '添加H2标题',
        description: '使用H2标题将内容分成逻辑部分，以提高可读性和SEO。'
      },
      addAltText: {
        title: '添加替代文本',
        description: '{count}张图片缺少替代文本。为所有图片添加描述性替代文本以提高可访问性和SEO。'
      },
      improveReadability: {
        title: '提高可读性',
        description: '您的内容有{score}的可读性得分。尝试使用更短的句子并简化语言。'
      },
      addInternalLinks: {
        title: '添加内部链接',
        description: '添加链接到您的网站其他相关页面以提高导航和SEO。'
      },
      addExternalLinks: {
        title: '添加外部链接',
        description: '创建链接到外部权威来源以增加可信度和SEO价值。'
      },
      generalImprovements: {
        title: '一般改进',
        description: '- 使用更多多样化和吸引人的语言\n- 添加多媒体元素（图片、视频、信息图表）\n- 包含具体示例和数据以支持您的观点\n- 使用清晰的开头和结尾结构内容'
      }
    },
    seoTips: {
      title: 'SEO提示',
      useKeywords: {
        title: '使用目标关键词',
        description: '在标题、H1、第一段和自然内容中包含您的目标关键词。'
      },
      optimizeMeta: {
        title: '优化元描述',
        description: '创建一个引人入胜的元描述（150-160字符），包含您的目标关键词。'
      },
      improveSpeed: {
        title: '提高页面加载速度',
        description: '优化图片、减少脚本并利用浏览器缓存以提高加载时间。'
      },
      mobileOptimization: {
        title: '移动优化',
        description: '确保您的页面完全响应且在移动设备上提供良好的用户体验。'
      },
      useSchema: {
        title: '使用Schema标记',
        description: '使用Schema标记来描述您的内容，以提高搜索引擎理解并增加搜索结果的点击率。'
      }
    }
  },
  error: {
    title: '错误',
    message: '无法分析URL。请检查URL并重试。',
    retry: '重试'
  }
} 