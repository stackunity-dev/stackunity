export default {
  meta: {
    title: '用户分析',
    description: '分析用户行为并确定改进机会。',
  },
  title: '用户分析',
  description: '分析用户行为并确定改进机会。',
  addSite: '添加网站',
  noSites: '未添加网站。添加网站以开始分析用户行为。',
  viewAnalytics: '查看分析',
  addedAt: '添加于',
  name: '名称',
  url: '网址',
  urlRequired: '需要URL',
  urlMustStartWithHttp: 'URL必须以http://或https://开头',
  mostVisitedPages: '访问量最高的页面',
  views: '浏览量',
  avgTime: '平均时间',
  page: '页面',
  source: '来源',
  device: '设备',
  errorTab: '错误',
  interactionsTab: '互动',
  analyticsFor: '分析',
  cancel: '取消',
  add: '添加',
  save: '保存',
  edit_name: '编辑名称',
  welcome: {
    title: '欢迎使用StackUnity Analytics',
    description: '开始跟踪您的网站性能并了解用户行为。',
    getStarted: '开始',
    quickStart: '快速入门指南',
    features: '功能',
    cards: [
      {
        title: '实时跟踪',
        description: '实时监控访客与您的网站互动。',
        icon: 'mdi-clock-fast',
        color: 'primary'
      },
      {
        title: '行为分析',
        description: '了解用户如何与您的内容互动。',
        icon: 'mdi-account-search',
        color: 'secondary'
      },
      {
        title: '性能优化',
        description: '识别改进机会以增加转化率。',
        icon: 'mdi-trending-up',
        color: 'tertiary'
      },
      {
        title: '隐私尊重',
        description: '在不侵犯隐私的情况下跟踪访客。',
        icon: 'mdi-shield-check',
        color: 'primary'
      }
    ],
    empty: {
      title: '开始您的分析之旅',
      description: '您还没有添加任何网站进行监控。添加您的第一个网站以开始收集有价值的数据。',
      action: '添加我的第一个网站'
    },
    few: {
      title: '扩展您的监控',
      description: '您已经开始跟踪几个网站。添加更多网站以集中所有您的分析。',
      action: '添加另一个网站'
    }
  },
  worldMap: {
    title: '全球访问者',
    description: '可视化您的访问者在全球的分布情况。',
    noData: '没有地理数据可用。添加一个网站以开始收集地理数据。',
    countries: '国家',
    visitors: '访问者',
    topCountries: '主要国家',
    country: '国家',
    visits: '访问',
    percentage: '百分比'
  },
  form: {
    name: '名称',
    url: '网址',
    namePlaceholder: '我的网站',
    urlPlaceholder: 'https://example.com',
    nameRequired: '需要名称',
    valueRequired: '需要值',
  },
  cardMetrics: {
    visitors: '访问者',
    avgTime: '平均时间',
    bounceRate: '跳出率',
    frustratedSessions: '挫折会话',
  },
  interactionsCard: {
    totalClicks: '总点击量',
    scrolls: '滚动',
    forms: '表单',
    inputs: '输入',
    recentInteractions: '最近互动',
    type: '类型',
    element: '元素',
    timestamp: '时间戳',
    clickHeatmap: '点击热图',
    clicksRecorded: '记录的点击',
    hotspots: '主要热点',
    coordinates: '坐标 (X, Y)',
    clickCount: '点击次数',
    clicksCount: '点击次数',
    interactionType: '互动类型',
    search: '搜索',
    details: '详情',
    actions: '操作',
    interactionDetails: '互动详情',
    dateAndTime: '日期和时间',
    text: '文本',
    detailedData: '详细数据',
    unidentified: '未识别',
    heatmap: '热图',
    complexObject: '复杂对象',
    detailsUnavailable: '详情不可用',
    formattingError: '格式错误',
    scrollDepth: '深度',
    valid: '有效',
    invalid: '无效'
  },
  tracking: {
    trackingCode: '跟踪代码',
    trackingCodeDescription: '将此代码添加到网站的</body>关闭标签之前，开始收集数据。',
    trackingCodeCopied: '跟踪代码已复制到剪贴板。',
    copyCode: '复制代码',
  },
  error: {
    error: '错误',
    errorDescription: '获取数据时出错。',
    errorDetails: '错误详情',
    errorDetailsDescription: '获取数据时发生以下错误:',
    errorDetected: '错误检测',
    noErrorDetected: '未检测到错误',
    errorDetectedDescription: '在您的网站上检测到错误。请检查并修复它们。',
    noErrorDetectedDescription: '您的网站上未检测到错误。继续这样做！',
  },
  deadZoneViewer: {
    title: '死区',
    loading: '分析页面区域...',
    noData: '没有互动数据可用',
    noDataDescription: '我们需要更多互动数据来识别您的页面上的死区。',
    selectPage: '选择一个页面进行分析',
    overview: '死区概述',
    interactionCoverage: '互动覆盖',
    excellent: '优秀',
    good: '良好',
    average: '平均',
    poor: '较差',
    critical: '关键',
    needsAttention: '需要关注',
    zoneBetween: '区域之间',
    activity: '活动',
    visualization: '页面互动可视化',
    heatmap: '热图',
    segments: '段',
    heatmapTitle: '互动热图',
    highActivity: '高活动',
    lowActivity: '低活动',
    pageSections: '页面部分 (% of 高度)',
    sectionTooltip: '部分显示页面不同部分互动的百分比。较少的互动 = 可能需要改进的潜在死区。',
    interactionsPercentage: '互动',
    section: '部分',
    lowActivityZone: '低活动区',
    critical20: '0-20% (关键)',
    problematic40: '21-40% (问题)',
    average60: '41-60% (平均)',
    good100: '61-100% (良好)',
    pageInteractionVisualization: '页面互动可视化',
    pageSectionsDescription: '部分显示页面不同部分互动的百分比。较少的互动 = 可能需要改进的潜在死区。',
    recommendations: '改进建议',
    recommendationAnalyze: {
      title: '分析死区内容',
      description: '检查低互动区域的内容以识别潜在的相关性或参与问题。'
    },
    recommendationVisual: {
      title: '添加视觉元素',
      description: '在低互动区域添加吸引人的视觉元素，如图像或视频。'
    },
    recommendationCritical: {
      title: '处理关键死区',
      description: '页面包含几乎没有互动的关键死区。考虑重新组织这些部分或删除它们。'
    },
    recommendationLayout: {
      title: '改进页面布局',
      description: '整体互动覆盖率较低。考虑重新设计布局以提高参与度。'
    }
  },
  analytics: {
    totalVisitors: '总访问者',
    totalPageViews: '总页面浏览量',
    avgSessionDuration: '平均会话持续时间',
    bounceRate: '跳出率',
    frustratedSessions: '挫折会话',
    timeOnSite: '网站停留时间',
    topPages: '热门页面',
    trafficSources: '流量来源',
    devices: '设备',
    userFlows: '用户流',
    errorEvents: '错误事件',
    count: '数量',
    percentage: '百分比',
    deviceType: '设备类型',
    source: '来源',
    visitors: '访问者',
    trafficDistribution: '流量分布',
    deviceDistribution: '设备分布',
    deviceStats: '设备统计',
    path: '路径',
    visitorCount: '访问者数量',
    conversionRate: '转化率',
    errorMessage: '错误信息',
    browserInfo: '浏览器信息',
    trackingCode: '跟踪代码',
    all: '全部',
    last7days: '最近7天',
    last30days: '最近30天',
    last90days: '最近90天',
    realtime: '实时',
    visites: '访问者',
    pages: '页面',
    temps: '时间',
    technicalInfo: '技术信息',
    browsers: '浏览器',
    osSystems: '操作系统',
    appareil: {
      desktop: '桌面',
      tablet: '平板',
      mobile: '移动',
      inconnu: '未知'
    },
    copyCode: '跟踪代码已复制到剪贴板。',
    copyCodeError: '复制跟踪代码时出错。',
    exportSuccess: '数据导出成功',
    views: '浏览量',
    deviceTypes: '设备类型',
    pageViews: '页面浏览量',
    active: '活跃',
    success: '网站添加成功',
    error: '添加网站时出错',
    organicSearch: '有机搜索',
    socialMedia: '社交媒体',
    directLinks: '直接链接',
    referers: '引荐来源',
    deleteTitle: '删除分析数据',
    deleteDescription: '您即将删除此网站的分析数据。此操作无法撤消。',
    deleteConfirm: '确认删除',
    deleteCancel: '取消',
    deleteSite: '删除网站',
    deleteConfirmation: '我理解此操作是不可逆的，并确认删除',
    deleteSuccess: '数据已成功删除',
    deleteError: '删除数据时出错',
    deleteWarning: '警告: 此操作是不可逆的，并会永久删除此网站的所有分析数据。',
    deleteConfirmLabel: '请输入网站名称以确认删除',
    deleteWarningDescription: '此操作将删除此网站的所有分析数据，包括访客信息、页面浏览量和用户互动。无法恢复。',
    exportButton: '导出数据',
    exportError: '导出数据时出错',
    exportWarning: '警告: 此操作将导出此网站的所有分析数据，包括访客信息、页面浏览量和用户互动。无法恢复。',
    exportConfirm: '确认导出',
    exportCancel: '取消',
    exportConfirmation: '我理解此操作是不可逆的，并确认导出',
    exportAllData: '导出所有数据',
    refreshData: '刷新数据',
    exportTitle: '导出数据',
    exportDescription: '选择要导出的格式和数据。',
    refreshSuccess: '数据已成功刷新',
    exclusionsDescription: '添加一个排除到排除列表中。',
    ipAddress: 'IP地址',
    userId: '用户ID',
    exclusionType: '排除类型',
    ipAddressPlaceholder: 'IP地址排除 (如: 192.168.1.1)',
    userIdPlaceholder: '用户ID排除',
    exclusionSaveError: '保存排除时出错。',
    exclusionsSaved: '排除已保存。',
    exclusionDeleteError: '删除排除时出错。',
    exclusionDeleteSuccess: '排除已删除。',
    exclusionDeleteConfirm: '确认删除',
    exclusionDeleteCancel: '取消',
    exclusionDeleteConfirmation: '我理解此操作是不可逆的，并确认删除',
    avgPageTime: '平均页面时间',
    excludeCurrentDevice: '排除当前设备',
    visitorId: '访客ID',
    visitorIdPlaceholder: '访客ID排除 (如: 123456)',
    chart: {
      title: '访问趋势',
      pageTitle: '访问趋势 - {pageName}',
      allPages: '所有页面',
      dateStart: '开始日期',
      dateEnd: '结束日期',
      applyFilter: '应用',
      chartLine: '线形图',
      chartBar: '柱状图',
      visitors: '访客',
      viewAllPages: '查看所有页面',
      noData: '该时期没有可用数据',
      dataLoading: '加载数据中...',
      dateRange: '日期范围',
      last7days: '最近7天',
      last30days: '最近30天',
      last90days: '最近90天',
      custom: '自定义'
    },
  },
  interactions: {
    title: '用户互动',
    timeline: '时间线',
    heatmap: '热图',
    data: '数据',
    totalClicks: '总点击量',
    scrolls: '滚动',
    forms: '表单',
    inputs: '输入',
    recentInteractions: '最近互动',
    type: '类型',
    element: '元素',
    timestamp: '时间戳',
    clickHeatmap: '点击热图',
    clicksRecorded: '记录的点击',
    hotspots: '主要热点',
    coordinates: '坐标 (X, Y)',
    clickCount: '点击次数',
    filterByType: '按类型筛选',
    search: '搜索',
    details: '详情',
    actions: '操作',
    interactionDetails: '互动详情',
    dateTime: '日期和时间',
    text: '文本',
    detailedData: '详细数据',
    position: '位置',
    depth: '深度',
    field: '字段',
    formId: '表单ID',
    formAction: '表单操作',
    notIdentified: '未识别',
    detailsNotAvailable: '详情不可用',
    validField: '有效',
    invalidField: '无效',
    clickVisualization: '点击可视化',
    viewportSize: '视口大小',
    noData: '没有数据可用',
    noDataDescription: '没有数据记录此期间。',
    loadMore: '加载更多',
    loadMoreDescription: '加载更多互动',
    limitedTo: '限制为',
    latestInteractions: '最新互动',
  },
  engagement: {
    title: '参与质量',
    helpText: '用户参与',
    loading: '分析中...',
    noData: '没有足够的数据进行分析',
    noDataDescription: '我们还没有足够的互动信息来衡量参与质量。',
    overallScore: '总体参与分数',
    scrollDepthScore: '滚动深度',
    interactionDensity: '互动密度',
    timeQuality: '时间质量',
    contentConsumption: '内容消费',
    factors: '参与因素',
    recommendations: '改进建议',
    averageScrollSpeed: '滚动速度',
    scrollJitter: '方向变化',
    focusedTime: '活跃时间',
    interactionsPerMinute: '每分钟互动次数',
    readingPatternScore: '阅读模式',
    qualityExcellent: '优秀',
    qualityGood: '良好',
    qualityAverage: '一般',
    qualityPoor: '较差',
    scrollDepthLowTitle: '滚动深度低',
    scrollDepthLowText: '用户在页面上滚动不够。考虑添加视觉指示器来鼓励滚动或重组内容以吸引注意力到页面下方。',
    interactionLowTitle: '互动有限',
    interactionLowText: '用户与页面的互动较少。添加交互元素如按钮、表单或媒体来鼓励参与。',
    timeQualityLowTitle: '注意力有限',
    timeQualityLowText: '用户没有保持对您页面的专注。确保您的内容有吸引力并避免可能导致他们切换标签的干扰。',
    contentConsumptionLowTitle: '内容消费低',
    contentConsumptionLowText: '您的内容没有被充分消费。考虑将其结构化为更短的部分，配有吸引人的标题和视觉元素。',
    readingPatternLowTitle: '阅读模式效率低',
    readingPatternLowText: '用户似乎以无组织的方式扫描页面。改善视觉层次结构并使用自然引导视线的设计原则。',
    allGoodTitle: '出色表现',
    allGoodText: '您的页面显示出优秀的参与指标。继续保持这种用户体验质量。'
  },
  charts: {
    pageViews: '页面浏览量',
    trafficSources: '流量来源',
    deviceTypes: '设备类型',
    desktop: '桌面',
    tablet: '平板',
    mobile: '移动',
    unknown: '未知',
    directLinks: '直接链接',
    organicSearch: '自然搜索',
    socialNetworks: '社交网络',
    referrers: '引荐来源'
  },
  purge: {
    title: '清除分析数据',
    description: '您即将清除此网站的分析数据。此操作无法撤消。',
    purgeData: '清除数据',
    purgeNow: '立即清除',
    confirmDelete: '确认删除',
    cancel: '取消',
    selectData: '选择要清除的数据',
    options: {
      older90: '超过90天的数据',
      older30: '超过30天的数据',
      older7: '超过7天的数据',
      all: '所有数据'
    },
    warning: '警告:',
    warningAllData: '此网站的所有分析数据将被永久删除。',
    success: '数据已成功清除。',
    successCount: '{count} 条记录已删除。',
    error: '清除数据时出错。',
    tryAgain: '请重试。',
    dataLimitAlert: '数据限制接近',
    dataLimitDescription: '您在此网站上积累了大量分析数据 ({count} 条记录)。考虑清除旧数据以保持性能。',
    security: {
      title: '安全验证',
      description: '为了确认此操作的破坏性，请回答以下问题：',
      question: '{num1} + {num2} 等于多少？',
      placeholder: '您的答案',
      validate: '验证',
      incorrect: '答案错误。请重试。',
      confirm: '我理解此操作是不可逆的，并确认删除'
    }
  },
  export: {
    pages: '页面',
    interactions: '互动',
    errors: '错误',
    devices: '设备',
    sources: '来源',
  }
}