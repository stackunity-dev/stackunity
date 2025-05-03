export default {
  info: {
    text: '信息',
    description: '这是一条信息消息。'
  },
  status: {
    text: '3',
    position: '顶端'
  },
  barChart: {
    chartLabels: ['一月', '二月', '三月', '四月', '五月', '六月']
  },
  lineChart: {
    chartLabels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  pieChart: {
    chartLabels: ['团队A', '团队B', '团队C']
  },
  doughnutChart: {
    chartLabels: ['产品A', '产品B', '产品C', '产品D']
  },
  radarChart: {
    chartLabels: ['速度', '敏捷性', '力量', '耐力', '技术', '战术', '团队合作']
  },
  polarAreaChart: {
    chartLabels: ['区域A', '区域B', '区域C', '区域D', '区域E']
  },
  dataTable: {
    headers: {
      place: '地点',
      city: '城市',
      country: '国家',
      popularity: '人气'
    },
    items: [
      { place: '埃菲尔铁塔', city: '巴黎', country: '法国', popularity: '4.7/5' },
      { place: '大峡谷', city: '亚利桑那州', country: '美国', popularity: '4.8/5' },
      { place: '罗马斗兽场', city: '罗马', country: '意大利', popularity: '4.7/5' }
    ]
  },
  fileUpload: {
    dropzoneText: '将文件拖放到此处或点击上传',
    acceptTypes: 'image/*,.pdf,.docx',
    maxFiles: 5,
    maxSize: 10
  },
  photoGallery: {
    images: [
      { alt: '自然', title: '自然风景' },
      { alt: '山脉', title: '山景' },
      { alt: '水景', title: '瀑布' },
      { alt: '建筑', title: '现代建筑' }
    ]
  }
} 