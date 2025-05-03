export default {
  meta: {
    title: '用户参与度分析',
    description: '分析您网站上的潜在用户参与度'
  },
  form: {
    urlLabel: '待分析的URL',
    urlPlaceholder: 'https://example.com',
    urlHint: '输入完整URL，包括https://',
    urlRuleInvalid: '请输入以http://或https://开头的有效URL',
    analyzeButton: '分析内容',
    analyzeAriaLabel: '分析内容'
  },
  results: {
    title: '分析结果',
    averageScore: '平均参与度得分',
    avgCtaCount: '平均CTA数量',
    avgInteractiveElements: '平均交互元素',
    avgSocialElements: '平均社交元素'
  },
  tabs: {
    engagement: '参与元素',
    issues: '检测到的问题',
    techniques: '参与技术',
    details: '详细元素'
  },
  engagement: {
    statistics: '参与统计',
    ctaElements: '行动号召 (CTA)',
    interactiveElements: '交互元素',
    visualElements: '视觉元素',
    socialElements: '社交元素',
    detailedScores: '详细得分',
    navigation: '导航',
    readability: '可读性',
    globalScore: '总体得分'
  },
  issues: {
    title: '检测到的问题',
    noIssues: '未检测到问题',
    description: '描述:',
    recommendation: '建议:'
  },
  techniques: {
    title: '参与技术',
    socialLinks: '社交链接',
    ctaButtons: 'CTA按钮',
    formsInputs: '表单或输入字段',
    videos: '视频',
    images: '图片',
    interactiveElements: '交互元素',
    feedbackMechanisms: '反馈机制'
  },
  detailedElements: {
    ctaTitle: 'CTA元素',
    ctaText: '文本',
    ctaType: '类型',
    ctaLocation: '位置',
    noCta: '未找到CTA元素',
    socialTitle: '社交媒体元素',
    socialPlatform: '平台',
    socialType: '类型',
    socialLocation: '位置',
    noSocial: '未找到社交媒体元素',
    interactiveTitle: '交互元素',
    interactiveDescription: '描述',
    interactiveType: '类型',
    interactiveLocation: '位置',
    noInteractive: '未找到交互元素详情'
  }
} 