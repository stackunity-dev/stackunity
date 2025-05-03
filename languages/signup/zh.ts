export default {
  meta: {
    title: '创建账户 - StackUnity',
    description: '创建您的StackUnity账户以访问所有功能，并开始您的体验'
  },
  hero: {
    title: 'StackUnity - 创建账户',
  },
  form: {
    title: "创建账户",
    subtitle: "加入StackUnity并开始您的体验",
    username: {
      label: "用户名",
      required: "用户名为必填项"
    },
    email: {
      label: "电子邮件地址",
      required: "电子邮件为必填项",
      invalid: "电子邮件格式无效"
    },
    password: {
      label: "密码",
      required: "密码为必填项",
      minLength: "密码必须至少有8个字符"
    },
    submit: "创建账户"
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
    question: "已经拥有账户？",
    action: "登录"
  }
} 