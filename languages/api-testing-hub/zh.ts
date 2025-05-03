export default {
  meta: {
    title: 'API 测试中心',
    description: '使用我们友好的界面测试您的 RESTful API'
  },
  alerts: {
    deleteWarning: '警告：使用 DELETE 方法时请谨慎。',
    noCustomHeaders: '此请求未发送自定义标头。',
    runTests: '运行测试以查看结果。'
  },
  cardTitles: {
    newTest: '新的 API 测试',
    response: '响应',
    history: '请求历史',
    documentation: 'OpenAPI 文档',
    apiTests: '自动化 API 测试',
    status: '状态',
    historySettings: '历史设置',
    historyCount: '请求数量'
  },
  tooltips: {
    historySettings: '历史设置',
    commonHeaders: '浏览器自动添加的常用标头'
  },
  forms: {
    method: '方法',
    url: 'URL',
    urlPlaceholder: 'https://api.example.com/endpoint',
    tabs: {
      headers: '标头',
      body: '正文',
      params: '参数',
      docs: '文档',
      tests: '测试',
      raw: '原始',
      tree: '树形',
      response: '响应标头',
      request: '请求标头'
    },
    headers: {
      key: '键',
      keyPlaceholder: 'Authorization',
      value: '值',
      valuePlaceholder: 'Bearer token123',
      add: '添加标头',
      common: '常用标头',
      commonNote: '一些标准标头 由浏览器自动添加，不会在此显示。',
      etc: '等）由浏览器自动添加，不会在此显示。'
    },
    params: {
      key: '键',
      keyPlaceholder: 'page',
      value: '值',
      valuePlaceholder: '1',
      add: '添加参数'
    },
    body: {
      label: 'Body',
      placeholder: '{"键": "值"}'
    },
    submit: '发送请求',
    send: '发送请求',
    schemaDepth: '架构深度',
    showExamples: '显示示例',
    impact: '影响:',
    result: '结果',
    status: '状态',
    data: '数据',
    saveToHistory: '保存请求到历史记录'
  },
  response: {
    status: '状态',
    tabs: {
      body: '正文',
      headers: '标头',
      docs: '文档',
      tests: '测试'
    },
    bodyViews: {
      raw: '原始',
      tree: '树形'
    },
    headerTypes: {
      response: '响应标头',
      request: '请求标头'
    },
    noCustomHeaders: '此请求未发送自定义标头。'
  },
  docs: {
    title: 'OpenAPI 文档',
    download: '下载',
    schemaDepth: '架构深度',
    showExamples: '显示示例'
  },
  apiTests: {
    title: '自动化 API 测试',
    run: '运行测试',
    results: {
      success: '成功',
      failure: '失败',
      pending: '待处理'
    },
    generate: '生成测试',
    testTypes: {
      status: '状态检查',
      schema: '架构验证',
      dataPresence: '数据存在性',
      performance: '性能'
    }
  },
  history: {
    title: '请求历史',
    noHistory: '没有可用的历史记录',
    clearAll: '全部清除',
    saveAs: '另存为',
    load: '加载',
    delete: '删除',
    settings: {
      title: '历史设置',
      maxEntries: '最大条目数',
      saveAutomatically: '自动保存请求',
      includeHeaders: '包括标头',
      includeBody: '包括正文',
      save: '保存设置'
    }
  },
  collection: {
    title: '集合',
    create: '创建集合',
    import: '导入',
    export: '导出',
    addRequest: '添加请求至集合',
    name: '集合名称',
    description: '描述'
  },
  errors: {
    invalidUrl: '无效的 URL',
    networkError: '网络错误',
    timeout: '请求超时',
    serverError: '服务器错误'
  },
  buttons: {
    save: '保存',
    cancel: '取消',
    close: '关闭',
    run: '运行',
    copy: '复制',
    clear: '清除',
    delete: '删除',
    download: '下载'
  }
} 