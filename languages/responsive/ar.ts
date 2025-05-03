export default {
  meta: {
    title: 'عارض التجاوب',
    description: 'شاهد مواقع الويب الخاصة بك على أجهزة مختلفة'
  },
  url: {
    label: 'أدخل عنوان URL',
    placeholder: 'https://example.com',
    select: 'اختر عنوان URL',
    rules: {
      required: 'عنوان URL مطلوب',
      startWithHttp: 'يجب أن يبدأ عنوان URL بـ http أو https'
    }
  },
  controls: {
    autoRefresh: 'تحديث تلقائي',
    interval: 'الفاصل الزمني',
    view: 'عرض',
    refresh: 'تحديث'
  },
  intervals: {
    fiveSeconds: '5 ثوان',
    tenSeconds: '10 ثوان',
    thirtySeconds: '30 ثانية',
    oneMinute: 'دقيقة واحدة'
  },
  devices: {
    iphone: 'آيفون',
    android: 'أندرويد',
    ipad: 'آيباد',
    tablet: 'جهاز لوحي',
    laptop: 'كمبيوتر محمول',
    desktop: 'كمبيوتر مكتبي'
  },
  messages: {
    iframeError: 'لا يمكن عرض هذا الموقع في إطار iframe.',
    openInNewTab: 'فتح في علامة تبويب جديدة',
    enterUrl: 'أدخل عنوان URL للمعاينة',
    urlLoaded: 'تم تحميل العنوان',
    noUrlToRefresh: 'لا يوجد عنوان URL للتحديث'
  }
} 