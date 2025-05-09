export default {
  timeline: {
    title: 'التاريخ الزمني للمشروع',
    subtitle: '7 أيام آخر',
    text: 'تصوير تاريخي للمعالم الرئيسية والنجاحات في حياة المشروع مع تتبع الأنشطة المفصل.',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d',
    icon: 'mdi-timeline-clock',
    elevation: 3,
    padding: 16,
    rounded: 'xl',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'Filter',
    buttonWidth: 30,
    buttonPosition: 'end',
    showProgress: false,
    variant: 'elevated',
    color: 'deep-orange',
    buttonVariant: 'tonal',
    buttonColor: 'deep-orange-darken-1',
    progressSize: 'small',
    progressColor: 'deep-orange',
    showTimeline: true,
    showSparkline: false
  },

  weather: {
    title: 'لندن, المملكة المتحدة',
    subtitle: 'غير مشمس, 68°F (20°C)',
    text: 'رياح خفيفة عند 6 ميل في الساعة. الرطوبة 65%. احتمال الأمطار 20% في المساء. المؤشر الأقماري 2.',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda',
    icon: 'mdi-weather-partly-cloudy',
    elevation: 3,
    padding: 12,
    rounded: 'xl',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'التوقعات',
    buttonWidth: 0,
    buttonPosition: 'end',
    showProgress: false,
    variant: 'flat',
    color: 'light-blue',
    buttonVariant: 'tonal',
    buttonColor: 'light-blue-darken-1',
    progressSize: 'default',
    progressColor: 'light-blue',
    showTimeline: false,
    showSparkline: true,
    sparklineData: [18, 16, 20, 22, 19, 18, 17],
    sparklineLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sparklineShowLabels: true,
    sparklineLineWidth: 2,
    sparklineColor: 'light-blue',
    sparklineGradient: false
  },

  statistics: {
    title: 'الأداء التجاري',
    subtitle: 'Q1 2024',
    text: 'المبيعات: $2.8M (+22%)\nالربح الإجمالي: $1.9M (+18%)\nالعملاء الجدد: 145 (+35%)',
    image: '',
    icon: 'mdi-finance',
    elevation: 3,
    padding: 16,
    rounded: 'lg',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'التقرير المفصل',
    buttonWidth: 0,
    buttonPosition: 'end',
    showProgress: false,
    showTimeline: false,
    showSparkline: true,
    sparklineType: 'area',
    sparklineData: [120, 145, 138, 162, 185, 175, 198, 220, 210, 245, 260],
    sparklineColor: 'green',
    sparklineHeight: 100,
    sparklineLabelSize: 16,
    sparklineShowValue: true,
    sparklineLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    sparklineShowLabels: true,
    sparklineLineWidth: 2,
    sparklineGradient: false
  },

  file: {
    title: 'العرض الاستراتيجي.pptx',
    subtitle: '8.2 MB - محدث اليوم',
    text: 'عرض مفصل يشمل التحليل السوقي، الأهداف الاستراتيجية والخطة عمل لعام 2024-2025.',
    image: '',
    icon: 'mdi-file-presentation-box',
    variant: '',
    color: 'orange',
    elevation: 2,
    padding: 12,
    rounded: 'lg',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'فتح في github',
    buttonVariant: 'text',
    buttonColor: 'orange-darken-1',
    buttonWidth: 0,
    buttonPosition: 'start',
    buttonIcon: 'mdi-github',
    showProgress: false,
  }
}