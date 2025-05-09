export default {
  meta: {
    title: '数据库设计器',
    description: '使用我们直观的工具可视化设计您的数据库架构'
  },
  tabs: {
    config: '配置',
    templates: '模板',
    diagram: '图表'
  },
  database: {
    settings: '数据库设置',
    name: '数据库名称',
    namePlaceholder: 'my_database',
    loadSchema: '加载现有架构',
    noTables: '未定义表',
    startAdding: '从向数据库添加表开始'
  },
  table: {
    add: '添加表',
    edit: '编辑表',
    delete: '删除表',
    name: '表名',
    namePlaceholder: 'users',
    description: '描述',
    descriptionPlaceholder: '包含用户信息',
    tables: '数据库表',
    unnamed: '未命名表',
    indices: '索引'
  },
  column: {
    add: '添加列',
    name: '列名',
    namePlaceholder: 'id',
    type: '数据类型',
    length: '长度',
    default: '默认值',
    attributes: '属性',
    nullable: '可空',
    unique: '唯一',
    index: '索引',
    primaryKey: '主键',
    autoIncrement: '自动增量',
    foreignKey: '外键',
    reference: '引用',
    onDelete: '删除时',
    onUpdate: '更新时'
  },
  actions: {
    save: '保存',
    export: '导出',
    delete: '删除',
    cancel: '取消',
    confirm: '确认',
    regenerate: '重新生成SQL',
    generate: '生成SQL',
    copy: '复制到剪贴板',
    download: '下载',
    rearrange: '重新排列'
  },
  export: {
    json: 'JSON',
    sql: 'SQL',
    schema: '架构',
    title: '生成的SQL',
    mongodb: 'MongoDB',
    firestore: 'Firestore',
    dynamodb: 'DynamoDB',
    sequelize: 'Sequelize',
    typeorm: 'TypeORM',
    prisma: 'Prisma',
    mongoose: 'Mongoose'
  },
  relations: {
    oneToOne: '一对一',
    oneToMany: '一对多',
    manyToOne: '多对一',
    manyToMany: '多对多',
    add: '添加关系',
    source: '源表',
    target: '目标表',
    type: '关系类型',
    name: '关系名称',
    through: '中间表',
    title: '外键'
  },
  templates: {
    title: '数据库模板',
    load: '加载模板',
    userAuth: '用户认证',
    blog: '博客系统',
    ecommerce: '电子商务',
    cms: '内容管理系统',
    forum: '论坛系统',
    inventory: '库存管理',
    description: '描述',
    complexity: '复杂度',
    tables: '表',
    relations: '关系',
    info: '点击模板预览其结构。模板为常见用例提供预定义的数据库架构。',
    preview: '模板预览',
    apply: '应用此模板',
    blogSystem: '博客系统',
    ecommerceStore: '电子商务商店',
    projectManagement: '项目管理',
    table_count: '{count}个表',
    column_count: '{count}个列',
    blogDescription: '一个包含用户、文章、分类和评论的基础博客模板',
    ecommerceDescription: '一个包含产品、分类、订单和客户的在线商店模板',
    projectManagementDescription: '一个用于管理项目、任务和团队成员的模板'
  },
  notifications: {
    saved: '数据库架构保存成功',
    copied: 'SQL已复制到剪贴板',
    deleted: '数据库架构已删除',
    error: '发生错误',
    loaded: '架构加载成功',
    notFound: '未找到架构',
    rearranged: '表已重新排列'
  },
  dataTypes: {
    integer: '整数',
    decimal: '小数',
    float: '浮点',
    double: '双精度',
    varchar: '可变字符',
    text: '文本',
    boolean: '布尔',
    date: '日期',
    datetime: '日期时间',
    timestamp: '时间戳',
    json: 'JSON',
    uuid: 'UUID',
    enum: '枚举'
  },
  constraints: {
    cascade: '级联',
    restrict: '限制',
    setNull: '设为空',
    noAction: '无操作',
    setDefault: '设为默认'
  }
} 