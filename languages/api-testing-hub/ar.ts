export default {
  meta: {
    title: 'مركز اختبار واجهة برمجة التطبيقات',
    description: 'اختبر واجهات برمجة التطبيقات RESTful الخاصة بك باستخدام واجهتنا سهلة الاستخدام'
  },
  alerts: {
    deleteWarning: 'تحذير: توخى الحذر عند استخدام طريقة الحذف.',
    noCustomHeaders: 'لم يتم إرسال رؤوس مخصصة مع هذا الطلب.',
    runTests: 'قم بتشغيل الاختبارات لرؤية النتائج.'
  },
  cardTitles: {
    newTest: 'اختبار API جديد',
    response: 'الاستجابة',
    history: 'سجل الطلبات',
    documentation: 'وثائق OpenAPI',
    apiTests: 'اختبارات API الآلية',
    status: 'الحالة',
    historySettings: 'إعدادات السجل',
    historyCount: 'عدد الطلبات'
  },
  tooltips: {
    historySettings: 'إعدادات السجل',
    commonHeaders: 'الرؤوس الشائعة التي تضاف تلقائيًا بواسطة المتصفحات'
  },
  forms: {
    method: 'الطريقة',
    url: 'الرابط',
    urlPlaceholder: 'https://api.example.com/endpoint',
    tabs: {
      headers: 'الرؤوس',
      body: 'الجسم',
      params: 'المعلمات',
      docs: 'المستندات',
      tests: 'الاختبارات',
      raw: 'خام',
      tree: 'شجرة',
      response: 'رؤوس الاستجابة',
      request: 'رؤوس الطلب'
    },
    headers: {
      key: 'المفتاح',
      keyPlaceholder: 'Authorization',
      value: 'القيمة',
      valuePlaceholder: 'Bearer token123',
      add: 'إضافة رأس',
      common: 'الرؤوس الشائعة',
      commonNote: 'بعض الرؤوس القياسية تُضاف تلقائيًا بواسطة المتصفحات ولا تظهر هنا.',
      etc: 'وغيرها)'
    },
    params: {
      key: 'المفتاح',
      keyPlaceholder: 'page',
      value: 'القيمة',
      valuePlaceholder: '1',
      add: 'إضافة معلمة'
    },
    body: {
      label: 'الجسم',
      placeholder: '{"المفتاح": "القيمة"}'
    },
    submit: 'إرسال الطلب',
    send: 'إرسال الطلب',
    schemaDepth: 'عمق المخطط',
    showExamples: 'عرض الأمثلة',
    impact: 'التأثير:',
    result: 'النتيجة',
    status: 'الحالة',
    data: 'البيانات',
    saveToHistory: 'حفظ الطلبات في السجل'
  },
  response: {
    status: 'الحالة',
    tabs: {
      body: 'الجسم',
      headers: 'الرؤوس',
      docs: 'المستندات',
      tests: 'الاختبارات'
    },
    bodyViews: {
      raw: 'خام',
      tree: 'شجرة'
    },
    headerTypes: {
      response: 'رؤوس الاستجابة',
      request: 'رؤوس الطلب'
    },
    noCustomHeaders: 'لم يتم إرسال رؤوس مخصصة مع هذا الطلب.'
  },
  docs: {
    title: 'وثائق OpenAPI',
    download: 'تنزيل',
    schemaDepth: 'عمق المخطط',
    showExamples: 'عرض الأمثلة'
  },
  apiTests: {
    title: 'اختبارات API الآلية',
    run: 'تشغيل الاختبارات',
    results: {
      success: 'نجاح',
      failure: 'فشل',
      pending: 'قيد الانتظار'
    },
    generate: 'إنشاء اختبارات',
    testTypes: {
      status: 'فحص الحالة',
      schema: 'التحقق من المخطط',
      dataPresence: 'وجود البيانات',
      performance: 'الأداء'
    }
  },
  history: {
    title: 'سجل الطلبات',
    noHistory: 'لا يوجد سجل متاح',
    clearAll: 'مسح الكل',
    saveAs: 'حفظ باسم',
    load: 'تحميل',
    delete: 'حذف',
    settings: {
      title: 'إعدادات السجل',
      maxEntries: 'الحد الأقصى للإدخالات',
      saveAutomatically: 'حفظ الطلبات تلقائيًا',
      includeHeaders: 'تضمين الرؤوس',
      includeBody: 'تضمين الجسم',
      save: 'حفظ الإعدادات'
    }
  },
  collection: {
    title: 'المجموعات',
    create: 'إنشاء مجموعة',
    import: 'استيراد',
    export: 'تصدير',
    addRequest: 'إضافة طلب إلى المجموعة',
    name: 'اسم المجموعة',
    description: 'الوصف'
  },
  errors: {
    invalidUrl: 'رابط غير صالح',
    networkError: 'خطأ في الشبكة',
    timeout: 'انتهت مهلة الطلب',
    serverError: 'خطأ في الخادم'
  },
  buttons: {
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    run: 'تشغيل',
    copy: 'نسخ',
    clear: 'مسح',
    delete: 'حذف',
    download: 'تنزيل'
  }
} 