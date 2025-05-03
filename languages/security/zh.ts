export default {
  meta: {
    title: '安全分析',
    description: '分析您网站的安全漏洞'
  },
  form: {
    urlLabel: '待分析的URL',
    urlPlaceholder: 'https://example.com',
    urlHint: '输入完整URL，包括https://',
    urlRuleInvalid: '请输入以http://或https://开头的有效URL',
    analyzeButton: '分析内容',
    analyzeAriaLabel: '分析内容'
  },
  loading: {
    ariaLabel: '正在加载分析结果'
  },
  results: {
    title: '分析结果',
    globalScore: '全局评分',
    headers: '头信息',
    cookies: 'Cookies',
    vulnerabilities: '漏洞'
  },
  scoreLabel: '评分：{value}%',
  headers: {
    tab: '头信息',
    securityHeaders: '安全头信息',
    scoreLabel: '评分：{value}%',
    missingHeaders: '缺失的头信息',
    allPresent: '所有安全头信息都已存在'
  },
  cookies: {
    tab: 'Cookies',
    securityTitle: 'Cookies安全性',
    scoreLabel: '评分：{value}%',
    secureAttribute: 'Secure属性',
    httpOnlyAttribute: 'HttpOnly属性',
    sameSiteAttribute: 'SameSite属性',
    present: '存在',
    missing: '缺失',
    https: 'HTTPS',
    httpsEnabled: 'HTTPS已启用'
  },
  vulnerabilities: {
    tab: '漏洞',
    title: '检测到的漏洞',
    scoreLabel: '评分：{value}%',
    level: '级别',
    levels: {
      high: '高',
      medium: '中',
      low: '低',
      info: '信息'
    },
    noVulnerabilities: '未检测到漏洞',
    details: {
      title: '详情',
      description: '描述',
      impact: '影响',
      remediation: '修复方法',
      element: '元素',
      problemCode: '问题代码',
      issue: '问题',
      content: '内容',
      recommendation: '建议',
      evidence: '证据',
      detectedVulnerabilities: '检测到的漏洞',
    },
    summary: '检测到的漏洞',
    sensitiveData: '敏感数据',
    issuesDetected: '检测到的漏洞',
    csrf: 'CSRF',
    headerIssues: '头信息问题',
    otherIssues: '其他问题',
  },
  recommendations: {
    title: '安全建议',
    implementHeaders: '实现缺失的头信息',
    secureCookies: '安全化Cookies',
    fixVulnerabilities: '修复漏洞',
    enableHttps: '启用HTTPS'
  }
} 