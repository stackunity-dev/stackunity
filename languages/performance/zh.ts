export default {
  meta: {
    title: '网站性能分析 - StackUnity',
    description: '分析您网站的加载速度和性能指标'
  },
  page: {
    title: '网站性能分析',
    subtitle: '分析您网站的加载速度和性能指标'
  },
  form: {
    urlLabel: '要分析的URL',
    urlPlaceholder: 'https://example.com',
    urlHint: '输入完整URL（包括https://）',
    urlRule: '请输入以http://或https://开头的有效URL',
    analyzeButton: '分析性能'
  },
  loading: {
    text: '正在加载分析结果'
  },
  results: {
    title: '性能分析结果',
    averageScore: '平均性能得分',
    scoreLabel: '得分：{score}%',
    metrics: {
      title: '核心指标',
      loadingMetrics: '加载指标',
      scoreBreakdown: '性能得分细分',
      firstContentfulPaint: {
        title: '首次内容绘制',
        short: 'FCP',
        description: '浏览器渲染第一个内容元素的时间'
      },
      largestContentfulPaint: {
        title: '最大内容绘制',
        short: 'LCP',
        description: '最大内容元素渲染完成的时间'
      },
      speedIndex: {
        title: '速度指数',
        short: 'SI',
        description: '页面加载过程中内容显示的速度'
      },
      totalBlockingTime: {
        title: '总阻塞时间',
        short: 'TBT',
        description: '主线程被阻塞的总时间'
      },
      cumulativeLayoutShift: {
        title: '累积布局偏移',
        short: 'CLS',
        description: '页面加载期间视觉稳定性的度量'
      },
      timeToInteractive: {
        title: '可交互时间',
        short: 'TTI',
        description: '页面变得完全可交互的时间'
      }
    },
    resources: {
      title: '资源',
      networkRequests: '网络请求',
      resourceSizes: '资源大小',
      resourceTypes: '资源类型',
      requestCount: '请求数量：',
      totalSize: '总大小：',
      transferSize: '传输大小：',
      contentType: '内容类型',
      size: '大小',
      transferTime: '传输时间'
    },
    optimization: {
      title: '优化',
      opportunities: '优化机会',
      diagnostics: '性能诊断',
      passed: '通过的审核',
      wastefulResizing: '编码或大小效率低下的图像',
      uncompressedImages: '高效编码图像',
      unusedJavascript: '删除未使用的JavaScript',
      unusedCss: '删除未使用的CSS',
      preconnectOrigins: '预连接到所需的源',
      thirdParty: '减少第三方代码的影响',
      fontDisplay: '确保在网页字体加载期间文本保持可见',
      potential: '潜在节省：'
    },
    scoreIntervals: {
      excellent: '优秀',
      needsImprovement: '需要改进',
      poor: '较差',
      excellentRange: '90-100：优秀',
      improvementRange: '50-89：需要改进',
      poorRange: '0-49：较差'
    }
  },
  tabs: {
    metrics: '核心指标',
    resources: '资源',
    optimization: '优化'
  },
  summary: {
    title: '性能摘要',
    baselineMetrics: '基准指标',
    optimizationScore: '优化得分：',
    resourceEfficiency: '资源效率：',
    loadingSpeed: '加载速度：',
    userExperience: '用户体验：'
  },
  export: {
    title: '导出结果',
    pdf: '导出为PDF',
    csv: '导出为CSV',
    json: '导出为JSON'
  },
  error: {
    title: '错误',
    message: '无法分析URL。请检查URL并重试。',
    retry: '重试'
  }
} 