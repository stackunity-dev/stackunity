export default {
  meta: {
    title: 'مولد ملفات Robots.txt و Schema.org',
    description: 'إنشاء ملفات robots.txt وبيانات Schema.org المنظمة لموقع الويب الخاص بك'
  },
  privacyNotice: {
    title: 'إشعار الخصوصية',
    content: 'لا يتم جمع أو تخزين أي بيانات على خوادمنا أثناء عملية الإنشاء. تتم معالجة جميع المحتويات محليًا في متصفحك.'
  },
  errorInfo: {
    title: 'معلومات:',
    stillGenerate: 'فشل تدقيق تحسين محركات البحث، ولكن لا يزال بإمكانك إنشاء محتوى باستخدام البيانات الحالية.',
    solutions: 'حلول ممكنة للتدقيق:',
    chromeServer: 'تأكد من تثبيت Google Chrome على الخادم',
    chromeAccess: 'يجب أن يتمتع مستخدم الخادم بحق الوصول إلى ملف chrome.exe'
  },
  configuration: {
    title: 'الإعدادات',
    websiteInfo: 'معلومات الموقع',
    domain: 'نطاق الموقع',
    domainHint: 'أدخل نطاق موقعك بدون البروتوكول (http/https)',
    protocol: 'البروتوكول',
    skipAnalysis: 'إنشاء بدون تحليل الموقع (استخدم البيانات المدخلة فقط)',
    skipAnalysisHint: 'قم بتفعيل هذا الخيار إذا فشل تحليل الموقع'
  },
  tabs: {
    robots: 'Robots.txt',
    schema: 'Schema.org'
  },
  robotsConfig: {
    pathManagement: 'إدارة المسارات',
    templates: 'قوالب معدة مسبقًا',
    disallowedPaths: 'المسارات المحظورة',
    allowedPaths: 'المسارات المسموح بها',
    pathToDisallow: 'مسار للحظر',
    pathToAllow: 'مسار للسماح'
  },
  schemaConfig: {
    templates: 'قوالب Schema.org'
  },
  robotsSettings: {
    title: 'إعدادات Robots.txt',
    userAgent: 'وكيل المستخدم',
    customUserAgent: 'وكيل مستخدم مخصص',
    crawlDelay: 'تأخير الزحف (بالثواني)',
    noDelay: 'اترك فارغًا لعدم التأخير',
    disallowedPaths: 'المسارات المحظورة',
    allowedPaths: 'المسارات المسموح بها',
    add: 'إضافة',
    sitemapUrl: 'رابط خريطة الموقع'
  },
  schemaSettings: {
    title: 'إعدادات Schema.org',
    schemaType: 'نوع المخطط',
    name: 'الاسم',
    description: 'الوصف',
    url: 'الرابط',
    commonProperties: 'الخصائص المشتركة',
    imageUrl: 'رابط الصورة',
    telephone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
    logoUrl: 'رابط الشعار',
    properties: 'الخصائص'
  },
  templateTitles: {
    wordpress: 'ووردبريس',
    ecommerce: 'التجارة الإلكترونية',
    blog: 'المدونة',
    article: 'المقال',
    product: 'المنتج',
    organization: 'المؤسسة',
    localBusiness: 'الأعمال المحلية'
  },
  templateDescriptions: {
    wordpress: 'التكوين الأمثل لمواقع ووردبريس',
    ecommerce: 'التكوين الأمثل لمواقع التجارة الإلكترونية',
    blog: 'التكوين الأمثل للمدونات',
    article: 'هيكل لمقالات المدونة',
    product: 'هيكل لمنتجات التجارة الإلكترونية',
    organization: 'هيكل للمؤسسات',
    localBusiness: 'هيكل للأعمال المحلية'
  },
  templateTypes: {
    wordpress: {
      name: 'ووردبريس',
      description: 'التكوين الأمثل لمواقع ووردبريس'
    },
    ecommerce: {
      name: 'التجارة الإلكترونية',
      description: 'التكوين الأمثل لمواقع التجارة الإلكترونية'
    },
    blog: {
      name: 'المدونة',
      description: 'التكوين الأمثل للمدونات'
    },
    article: {
      name: 'المقال',
      description: 'هيكل لمقالات المدونة'
    },
    product: {
      name: 'المنتج',
      description: 'هيكل لمنتجات التجارة الإلكترونية'
    },
    organization: {
      name: 'المؤسسة',
      description: 'هيكل للمؤسسات'
    },
    localBusiness: {
      name: 'الأعمال المحلية',
      description: 'هيكل للأعمال المحلية'
    }
  },
  preview: {
    configureSettings: 'قم بتكوين إعداداتك',
    andGenerate: 'وانقر على "إنشاء"',
    generatedCode: 'الكود المُنشأ'
  },
  actions: {
    generate: 'إنشاء المحتوى',
    analyzing: 'جاري التحليل...'
  },
  codePreview: {
    code: 'الكود',
    preview: 'معاينة',
    copy: 'نسخ',
    download: 'تنزيل',
    errorParsingJson: 'خطأ في تحليل JSON'
  },
  errors: {
    validDomain: 'الرجاء إدخال نطاق صالح.',
    auditFailed: 'واجه خادم التحليل خطأ (500). قد يكون هذا بسبب زيادة الحمل على الخادم أو مشكلة في الموقع الذي يتم تحليله.',
    notFound: 'لم يتم العثور على الموقع المطلوب (404). تأكد من صحة عنوان URL وإمكانية الوصول إلى الموقع.',
    connectionRefused: 'تعذر الاتصال بالموقع. تأكد من إمكانية الوصول إلى الموقع وعمل اتصال الإنترنت الخاص بك.',
    timeout: 'استغرق التحليل وقتًا طويلاً وتم إيقافه. حاول تحليل موقع أصغر أو زيادة مهلة الانتظار.',
    generic: 'حدث خطأ أثناء تحليل الموقع.',
    contentGeneration: 'حدث خطأ أثناء إنشاء المحتوى.',
    continueWithSettings: 'لا يزال بإمكانك إنشاء محتوى باستخدام الإعدادات الحالية.',
    warning: 'تحذير:'
  },
  templates: {
    rules: {
      description: 'الوصف',
      severity: 'الأهمية',
      category: 'الفئة',
      path: 'المسار',
      type: 'النوع'
    },
    properties: {
      headline: 'عنوان المقال',
      author: 'اسم المؤلف',
      datePublished: 'تاريخ النشر',
      dateModified: 'تاريخ التعديل',
      image: 'الصورة الرئيسية',
      description: 'الوصف',
      articleBody: 'محتوى المقال',
      publisher: 'اسم الناشر',
      keywords: 'الكلمات المفتاحية',
      articleSection: 'القسم',
      inLanguage: 'اللغة',
      name: 'الاسم',
      offers: 'السعر والتوفر',
      brand: 'العلامة التجارية',
      sku: 'رمز المنتج',
      gtin: 'الرمز العالمي للمنتج',
      mpn: 'رقم قطعة الشركة المصنعة',
      color: 'اللون',
      material: 'المادة',
      weight: 'الوزن',
      category: 'الفئة',
      aggregateRating: 'متوسط التقييم',
      logo: 'الشعار',
      telephone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان البريدي',
      foundingDate: 'تاريخ التأسيس',
      legalName: 'الاسم القانوني',
      numberOfEmployees: 'عدد الموظفين',
      socialProfiles: 'الحسابات الاجتماعية',
      url: 'رابط الموقع',
      openingHours: 'ساعات العمل',
      priceRange: 'نطاق السعر',
      areaServed: 'المنطقة المخدومة',
      hasMap: 'رابط الخريطة',
      geo: 'الإحداثيات الجغرافية'
    },
    categories: {
      admin: 'الإدارة',
      system: 'النظام',
      plugins: 'الإضافات',
      themes: 'القوالب',
      security: 'الأمان',
      auth: 'المصادقة',
      media: 'الوسائط',
      cache: 'التخزين المؤقت',
      checkout: 'الدفع',
      cart: 'سلة التسوق',
      user: 'المستخدم',
      search: 'البحث',
      catalog: 'الكتالوج',
      products: 'المنتجات',
      categories: 'الفئات',
      api: 'واجهة برمجة التطبيقات',
      static: 'الملفات الثابتة',
      tags: 'الوسوم',
      authors: 'المؤلفون',
      feeds: 'تغذيات RSS',
      comments: 'التعليقات'
    },
    severity: {
      high: 'مرتفعة',
      medium: 'متوسطة',
      low: 'منخفضة'
    }
  },
  tools: {
    new: 'جديد',
    premium: 'مميز',
    explore: 'استكشاف'
  }
} 