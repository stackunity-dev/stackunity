export default {
  meta: {
    title: 'تحليل المواقع',
    description: 'تحليل أداء موقعك وأمانه وتحسين محركات البحث'
  },
  alerts: {
    noWebsiteData: 'لا توجد بيانات موقع متاحة لهذا الحساب. يرجى إضافة موقع إلى حسابك أدناه.',
    addWebsite: 'إضافة موقع'
  },
  loading: {
    progress: '{value}%'
  },
  cards: {
    websiteData: {
      title: 'بيانات الموقع',
      mainUrl: 'الرابط الرئيسي',
      urlsDetected: 'تم اكتشاف {count} رابط',
      socialMedia: 'معاينة وسائل التواصل الاجتماعي',
      socialUnavailable: 'بيانات وسائل التواصل الاجتماعي غير متوفرة',
      generatedSitemap: 'خريطة الموقع المولدة',
      copySitemap: 'نسخ الخريطة',
      showLess: 'إخفاء',
      showMore: 'عرض {count} أكثر'
    },
    analysis: {
      title: 'تحليل الموقع',
      description: 'قم بإجراء تحليل كامل لموقعك للحصول على معلومات حول الأداء والأمان والمزيد.',
      startAnalysis: 'بدء التحليل'
    },
    metrics: {
      title: 'مقاييس SSUC',
      averageOf: 'متوسط {count} من الروابط',
      performance: 'الأداء',
      seo: 'تحسين محركات البحث',
      security: 'الأمان',
      usability: 'سهولة الاستخدام',
      tooltips: {
        fcp: 'أول رسم للمحتوى',
        lcp: 'أكبر رسم للمحتوى',
        cls: 'التحول التراكمي للتصميم'
      }
    },
    technical: {
      title: 'التحليل التقني',
      robotsTxt: 'ملف Robots.txt',
      sitemap: 'خريطة الموقع',
      ssl: 'شهادة SSL',
      responsiveness: 'تصميم متجاوب',
      headers: 'ترويسات HTTP',
      mobileFriendly: 'متوافق مع الجوال',
      found: 'موجود',
      notFound: 'غير موجود',
      valid: 'صالح',
      invalid: 'غير صالح',
      enabled: 'مفعل',
      disabled: 'معطل',
      secure: 'آمن',
      notSecure: 'غير آمن'
    }
  },
  issues: {
    title: 'المشاكل المكتشفة',
    severity: {
      critical: 'حرجة',
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة',
      info: 'معلومات'
    },
    noIssues: 'لم يتم اكتشاف مشاكل',
    viewAll: 'عرض كل المشاكل',
    fix: 'إصلاح',
    ignore: 'تجاهل'
  },
  pageDetails: {
    title: 'تفاصيل الصفحة',
    mainUrl: 'الرابط الرئيسي',
    lastAnalyzed: 'آخر تحليل: {date}',
    metaTags: 'علامات الميتا',
    headings: 'هيكل العناوين',
    images: 'الصور',
    links: 'الروابط',
    scripts: 'السكريبتات',
    stylesheets: 'أوراق الأنماط',
    noItems: 'لم يتم العثور على عناصر'
  },
  insights: {
    title: 'إحصائيات الموقع',
    pageCount: 'الصفحات المحللة',
    totalIssues: 'مجموع المشاكل',
    avgPageSize: 'متوسط حجم الصفحة',
    avgLoadTime: 'متوسط وقت التحميل'
  },
  buttons: {
    reanalyze: 'إعادة التحليل',
    export: 'تصدير التقرير',
    settings: 'الإعدادات',
    viewDetails: 'عرض التفاصيل',
    found: 'موجود',
    notFound: 'غير موجود',
    viewContent: 'عرض المحتوى',
    issues: 'المشاكل'
  }
} 