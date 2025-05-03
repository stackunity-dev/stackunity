export default {
  meta: {
    title: 'التحليل الدلالي - StackUnity',
    description: 'تحليل البنية الدلالية لموقع الويب الخاص بك، تقييم HTML و ARIA والعلامات الوصفية'
  },
  page: {
    title: 'التحليل الدلالي',
    subtitle: 'تحليل البنية الدلالية لموقع الويب الخاص بك'
  },
  form: {
    urlLabel: 'رابط الموقع المراد تحليله',
    urlPlaceholder: 'https://example.com',
    urlHint: 'أدخل الرابط الكامل بما في ذلك https://',
    urlRule: 'يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://',
    analyzeButton: 'تحليل المحتوى'
  },
  loading: {
    text: 'جارِ تحميل نتائج التحليل'
  },
  results: {
    title: 'نتائج التحليل',
    averageScore: 'متوسط النتيجة',
    scoreLabel: 'النتيجة: {score}%',
    html: {
      title: 'بنية HTML',
      score: 'نتيجة بنية HTML: {score}%',
      elements: 'عناصر بنية HTML'
    },
    aria: {
      title: 'إمكانية الوصول ARIA',
      score: 'نتيجة ARIA: {score}%',
      missingAttributes: 'سمات ARIA المفقودة',
      missingLabels: 'التسميات المفقودة',
      formElementsWithLabels: 'عناصر النموذج مع التسميات',
      missingAriaCount: 'عدد سمات ARIA المفقودة',
      invalidAriaCount: 'سمات ARIA غير صالحة',
      interactiveElementsWithAria: 'العناصر التفاعلية مع ARIA',
      totalInteractiveElements: 'إجمالي العناصر التفاعلية',
      elementsToCompleteWithAria: 'العناصر المراد إكمالها بـ ARIA'
    },
    meta: {
      title: 'العلامات الوصفية',
      score: 'نتيجة العلامات الوصفية: {score}%',
      requiredTags: 'العلامات الوصفية المطلوبة',
      presentCount: 'موجودة: {count}',
      missingCount: 'مفقودة: {count}',
      availableTags: 'العلامات الوصفية المتاحة',
      detailedScore: 'نتيجة مفصلة للعلامات الوصفية',
      essentialTags: 'العلامات الوصفية الأساسية',
      socialTags: 'العلامات الوصفية الاجتماعية',
      technicalTags: 'العلامات الوصفية التقنية',
      contentTags: 'علامات المحتوى الوصفية',
      socialSharingTags: 'علامات المشاركة الاجتماعية',
      htmlCodeOfMetaTags: 'كود HTML للعلامات الوصفية',
      detectedIssues: 'المشكلات المكتشفة'
    },
    readability: {
      title: 'تحليل إمكانية القراءة',
      score: 'النتيجة:',
      grade: 'المستوى:',
      words: 'الكلمات:',
      sentences: 'الجمل:'
    },
    headings: {
      title: 'بنية العناوين',
      structure: 'بنية عناوين الصفحة'
    },
    headingStructure: {
      title: 'بنية العناوين'
    }
  },
  tabs: {
    htmlStructure: 'بنية HTML',
    accessibilityAria: 'إمكانية الوصول ARIA',
    metaTags: 'العلامات الوصفية'
  },
  categories: {
    html: 'HTML',
    aria: 'ARIA',
    meta: 'META'
  },
  elementTitles: {
    doctype: 'DOCTYPE',
    html: 'وسم HTML',
    head: 'وسم HEAD',
    title: 'وسم TITLE',
    body: 'وسم BODY',
    header: 'وسم HEADER',
    main: 'وسم MAIN',
    footer: 'وسم FOOTER',
    navigation: 'التنقل',
    headings: 'العناوين',
    semanticElements: 'العناصر الدلالية',
    lists: 'القوائم',
    images: 'الصور',
    links: 'الروابط',
    tables: 'الجداول',
    forms: 'النماذج'
  },
  suggestions: {
    title: 'اقتراحات التحسين',
    htmlSuggestions: 'اقتراحات لبنية HTML',
    ariaSuggestions: 'اقتراحات لـ ARIA',
    metaSuggestions: 'اقتراحات للعلامات الوصفية',
    noSuggestions: 'لا توجد اقتراحات متاحة. موقع الويب الخاص بك منظم بشكل جيد!'
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