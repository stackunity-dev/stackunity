export default {
  meta: {
    title: '登录 - StackUnity',
    description: '登录到您的StackUnity帐户以访问所有功能，并开始您的体验'
  },
  hero: {
    title: "StackUnity - 使用StackUnity更快更好地开发",
  },
  form: {
    title: "登录",
    subtitle: "继续您之前的工作",
    email: {
      label: "电子邮件地址",
      required: "电子邮件为必填项",
      invalid: "电子邮件格式无效"
    },
    password: {
      label: "密码",
      required: "密码为必填项",
      minLength: "密码必须至少有6个字符"
    },
    rememberMe: "记住我",
    submit: "登录"
  },
  features: [
    {
      title: "专业模板",
      description: "带有自定义Vuetify组件模板的工作室"
    },
    {
      title: "详细分析",
      description: "可访问性和SEO审核，测试您网站的各个方面"
    },
    {
      title: "监控和SQL生成器",
      description: "网站监控和即用型SQL生成器"
    },
    {
      title: "简洁界面",
      description: "简单直观的界面，更容易使用"
    }
  ],
  createAccount: {
    question: "没有账户？",
    action: "创建账户"
  }
} 