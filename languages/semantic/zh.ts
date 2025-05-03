export default {
  meta: {
    title: '语义分析 - StackUnity',
    description: '分析您网站的语义结构，评估HTML、ARIA和元标签'
  },
  page: {
    title: '语义分析',
    subtitle: '分析您网站的语义结构'
  },
  form: {
    urlLabel: '要分析的网站URL',
    urlPlaceholder: 'https://example.com',
    urlHint: '输入完整URL（包括https://）',
    urlRule: '请输入以http://或https://开头的有效URL',
    analyzeButton: '分析内容'
  },
  loading: {
    text: '正在加载分析结果'
  },
  results: {
    title: '分析结果',
    averageScore: '平均分数',
    scoreLabel: '分数：{score}%',
    html: {
      title: 'HTML结构',
      score: 'HTML结构分数：{score}%',
      elements: 'HTML结构元素'
    },
    aria: {
      title: '无障碍ARIA',
      score: 'ARIA分数：{score}%',
      missingAttributes: '缺失的ARIA属性',
      missingLabels: '缺失的标签',
      formElementsWithLabels: '带标签的表单元素',
      missingAriaCount: '缺失的ARIA属性数量',
      invalidAriaCount: '无效的ARIA属性',
      interactiveElementsWithAria: '带ARIA的交互元素',
      totalInteractiveElements: '交互元素总数',
      elementsToCompleteWithAria: '需要补充ARIA的元素'
    },
    meta: {
      title: '元标签',
      score: '元标签分数：{score}%',
      requiredTags: '必需的元标签',
      presentCount: '存在：{count}',
      missingCount: '缺失：{count}',
      availableTags: '可用的元标签',
      detailedScore: '详细元标签分数',
      essentialTags: '基本元标签',
      socialTags: '社交元标签',
      technicalTags: '技术元标签',
      contentTags: '内容元标签',
      socialSharingTags: '社交分享元标签',
      htmlCodeOfMetaTags: '元标签的HTML代码',
      detectedIssues: '检测到的问题'
    },
    readability: {
      title: '可读性分析',
      score: '分数：',
      grade: '等级：',
      words: '单词数：',
      sentences: '句子数：'
    },
    headings: {
      title: '标题结构',
      structure: '页面标题结构'
    },
    headingStructure: {
      title: '标题结构'
    }
  },
  tabs: {
    htmlStructure: 'HTML结构',
    accessibilityAria: '无障碍ARIA',
    metaTags: '元标签'
  },
  categories: {
    html: 'HTML',
    aria: 'ARIA',
    meta: '元数据'
  },
  elementTitles: {
    doctype: '文档类型',
    html: 'HTML标签',
    head: 'HEAD标签',
    title: 'TITLE标签',
    body: 'BODY标签',
    header: 'HEADER标签',
    main: 'MAIN标签',
    footer: 'FOOTER标签',
    navigation: '导航',
    headings: '标题',
    semanticElements: '语义元素',
    lists: '列表',
    images: '图像',
    links: '链接',
    tables: '表格',
    forms: '表单'
  },
  suggestions: {
    title: '改进建议',
    htmlSuggestions: 'HTML结构建议',
    ariaSuggestions: 'ARIA建议',
    metaSuggestions: '元标签建议',
    noSuggestions: '没有可用的建议。您的网站结构良好！'
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