export default {
  meta: {
    title: 'تحليل المحتوى - StackUnity',
    description: 'تحليل الهيكل والجودة من صفحات الويب الخاصة بك لتعزيز SEO'
  },
  page: {
    title: 'تحليل المحتوى',
    subtitle: 'تحليل الهيكل والجودة من صفحات الويب الخاصة بك لتعزيز SEO'
  },
  form: {
    urlLabel: 'الرابط الخاص بالموقع الذي تريد تحليله',
    urlPlaceholder: 'https://example.com',
    urlHint: 'أدخل الرابط بالكامل بما في ذلك https://',
    urlRule: 'يرجى إدخال رابط صالح بدءًا بـ http:// أو https://',
    crawlEnabled: 'تحليل أيضًا الصفحات المرتبطة',
    crawlHint: 'الحد: 10 روابط على الأكثر',
    analyzeButton: 'تحليل المحتوى'
  },
  loading: {
    text: 'تحليل قيد التنفيذ'
  },
  averageScore: {
    title: 'متوسط درجة المحتوى',
    calculated: 'تم حساب الدرجة المتوسطة من {count} صفحة تم تحليلها',
    exportButton: 'تصدير'
  },
  contentScore: {
    title: 'درجة المحتوى',
    excellent: 'مثالي',
    good: 'جيد',
    average: 'متوسط',
    poor: 'ضعيف',
    critical: 'حرج'
  },
  improvement: {
    title: 'أولوية التحسين',
    lowestScore: 'الصفحة التي تحتوي على الدرجة الأقل ({score}%) هي',
    openInNew: 'فتح في علامة تبويب جديدة'
  },
  trends: {
    improving: 'تحسين',
    declining: 'تراجع',
    stable: 'مستقر',
    tooltipImproving: 'تحسن جودة المحتوى عبر الصفحات',
    tooltipDeclining: 'تراجع جودة المحتوى عبر الصفحات',
    tooltipStable: 'جودة المحتوى متسقة عبر الصفحات'
  },
  statistics: {
    title: 'إحصاءات المحتوى',
    wordCount: 'عدد الكلمات',
    readabilityScore: 'درجة القابلية للقراءة',
    headingsDetected: 'تم الكشف عن العناوين',
    links: 'الروابط',
    internal: 'داخلي',
    external: 'خارجي'
  },
  readability: {
    veryEasy: 'من السهل جدا',
    easy: 'سهل',
    fairlyEasy: 'من السهل',
    standard: 'معياري',
    fairlyDifficult: 'معقد جدا',
    difficult: 'معقد',
    veryDifficult: 'معقد جدا'
  },
  wordCount: {
    tooShort: 'قصير جدا',
    short: 'قصير',
    good: 'جيد',
    excellent: 'مثالي'
  },
  headings: {
    title: 'هيكلة العناوين',
    noHeadings: 'لم يتم الكشف عن أي عناوين (H1-H6) على هذه الصفحة.'
  },
  issues: {
    title: 'المشاكل المكتشفة',
    noIssues: 'لم يتم الكشف عن أي مشاكل أساسية.',
    missingH1: 'عنوان H1 مفقود',
    multipleH1: 'عناوين H1 متعددة',
    shortContent: 'المحتوى قصير جدا',
    poorReadability: 'درجة القابلية للقراءة قليلة',
    lowKeywordDensity: 'كثافة الكلمات المستهدفة',
    missingAltText: 'الصور مفقودة',
    brokenHeadingStructure: 'هيكلة العناوين مكسورة',
    lowWordCount: 'عدد الكلمات قليل',
    duplicateTitle: 'عنوان مكرر و H1',
    noExternalLinks: 'لا يوجد روابط خارجية',
    tooManyLinks: 'عدد الروابط كثير',
    lowTextToHtmlRatio: 'نسبة النص إلى HTML قليلة'
  },
  images: {
    title: 'تحليل الصور',
    preview: 'عرض الصورة',
    altText: 'النص البديل',
    missingAlt: 'النص البديل مفقود',
    hasAlt: 'النص البديل موجود',
    dimensions: 'الأبعاد',
    hasDimensions: 'مضبوط',
    noDimensions: 'لا يوجد أبعاد'
  },
  keywords: {
    title: 'تحليل الكلمات المفتاحية',
    topKeywords: 'الكلمات المفتاحية الأكثر شيوعا',
    density: 'الكثافة',
    optimal: 'مثالي',
    tooLow: 'قليل',
    tooHigh: 'عالي',
    noKeywords: 'لم يتم الكشف عن أي كلمات مفتاحية ذات أهمية'
  },
  seo: {
    title: 'عناصر SEO',
    metaTitle: 'عنوان Meta',
    metaDescription: 'وصف Meta',
    canonical: 'رابط Canonical',
    og: 'علامات Open Graph',
    missingElement: 'مفقود',
    tooShort: 'قصير',
    tooLong: 'طويل',
    good: 'جيد'
  },
  recommendations: {
    title: 'التوصيات',
    excellentQuality: {
      title: 'جودة المحتوى المثالية',
      description: 'يتم ترتيب المحتوى بشكل جيد ومضبوط لتعزيز SEO. استمر في العمل بشكل جيد!'
    },
    improveContent: {
      title: 'كيفية تحسين المحتوى',
      addMoreContent: {
        title: 'أضف المزيد من المحتوى',
        description: 'يحتوي المحتوى الخاص بك على {count} كلمة. يرجى توسيعه إلى 800-1000 كلمة على الأقل لتعزيز أداء SEO.'
      },
      addH1: {
        title: 'أضف عنوان H1',
        description: 'يجب أن يحتوي كل صفحة على عنوان H1 واحد يصف المحتوى الخاص بها.'
      },
      multipleH1: {
        title: 'استخدم عنوان H1 واحد فقط',
        description: 'لديك {count} عنوان H1. لتعزيز SEO، استخدم عنوان H1 واحد وقم بترتيب العناوين الأخرى باستخدام H2-H6.'
      },
      addH2: {
        title: 'أضف عناوين H2',
        description: 'استخدم عناوين H2 لتقسيم المحتوى إلى أقسام منطقية لتعزيز القابلية للقراءة وSEO.'
      },
      addAltText: {
        title: 'أضف النص البديل للصور',
        description: '{count} صورة مفقودة النص البديل. أضف نص بديل موضوعي لجميع الصور لتعزيز الوصول وSEO.'
      },
      improveReadability: {
        title: 'تحسين القابلية للقراءة',
        description: 'يحتوي المحتوى الخاص بك على درجة قابلية للقراءة {score}. يرجى استخدام جمل قصيرة ولغة أبسط.'
      },
      addInternalLinks: {
        title: 'أضف روابط داخلية',
        description: 'أضف روابط إلى صفحات ذات صلة على موقعك لتعزيز التنقل وSEO.'
      },
      addExternalLinks: {
        title: 'أضف روابط خارجية',
        description: 'أنشئ روابط إلى مصادر خارجية ذات صلة تزيد من المصداقية وقيمة SEO.'
      },
      generalImprovements: {
        title: 'التحسينات العامة',
        description: '- استخدم لغة أكثر تنوعًا ومثيرة\n- أضف عناصر متعددة الوسائط (صور، فيديوهات، أنفوغرافيك)\n- استخدم أمثلة خاصة وبيانات لدعم نقاطك\n- قم بترتيب المحتوى بوضوح مع المقدمات والاستنتاجات'
      }
    },
    seoTips: {
      title: 'نصائح SEO',
      useKeywords: {
        title: 'استخدم الكلمات المستهدفة',
        description: 'استخدم الكلمات المستهدفة في العنوان، ووصف Meta، والمحتوى.'
      },
      addAltText: {
        title: 'أضف النص البديل للصور',
        description: '{count} صورة مفقودة النص البديل. أضف نص بديل موضوعي لجميع الصور لتعزيز الوصول وSEO.'
      },
      addH2: {
        title: 'أضف عناوين H2',
        description: 'استخدم عناوين H2 لتقسيم المحتوى إلى أقسام منطقية لتعزيز القابلية للقراءة وSEO.'
      },
      addH1: {
        title: 'أضف عنوان H1',
        description: 'يجب أن يحتوي كل صفحة على عنوان H1 واحد يصف المحتوى الخاص بها.'
      },
      addMoreContent: {
        title: 'أضف المزيد من المحتوى',
        description: 'يحتوي المحتوى الخاص بك على {count} كلمة. يرجى توسيعه إلى 800-1000 كلمة على الأقل لتعزيز أداء SEO.'
      },
      addExternalLinks: {
        title: 'أضف روابط خارجية',
        description: 'أنشئ روابط إلى مصادر خارجية ذات صلة تزيد من المصداقية وقيمة SEO.'
      },
      addInternalLinks: {
        title: 'أضف روابط داخلية',
        description: 'أضف روابط إلى صفحات ذات صلة على موقعك لتعزيز التنقل وSEO.'
      },
      generalImprovements: {
        title: 'التحسينات العامة',
        description: '- استخدم لغة أكثر تنوعًا ومثيرة\n- أضف عناصر متعددة الوسائط (صور، فيديوهات، أنفوغرافيك)\n- استخدم أمثلة خاصة وبيانات لدعم نقاطك\n- قم بترتيب المحتوى بوضوح مع المقدمات والاستنتاجات'
      },
      optimizeMeta: {
        title: 'تحسين وصف Meta',
        description: 'أنشئ وصف Meta مثير (150-160 كلمة) يشمل الكلمات المستهدفة.'
      },
      improveSpeed: {
        title: 'تحسين سرعة الصفحة',
        description: 'تحسين الصور، تقليل البرامج النصية، واستخدام إعادة تحميل المتصفح لتعزيز أداء التحميل.'
      },
      mobileOptimization: {
        title: 'تحسين التحميل على الموبايل',
        description: 'تأكد من أن الصفحة متجاوبة بشكل كامل وتقدم تجربة جيدة للمستخدمين على الأجهزة المحمولة.'
      },
      useSchema: {
        title: 'استخدم المخطط',
        description: 'استخدم المخطط schema.org لوصف المحتوى لمساعدة المحركات البحثية على فهمه وزيادة معدلات النقر في نتائج البحث.'
      }
    }
  },
  error: {
    title: 'خطأ',
    message: 'فشل تحليل الرابط. يرجى التحقق من الرابط وإعادة المحاولة.',
    retry: 'إعادة المحاولة'
  }
} 