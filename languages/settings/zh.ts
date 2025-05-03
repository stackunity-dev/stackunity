export default {
  navigation: {
    website: '网站',
    appearance: '外观',
    security: '安全',
    cookies: 'Cookie',
    dataPrivacy: '数据与隐私'
  },
  website: {
    title: '网站',
    info: '管理您的网站设置。',
    name: {
      label: '网站名称',
      required: '网站名称是必填项'
    },
    url: {
      label: '网站URL',
      invalid: 'URL必须以https://开头'
    },
    analysis: {
      title: '网站分析',
      description: '分析您的网站以发现所有可索引的URL。',
      button: '分析网站',
      analyzing: '分析中...',
      urlsDetected: '已检测到的URL',
      noUrls: '未检测到URL',
      copy: '复制',
      clear: '清除',
      open: '在新标签页中打开{url}'
    },
    summary: {
      title: '分析摘要',
      totalPages: '总页数',
      averageLoadTime: '平均加载时间',
      warnings: '警告'
    },
    sitemap: {
      title: '已生成的网站地图',
      copy: '复制网站地图',
      download: '下载'
    },
    save: '保存'
  },
  appearance: {
    title: '外观',
    theme: {
      title: '主题',
      greenAmbiance: '绿色氛围',
      dark: '深色',
      system: '系统'
    },
    save: '保存'
  },
  security: {
    title: '安全',
    info: '管理您的账户安全设置。我们建议使用强密码并定期更改。',
    changePassword: {
      title: '更改密码',
      currentPassword: '当前密码',
      newPassword: '新密码',
      confirmPassword: '确认新密码',
      update: '更新密码'
    },
    twoFactor: {
      title: '双因素认证',
      description: '双因素认证为您的账户增加了额外的安全层。',
      status: '状态：',
      enabled: '已启用',
      disabled: '已禁用',
      setup: '设置双因素认证',
      disable: '禁用双因素认证',
      qrCode: '使用您的认证应用扫描此二维码',
      confirmCode: '输入您应用中的6位数验证码',
      confirm: '确认'
    },
    sessions: {
      title: '活动会话',
      thisDevice: '当前设备',
      lastAccess: '最后访问：',
      browser: '浏览器：',
      location: '位置：',
      ip: 'IP：',
      revoke: '撤销',
      revokeAll: '撤销所有其他会话'
    }
  },
  cookies: {
    title: 'Cookie',
    info: '管理本站如何使用cookie。',
    necessary: {
      title: '必要',
      description: '必要cookie有助于使网站能够通过启用页面导航和访问网站的安全区域等基本功能来实现可用性。没有这些cookie，网站将无法正常运行。'
    },
    preferences: {
      title: '偏好',
      description: '偏好cookie使网站能够记住会改变网站行为或外观的信息，例如您的首选语言或您所在的地区。'
    },
    statistics: {
      title: '统计',
      description: '统计cookie通过匿名收集和报告信息，帮助网站所有者了解访问者如何与网站互动。'
    },
    marketing: {
      title: '营销',
      description: '营销cookie用于跟踪访问者在网站上的活动。目的是展示与个人用户相关且具有吸引力的广告，从而对发布商和第三方广告商更有价值。'
    },
    save: '保存偏好',
    deleteAll: '删除所有Cookie'
  },
  privacy: {
    title: '数据与隐私',
    info: '管理您的个人数据和隐私设置。',
    exportData: {
      title: '导出您的数据',
      description: '下载您个人数据的副本。',
      button: '导出数据'
    },
    deleteAccount: {
      title: '删除账户',
      description: '永久删除您的账户和所有相关数据。',
      warning: '警告：此操作无法撤销。您的所有数据将被永久删除。',
      button: '删除账户',
      confirm: '是的，删除我的账户',
      cancel: '取消',
      confirmation: '输入"DELETE"确认'
    },
    premiumStatus: {
      title: '高级账户状态',
      description: '您当前的订阅状态是：',
      premium: '高级版',
      standard: '标准版',
      trial: '试用版',
      free: '免费版'
    }
  },
  notifications: {
    saved: '设置保存成功',
    error: '保存设置时出错',
    passwordChanged: '密码更新成功',
    passwordError: '更新密码时出错',
    dataCopied: '数据已复制到剪贴板',
    sitemapDownloaded: '网站地图已下载',
    analysisStarted: '分析已开始',
    analysisComplete: '分析完成',
    accountDeleted: '账户删除成功',
    appearanceUpdated: '外观更新成功',
    cookiesDeleted: '所有Cookie已删除',
    invalidUrl: '请输入有效的URL，以https://开头'
  }
} 