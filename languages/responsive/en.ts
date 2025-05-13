export default {
  meta: {
    title: 'Responsive Viewer',
    description: 'View your websites on different devices'
  },
  url: {
    label: 'Enter a URL',
    placeholder: 'https://example.com',
    select: 'Select a URL',
    rules: {
      required: 'URL required',
      startWithHttp: 'The URL must start with http or https'
    }
  },
  controls: {
    autoRefresh: 'Auto-refresh',
    interval: 'Interval',
    view: 'View',
    refresh: 'Refresh',
    toggleMockup: 'Toggle Mockup',
    rotate: 'Rotate'
  },
  intervals: {
    fiveSeconds: '5 seconds',
    tenSeconds: '10 seconds',
    thirtySeconds: '30 seconds',
    oneMinute: '1 minute'
  },
  devices: {
    iphone: 'iPhone',
    android: 'Android',
    ipad: 'iPad',
    tablet: 'Tablet',
    laptop: 'Laptop',
    desktop: 'Desktop'
  },
  messages: {
    iframeError: 'This site cannot be displayed in an iframe.',
    openInNewTab: 'Open in a new tab',
    enterUrl: 'Enter a URL to preview',
    urlLoaded: 'URL loaded',
    noUrlToRefresh: 'No URL to refresh'
  }
} 