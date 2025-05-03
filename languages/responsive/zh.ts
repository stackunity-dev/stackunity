export default {
  meta: {
    title: '响应式查看器',
    description: '在不同设备上查看您的网站'
  },
  url: {
    label: '输入网址',
    placeholder: 'https://example.com',
    select: '选择网址',
    rules: {
      required: '需要网址',
      startWithHttp: '网址必须以 http 或 https 开头'
    }
  },
  controls: {
    autoRefresh: '自动刷新',
    interval: '间隔',
    view: '查看',
    refresh: '刷新'
  },
  intervals: {
    fiveSeconds: '5 秒',
    tenSeconds: '10 秒',
    thirtySeconds: '30 秒',
    oneMinute: '1 分钟'
  },
  devices: {
    iphone: 'iPhone',
    android: 'Android',
    ipad: 'iPad',
    tablet: '平板电脑',
    laptop: '笔记本电脑',
    desktop: '台式电脑'
  },
  messages: {
    iframeError: '此网站无法在 iframe 中显示。',
    openInNewTab: '在新标签页中打开',
    enterUrl: '输入网址以预览',
    urlLoaded: '网址已加载',
    noUrlToRefresh: '没有要刷新的网址'
  }
} 