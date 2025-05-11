export default {
  meta: {
    title: "支付 - StackUnity",
    description: "完成购买以访问 StackUnity 的高级功能",
    keywords: "支付, 结账, StackUnity 高级版, 安全支付"
  },
  features: {
    advancedTools: {
      title: "高级开发工具",
      description: "访问高级开发工具和功能"
    },
    analytics: {
      title: "高级分析工具",
      description: "访问完整的分析数据以供您的网站"
    },
    prioritySupport: {
      title: "优先支持",
      description: "获得所有问题的优先支持"
    },
    regularUpdates: {
      title: "定期更新",
      description: "及时了解最新功能和改进"
    },
    teamCollaboration: {
      title: "团队协作",
      description: "与团队成员无缝协作"
    },
    standardTools: {
      title: "标准开发工具",
      description: "访问标准开发工具和功能"
    },
    basicSupport: {
      title: "基本支持",
      description: "获得问题的基本支持"
    }
  },
  plans: {
    premium: {
      title: "终身高级版",
      description: "无限制访问所有高级功能"
    },
    standard: {
      title: "终身标准版",
      description: "访问标准功能"
    },
    bestChoice: "最佳选择",
    option: {
      standard: "标准版",
      premium: "高级版"
    },
    tooltip: {
      lifetimeAccess: "终身访问",
      standardFeatures: "访问标准功能",
      premiumFeatures: "包含所有高级功能"
    }
  },
  pricing: {
    htPrice: "不含税价格",
    discount: "折扣",
    htPriceAfterDiscount: "折扣后不含税价格",
    vat: "增值税",
    totalTTC: "含税总价",
    oneTimePayment: "一次性付款，终身访问",
    youSave: "您节省了",
    saveVsMonthly: "比月费节省100%"
  },
  vatInfo: {
    selfAssessment: "增值税不适用，CGI 第283-2条 - 增值税自我评估",
    vatNumber: "增值税号码",
    exportOutsideEU: "欧盟外出口 - 增值税不适用"
  },
  benefits: {
    premiumTitle: "高级功能",
    standardTitle: "标准功能",
    premium: [
      "无限制访问所有高级功能",
      "优先支持和更新",
      "高级SEO分析工具",
      "自定义开发工具",
      "团队协作功能",
      "无重复费用 - 一次付款，永久使用"
    ],
    standard: [
      "访问标准功能",
      "定期更新",
      "基本支持",
      "团队协作功能"
    ]
  },
  payment: {
    paymentInformation: "支付信息",
    billingCountry: "账单国家",
    businessCustomer: "我是为企业购买",
    vatNumber: {
      label: "增值税号码（适用于欧盟企业）",
      placeholder: "例如 FR12345678901",
      hint: "输入您的增值税号码以应用反向收费（如果符合条件）"
    },
    promoCode: {
      label: "优惠码",
      placeholder: "输入您的优惠码",
      success: "已应用优惠码",
      error: "无效的优惠码或已使用"
    },
    cardholderName: {
      label: "持卡人姓名",
      placeholder: "卡上的姓名"
    },
    payButton: "支付",
    securePayment: "通过Stripe安全支付"
  },
  messages: {
    vatReverseCharge: "已应用增值税反向收费（0%增值税）",
    taxCalculationError: "计算税款失败",
    paymentConfigError: "支付配置错误。请联系支持。",
    stripeUnavailable: "支付系统不可用。请稍后再试。",
    initError: "初始化支付表单错误。请刷新页面。",
    stripeConnectionError: "无法连接到Stripe。请重试。",
    paymentSuccess: "支付成功！高级访问已激活，发票已发送到您的电子邮件。",
    invoiceError: "支付成功，但发票生成失败。如有需要，请联系支持。",
    postPaymentError: "支付成功，但某些支付后操作失败。请刷新您的页面。",
    premiumUpdateError: "支付成功，但高级状态更新失败。请刷新页面。",
    reloginRequired: "您的高级状态已更新。请重新登录以访问您的高级功能。"
  },
  testimonials: {
    premium: {
      text: "StackUnity 完全改变了我的开发工作流程。投资绝对值得！",
      author: "Nûr D. - 全栈开发者"
    }
  }
} 