export default {
  info: {
    text: 'معلومات',
    description: 'هذه رسالة إعلامية.'
  },
  status: {
    text: '3',
    position: 'أعلى النهاية'
  },
  barChart: {
    chartLabels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
  },
  lineChart: {
    chartLabels: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
  },
  pieChart: {
    chartLabels: ['الفريق أ', 'الفريق ب', 'الفريق ج']
  },
  doughnutChart: {
    chartLabels: ['المنتج أ', 'المنتج ب', 'المنتج ج', 'المنتج د']
  },
  radarChart: {
    chartLabels: ['السرعة', 'الرشاقة', 'القوة', 'التحمل', 'التقنية', 'التكتيك', 'العمل الجماعي']
  },
  polarAreaChart: {
    chartLabels: ['المنطقة أ', 'المنطقة ب', 'المنطقة ج', 'المنطقة د', 'المنطقة هـ']
  },
  dataTable: {
    headers: {
      place: 'المكان',
      city: 'المدينة',
      country: 'البلد',
      popularity: 'الشعبية'
    },
    items: [
      { place: 'برج إيفل', city: 'باريس', country: 'فرنسا', popularity: '4.7/5' },
      { place: 'جراند كانيون', city: 'أريزونا', country: 'الولايات المتحدة', popularity: '4.8/5' },
      { place: 'الكولوسيوم', city: 'روما', country: 'إيطاليا', popularity: '4.7/5' }
    ]
  },
  fileUpload: {
    dropzoneText: 'قم بإسقاط ملفاتك هنا أو انقر للتحميل',
    acceptTypes: 'image/*,.pdf,.docx',
    maxFiles: 5,
    maxSize: 10
  },
  photoGallery: {
    images: [
      { alt: 'طبيعة', title: 'منظر طبيعي' },
      { alt: 'جبل', title: 'منظر جبلي' },
      { alt: 'ماء', title: 'شلال' },
      { alt: 'عمارة', title: 'مبنى حديث' }
    ]
  }
} 