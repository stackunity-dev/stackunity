export default {
  meta: {
    title: '关于我们 & 联系方式 - StackUnity',
    description: '了解有关StackUnity的更多信息，并与我们的团队联系以获取任何咨询或支持。',
    keywords: 'StackUnity, 关于, 联系, 使命, 价值观, 网页开发, 团队, 支持, 开发者, 无障碍',
    author: 'StackUnity'
  },
  nav: {
    backToHome: '返回首页'
  },
  about: {
    title: '关于StackUnity',
    subtitle: '您的一体化开发工具包',
    mission: {
      title: '我们的使命',
      content: '在StackUnity，我们的使命是为开发者提供所需的工具，使他们能够创建卓越的网络应用程序，同时减少复杂性和开发时间。我们相信，网络开发应该对所有人开放，从初学者到专家，而正确的工具可以对开发者工作的质量和效率产生很大的影响。'
    },
    quote: {
      content: "我们的愿景是创建一个生态系统，在这个生态系统中，每个开发者都可以轻松地将他们的想法转化为功能性、美观且高性能的网络应用程序，而不必掌握众多不同的工具。",
      author: "Nûr Djedidi，创始人"
    },
    team: {
      title: '我们的团队',
      content: '我们是一个充满激情的开发者、设计师和技术爱好者团队，致力于为开发社区创建直观且有效的解决方案。我们多样化的背景和专业知识使我们能够理解现代开发者面临的挑战。'
    },
    values: {
      title: '我们的价值观',
      items: [
        {
          title: '创新',
          content: '我们不断寻找新的方法来改进我们的平台并为用户提供更多价值。',
          icon: 'mdi-lightbulb-on',
          color: 'info'
        },
        {
          title: '简洁',
          content: '我们相信最好的工具是那些易于使用的工具，同时又功能强大且灵活。',
          icon: 'mdi-leaf',
          color: 'success'
        },
        {
          title: '卓越',
          content: '我们努力为用户提供最高质量、可靠且高效的工具。',
          icon: 'mdi-trophy',
          color: 'warning'
        },
        {
          title: '社区',
          content: '我们重视开发者社区内的协作和相互支持。',
          icon: 'mdi-account-group',
          color: 'primary'
        }
      ]
    },
    getInTouch: {
      title: '联系我们',
      content: '对StackUnity有疑问或想了解更多关于我们公司的信息？请随时联系我们。',
      button: '联系我们'
    }
  },
  contact: {
    title: '联系我们',
    subtitle: '我们很乐意听取您的问题、评论或建议。填写下面的表格，我们将尽快回复您。',
    form: {
      name: '您的姓名',
      email: '您的电子邮件',
      subject: '主题',
      subjects: {
        general: '一般问题',
        technical: '技术支持',
        feature: '功能请求',
        bug: '错误报告',
        partnership: '合作关系',
        other: '其他'
      },
      message: '您的消息',
      submit: '发送消息',
      sending: '正在发送...',
      successTitle: '消息已发送！',
      successMessage: '您的消息已成功发送！我们将尽快回复。',
      errorTitle: '错误',
      errorMessage: '发送消息时出现错误。请重试。',
      required: '必填字段',
      invalidEmail: '请输入有效的电子邮件地址',
      fillAllFields: '请填写所有字段。'
    },
    info: {
      title: '其他联系方式',
      email: {
        title: '给我们发送电子邮件',
        content: '一般咨询：hello@stackunity.com',
        support: '技术支持：support@stackunity.com'
      },
      social: {
        title: '社交媒体',
        content: '在社交媒体上关注我们，获取更新、提示等。'
      },
      office: {
        title: '我们的办公室',
        content: 'StackUnity总部, 123 Tech Avenue, San Francisco, CA 94107'
      }
    },
    faq: {
      title: '常见问题',
      questions: [
        {
          question: 'StackUnity是什么？',
          answer: 'StackUnity是一个全面的网络开发工具包，为网络开发者提供了一系列工具，包括API测试、数据库设计、可访问性验证等。'
        },
        {
          question: '如何开始使用StackUnity？',
          answer: '只需创建一个免费账户，您就可以立即开始使用我们的基本工具。要访问高级功能，请查看我们的订阅选项。'
        },
        {
          question: '是否有免费计划可用？',
          answer: '是的，StackUnity提供包含核心功能的免费层级。高级功能可通过我们的付费订阅计划获得。'
        },
        {
          question: '如何报告问题或建议功能？',
          answer: '您可以通过我们的联系表单或发送电子邮件至support@stackunity.com提交问题或功能请求。'
        }
      ]
    }
  },
  footer: {
    copyright: "保留所有权利。"
  }
} 