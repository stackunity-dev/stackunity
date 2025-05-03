export default {
  meta: {
    title: 'تحليل المحتوى - StackUnity',
    description: 'تحليل بنية وجودة صفحات الويب الخاصة بك لتحسين محركات البحث'
  },
  page: {
    title: 'تحليل المحتوى',
    subtitle: 'تحليل بنية وجودة صفحات الويب الخاصة بك لتحسين محركات البحث'
  },
  form: {
    urlLabel: 'رابط الموقع المراد تحليله',
    urlPlaceholder: 'https://example.com',
    urlHint: 'أدخل الرابط الكامل متضمناً https://',
    urlRule: 'الرجاء إدخال رابط صالح يبدأ بـ http:// أو https://',
    crawlEnabled: 'تحليل الصفحات المرتبطة أيضاً',
    crawlHint: 'الحد الأقصى: 10 روابط',
    analyzeButton: 'تحليل المحتوى'
  },
  loading: {
    text: 'التحليل قيد التقدم'
  },
  averageScore: {
    title: 'متوسط درجة المحتوى',
    calculated: 'متوسط الدرجة محسوب من {count} صفحات محللة',
    exportButton: 'تصدير'
  },
  contentScore: {
    title: 'درجة المحتوى',
    excellent: 'ممتاز',
    good: 'جيد',
    average: 'متوسط',
    poor: 'ضعيف',
    critical: 'حرج'
  },
  improvement: {
    title: 'أولوية التحسين',
    lowestScore: 'الصفحة ذات الدرجة الأدنى ({score}%) هي',
    openInNew: 'فتح في علامة تبويب جديدة'
  },
  trends: {
    improving: 'في تحسن',
    declining: 'في تراجع',
    stable: 'مستقر',
    tooltipImproving: 'جودة المحتوى في تحسن عبر الصفحات',
    tooltipDeclining: 'جودة المحتوى في تراجع عبر الصفحات',
    tooltipStable: 'جودة المحتوى ثابتة عبر الصفحات'
  },
  statistics: {
    title: 'إحصائيات المحتوى',
    wordCount: 'عدد الكلمات',
    readabilityScore: 'درجة القراءة',
    headingsDetected: 'العناوين المكتشفة',
    links: 'الروابط',
    internal: 'داخلية',
    external: 'خارجية'
  },
  readability: {
    veryEasy: 'سهل جداً',
    easy: 'سهل',
    fairlyEasy: 'سهل نسبياً',
    standard: 'قياسي',
    fairlyDifficult: 'صعب نسبياً',
    difficult: 'صعب',
    veryDifficult: 'صعب جداً'
  },
  wordCount: {
    tooShort: 'قصير جداً',
    short: 'قصير',
    good: 'جيد',
    excellent: 'ممتاز'
  },
  headings: {
    title: 'بنية العناوين',
    noHeadings: 'لم يتم اكتشاف عناوين (H1-H6) في هذه الصفحة.'
  },
  issues: {
    title: 'المشاكل المكتشفة',
    noIssues: 'لم يتم اكتشاف مشاكل كبيرة في المحتوى.',
    missingH1: 'عنوان H1 مفقود',
    multipleH1: 'عناوين H1 متعددة',
    shortContent: 'المحتوى قصير جداً',
    poorReadability: 'درجة قراءة ضعيفة',
    lowKeywordDensity: 'كثافة كلمات مفتاحية منخفضة',
    missingAltText: 'صور تفتقد نص بديل',
    brokenHeadingStructure: 'بنية عناوين مكسورة',
    lowWordCount: 'عدد كلمات منخفض',
    duplicateTitle: 'عنوان و H1 متكرران',
    noExternalLinks: 'لا توجد روابط خارجية',
    tooManyLinks: 'روابط كثيرة جداً',
    lowTextToHtmlRatio: 'نسبة نص إلى HTML منخفضة'
  },
  images: {
    title: 'تحليل الصور',
    preview: 'معاينة الصورة',
    altText: 'النص البديل',
    missingAlt: 'نص بديل مفقود',
    hasAlt: 'نص بديل موجود',
    dimensions: 'الأبعاد',
    hasDimensions: 'مُحسّنة',
    noDimensions: 'بدون أبعاد'
  },
  keywords: {
    title: 'تحليل الكلمات المفتاحية',
    topKeywords: 'أهم الكلمات المفتاحية',
    density: 'الكثافة',
    optimal: 'مثالية',
    tooLow: 'منخفضة جداً',
    tooHigh: 'مرتفعة جداً',
    noKeywords: 'لم يتم اكتشاف كلمات مفتاحية مهمة'
  },
  seo: {
    title: 'عناصر تحسين محركات البحث',
    metaTitle: 'عنوان ميتا',
    metaDescription: 'وصف ميتا',
    canonical: 'رابط قانوني',
    og: 'علامات Open Graph',
    missingElement: 'مفقود',
    tooShort: 'قصير جداً',
    tooLong: 'طويل جداً',
    good: 'جيد'
  },
  recommendations: {
    title: 'التحسينات الموصى بها',
    seoTips: {
      title: 'أفكار تحسين محركات البحث',
      useKeywords: {
        title: 'استخدم كلمات الهدف',
        description: 'استخدم كلمات الهدف المناسبة لمحتواك في العنوان والوصف الميتا والمحتوى.'
      },
      addAltText: {
        title: 'إضافة نص بديل للصور',
        description: 'إضافة نص بديل للصور لتحسين الوصول وتحسين التصميم.'
      },
      addH2: {
        title: 'إضافة عناوين H2',
        description: 'إضافة عناوين H2 لتقسيم المحتوى إلى أقسام منطقية لتحسين القراءة وتحسين التصميم.'
      },
      addH1: {
        title: 'إضافة عنوان H1',
        description: 'إضافة عنوان H1 لوصف المحتوى بشكل منطقي.'
      },
      multipleH1: {
        title: 'استخدم عنوان H1 واحد',
        description: 'لديك {count} عناوين H1. لتحسين التصميم، استخدم عنوان H1 واحد وقم بترتيب العناوين الأخرى باستخدام H2-H6.'
      },
      addMoreContent: {
        title: 'إضافة المزيد من المحتوى',
        description: 'إضافة المزيد من المحتوى لتحسين التصميم وتحسين التصميم.'
      },
      addExternalLinks: {
        title: 'إضافة روابط خارجية',
        description: 'إضافة روابط خارجية لتحسين الوصول وتحسين التصميم.'
      },
      addInternalLinks: {
        title: 'إضافة روابط داخلية',
        description: 'إضافة روابط داخلية لتحسين الوصول وتحسين التصميم.'
      },
      generalImprovements: {
        title: 'التحسينات العامة',
        description: 'استخدم لغة أكثر تنوعاً ومثيرة للقراءة. إضافة العناصر المتعددة الوسائط (الصور، الفيديوهات، المخططات)، وتضمين الأمثلة المحددة والبيانات لدعم نقاطك. قم بترتيب المحتوى باستخدام مقدمة ونهاية منطقية.'
      },
      optimizeMeta: {
        title: 'تحسين الوصف الميتا',
        description: 'إنشاء وصف ميتا مؤثر (150-160 كلمة) يحتوي على كلمات الهدف المناسبة.'
      },
      improveSpeed: {
        title: 'تحسين سرعة الصفحة',
        description: 'تحسين الصور وتقليل البرامج النصية واستغلال التخزين المؤقت لتحسين الوقت الحديث.'
      },
      mobileOptimization: {
        title: 'تحسين التصميم المتعدد الأجهزة',
        description: 'التأكد من أن الصفحة متعددة الأجهزة وتوفير تجربة جيدة للمستخدمين على الأجهزة المختلفة.'
      },
      useSchema: {
        title: 'استخدام تسميات Schema',
        description: 'استخدام تسميات Schema.org لوصف المحتوى لتحسين فهم المحركات البحثية وزيادة النقرات في النتائج.'
      }
    }
  },
  error: {
    title: 'خطأ',
    message: 'فشل في تحليل الرابط. الرجاء التحقق من الرابط والمحاولة مرة أخرى.',
    retry: 'إعادة المحاولة'
  }
} 