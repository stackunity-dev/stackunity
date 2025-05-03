export default {
  meta: {
    title: 'تحليل أداء الموقع - StackUnity',
    description: 'تحليل سرعة التحميل ومقاييس الأداء لموقع الويب الخاص بك'
  },
  page: {
    title: 'تحليل أداء الموقع',
    subtitle: 'تحليل سرعة التحميل ومقاييس الأداء لموقع الويب الخاص بك'
  },
  form: {
    urlLabel: 'رابط الموقع المراد تحليله',
    urlPlaceholder: 'https://example.com',
    urlHint: 'أدخل الرابط الكامل بما في ذلك https://',
    urlRule: 'يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://',
    analyzeButton: 'تحليل الأداء'
  },
  loading: {
    text: 'جارِ تحميل نتائج التحليل'
  },
  results: {
    title: 'نتائج تحليل الأداء',
    averageScore: 'متوسط نتيجة الأداء',
    scoreLabel: 'النتيجة: {score}%',
    metrics: {
      title: 'المقاييس الأساسية',
      loadingMetrics: 'مقاييس التحميل',
      scoreBreakdown: 'تفصيل نتيجة الأداء',
      firstContentfulPaint: {
        title: 'أول رسم محتوى',
        short: 'FCP',
        description: 'الوقت حتى يعرض المتصفح أول جزء من المحتوى'
      },
      largestContentfulPaint: {
        title: 'أكبر رسم محتوى',
        short: 'LCP',
        description: 'الوقت حتى يتم عرض أكبر عنصر محتوى'
      },
      speedIndex: {
        title: 'مؤشر السرعة',
        short: 'SI',
        description: 'مدى سرعة عرض المحتوى بصريًا أثناء تحميل الصفحة'
      },
      totalBlockingTime: {
        title: 'إجمالي وقت الحظر',
        short: 'TBT',
        description: 'مجموع الوقت الذي كان فيه المؤشر الرئيسي محظورًا'
      },
      cumulativeLayoutShift: {
        title: 'التحول التراكمي للتخطيط',
        short: 'CLS',
        description: 'مقياس الاستقرار البصري أثناء تحميل الصفحة'
      },
      timeToInteractive: {
        title: 'الوقت حتى التفاعل',
        short: 'TTI',
        description: 'الوقت حتى تصبح الصفحة تفاعلية بالكامل'
      }
    },
    resources: {
      title: 'الموارد',
      networkRequests: 'طلبات الشبكة',
      resourceSizes: 'أحجام الموارد',
      resourceTypes: 'أنواع الموارد',
      requestCount: 'عدد الطلبات:',
      totalSize: 'الحجم الإجمالي:',
      transferSize: 'حجم النقل:',
      contentType: 'نوع المحتوى',
      size: 'الحجم',
      transferTime: 'وقت النقل'
    },
    optimization: {
      title: 'التحسين',
      opportunities: 'فرص التحسين',
      diagnostics: 'تشخيصات الأداء',
      passed: 'التدقيقات الناجحة',
      wastefulResizing: 'صور ذات ترميز أو تحجيم غير فعال',
      uncompressedImages: 'ترميز الصور بكفاءة',
      unusedJavascript: 'إزالة JavaScript غير المستخدم',
      unusedCss: 'إزالة CSS غير المستخدم',
      preconnectOrigins: 'الاتصال المسبق بالمصادر المطلوبة',
      thirdParty: 'تقليل تأثير كود الطرف الثالث',
      fontDisplay: 'التأكد من بقاء النص مرئيًا أثناء تحميل خطوط الويب',
      potential: 'التوفير المحتمل:'
    },
    scoreIntervals: {
      excellent: 'ممتاز',
      needsImprovement: 'يحتاج إلى تحسين',
      poor: 'ضعيف',
      excellentRange: '90-100: ممتاز',
      improvementRange: '50-89: يحتاج إلى تحسين',
      poorRange: '0-49: ضعيف'
    }
  },
  tabs: {
    metrics: 'المقاييس الأساسية',
    resources: 'الموارد',
    optimization: 'التحسين'
  },
  summary: {
    title: 'ملخص الأداء',
    baselineMetrics: 'مقاييس الخط الأساسي',
    optimizationScore: 'نتيجة التحسين:',
    resourceEfficiency: 'كفاءة الموارد:',
    loadingSpeed: 'سرعة التحميل:',
    userExperience: 'تجربة المستخدم:'
  },
  export: {
    title: 'تصدير النتائج',
    pdf: 'تصدير كملف PDF',
    csv: 'تصدير كملف CSV',
    json: 'تصدير كملف JSON'
  },
  error: {
    title: 'خطأ',
    message: 'فشل في تحليل الرابط. يرجى التحقق من الرابط والمحاولة مرة أخرى.',
    retry: 'إعادة المحاولة'
  }
} 