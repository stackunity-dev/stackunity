export default {
  meta: {
    title: "الدفع - StackUnity",
    description: "أكمل عملية الشراء للوصول إلى الميزات المتميزة في StackUnity",
    keywords: "دفع، سداد، StackUnity متميز، دفع آمن"
  },
  features: {
    advancedTools: {
      title: "أدوات تطوير متقدمة",
      description: "الوصول إلى أدوات وميزات التطوير المتميزة"
    },
    analytics: {
      title: "أدوات تحليل متقدمة",
      description: "الوصول إلى جميع بيانات التحليل لموقعك"
    },
    prioritySupport: {
      title: "دعم ذو أولوية",
      description: "احصل على دعم ذو أولوية لجميع أسئلتك"
    },
    regularUpdates: {
      title: "تحديثات منتظمة",
      description: "ابق متقدماً مع أحدث الميزات والتحسينات"
    },
    teamCollaboration: {
      title: "تعاون الفريق",
      description: "العمل بسلاسة مع أعضاء فريقك"
    },
    standardTools: {
      title: "أدوات تطوير قياسية",
      description: "الوصول إلى أدوات وميزات التطوير القياسية"
    },
    basicSupport: {
      title: "دعم أساسي",
      description: "احصل على دعم أساسي لأسئلتك"
    }
  },
  plans: {
    premium: {
      title: "متميز مدى الحياة",
      description: "وصول غير محدود لجميع الميزات المتميزة"
    },
    standard: {
      title: "قياسي مدى الحياة",
      description: "الوصول إلى الميزات القياسية"
    },
    bestChoice: "الخيار الأفضل",
    option: {
      standard: "قياسي",
      premium: "متميز"
    },
    tooltip: {
      lifetimeAccess: "وصول مدى الحياة",
      standardFeatures: "الوصول إلى الميزات القياسية",
      premiumFeatures: "جميع الميزات المتميزة مشمولة"
    }
  },
  pricing: {
    htPrice: "السعر بدون ضريبة",
    discount: "خصم",
    htPriceAfterDiscount: "السعر بعد الخصم بدون ضريبة",
    vat: "ضريبة القيمة المضافة",
    totalTTC: "المجموع مع الضريبة",
    oneTimePayment: "دفعة واحدة، وصول مدى الحياة",
    youSave: "توفيرك",
    saveVsMonthly: "وفر 100% مقارنة بالاشتراك الشهري"
  },
  vatInfo: {
    selfAssessment: "ضريبة القيمة المضافة غير منطبقة، المادة 283-2 من CGI - التقييم الذاتي لضريبة القيمة المضافة",
    vatNumber: "رقم ضريبة القيمة المضافة",
    exportOutsideEU: "تصدير خارج الاتحاد الأوروبي - ضريبة القيمة المضافة غير منطبقة"
  },
  benefits: {
    premiumTitle: "الميزات المتميزة",
    standardTitle: "الميزات القياسية",
    premium: [
      "وصول غير محدود لجميع الميزات المتميزة",
      "دعم وتحديثات ذات أولوية",
      "أدوات تحليل SEO متقدمة",
      "أدوات تطوير مخصصة",
      "ميزات تعاون الفريق",
      "بدون رسوم متكررة - ادفع مرة واحدة، استخدم إلى الأبد"
    ],
    standard: [
      "الوصول إلى الميزات القياسية",
      "تحديثات منتظمة",
      "دعم أساسي",
      "ميزات تعاون الفريق"
    ]
  },
  payment: {
    paymentInformation: "معلومات الدفع",
    billingCountry: "بلد الفوترة",
    businessCustomer: "أنا أشتري لشركة",
    vatNumber: {
      label: "رقم ضريبة القيمة المضافة (للشركات في الاتحاد الأوروبي)",
      placeholder: "مثال FR12345678901",
      hint: "أدخل رقم ضريبة القيمة المضافة الخاص بك لتطبيق التحصيل العكسي إذا كنت مؤهلاً"
    },
    promoCode: {
      label: "رمز ترويجي",
      placeholder: "أدخل الرمز الترويجي الخاص بك",
      success: "تم تطبيق الرمز الترويجي",
      error: "الرمز الترويجي غير صالح أو مستخدم بالفعل"
    },
    cardholderName: {
      label: "اسم حامل البطاقة",
      placeholder: "الاسم على البطاقة"
    },
    payButton: "دفع",
    securePayment: "دفع آمن عبر Stripe",
    refundGuarantee: "التأكيد المرجعي للاسترجاع 30 يوم"
  },
  messages: {
    vatReverseCharge: "تم تطبيق التحصيل العكسي لضريبة القيمة المضافة (0% ضريبة القيمة المضافة)",
    taxCalculationError: "فشل في حساب الضرائب",
    paymentConfigError: "خطأ في تكوين الدفع. يرجى الاتصال بالدعم.",
    stripeUnavailable: "نظام الدفع غير متوفر. يرجى المحاولة مرة أخرى لاحقاً.",
    initError: "خطأ في تهيئة نموذج الدفع. يرجى تحديث الصفحة.",
    stripeConnectionError: "غير قادر على الاتصال بـ Stripe. يرجى المحاولة مرة أخرى.",
    paymentSuccess: "تم الدفع بنجاح! تم تفعيل الوصول المتميز وإرسال الفاتورة إلى بريدك الإلكتروني.",
    invoiceError: "تم الدفع بنجاح، ولكن فشل في إنشاء الفاتورة. اتصل بالدعم إذا لزم الأمر.",
    postPaymentError: "تم الدفع بنجاح ولكن فشلت بعض عمليات ما بعد الدفع. يرجى تحديث صفحتك.",
    premiumUpdateError: "تم الدفع بنجاح ولكن فشل تحديث الحالة المتميزة. يرجى تحديث الصفحة.",
    reloginRequired: "تم تحديث حالتك المتميزة. يرجى تسجيل الدخول مرة أخرى للوصول إلى ميزاتك المتميزة."
  },
  testimonials: {
    premium: {
      text: "تم تحديث حالتك المتميزة. يرجى تسجيل الدخول مرة أخرى للوصول إلى ميزاتك المتميزة.",
      author: "Nûr D. - Full Stack Developer"
    }
  }
} 