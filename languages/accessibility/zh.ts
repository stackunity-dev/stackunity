export default {
  meta: {
    title: '无障碍功能 - StackUnity',
    description: '为网页开发者提供的无障碍工具'
  },
  contrastChecker: {
    title: '对比度检查器',
    textColor: '文本颜色',
    backgroundColor: '背景颜色',
    colorHint: '支持十六进制、RGB、HSL或颜色名称',
    calculateButton: '计算对比度',
    preview: {
      title: '对比度预览',
      normalText: '普通文本 (16px)',
      largeText: '大文本 (18px+)',
      boldText: '粗体文本',
      italicText: '斜体文本',
      linkExample: '链接示例'
    },
    results: {
      contrastRatio: '对比度比率',
      insufficientContrast: '对比度不足',
      acceptableContrast: '可接受的对比度',
      excellentContrast: '优秀的对比度',
      normalTextRequirement: '普通文本 (最小 4.5:1)',
      largeTextRequirement: '大文本 (最小 3:1)',
      insufficientMessage: '对比度不足，可能影响阅读体验。请尝试使用对比度更高的颜色。',
      successMessage: '恭喜！您的颜色符合无障碍网站的对比度标准。',
      wcagAA: 'WCAG 2.1 AA 标准',
      wcagAAA: 'WCAG 2.1 AAA 标准'
    }
  },
  visionSimulator: {
    title: '视觉障碍模拟器',
    urlLabel: '要模拟的网站 URL',
    urlHint: '输入完整 URL (https://...)',
    visionTypeLabel: '视觉障碍类型',
    intensityLabel: '滤镜强度',
    loading: '加载中...',
    enterUrl: '输入 URL 开始',
    limitedAccess: {
      title: '访问受限',
      description: '升级到高级版以访问所有类型的视觉障碍模拟。',
      upgradeButton: '升级'
    },
    visionTypes: {
      normal: '正常视觉',
      protanopia: '红色盲 (红-绿)',
      deuteranopia: '绿色盲 (红-绿)',
      tritanopia: '蓝色盲 (蓝-黄)',
      achromatopsia: '全色盲 (黑白)',
      blur: '模糊'
    },
    fullscreenControls: {
      exitFullscreen: '退出全屏',
      refreshPage: '刷新页面',
      visionType: '视觉类型',
      otherTypes: '其他类型 (标准版)'
    },
    alerts: {
      invalidUrl: '请输入有效的 URL',
      accessAlert: '此模拟仅适用于标准用户。升级到标准版以访问所有类型的视觉障碍模拟。'
    }
  }
} 