export default {
  meta: {
    title: 'إمكانية الوصول - StackUnity',
    description: 'أدوات إمكانية الوصول لمطوري الويب'
  },
  contrastChecker: {
    title: 'مدقق التباين',
    textColor: 'لون النص',
    backgroundColor: 'لون الخلفية',
    colorHint: 'يدعم hex و rgb و hsl أو أسماء الألوان',
    calculateButton: 'حساب التباين',
    preview: {
      title: 'معاينة التباين',
      normalText: 'نص عادي (16 بكسل)',
      largeText: 'نص كبير (18+ بكسل)',
      boldText: 'نص غامق',
      italicText: 'نص مائل',
      linkExample: 'مثال رابط'
    },
    results: {
      contrastRatio: 'نسبة التباين',
      insufficientContrast: 'تباين غير كافٍ',
      acceptableContrast: 'تباين مقبول',
      excellentContrast: 'تباين ممتاز',
      normalTextRequirement: 'نص عادي (الحد الأدنى 4.5:1)',
      largeTextRequirement: 'نص كبير (الحد الأدنى 3:1)',
      insufficientMessage: 'التباين غير كافٍ للقراءة الجيدة. جرب ألوانًا أكثر تباينًا.',
      successMessage: 'تهانينا! تلبي ألوانك معايير التباين لموقع يمكن الوصول إليه.',
      wcagAA: 'معيار WCAG 2.1 AA',
      wcagAAA: 'معيار WCAG 2.1 AAA'
    }
  },
  visionSimulator: {
    title: 'محاكي ضعف البصر',
    urlLabel: 'رابط الموقع للمحاكاة',
    urlHint: 'أدخل الرابط الكامل (https://...)',
    visionTypeLabel: 'نوع ضعف البصر',
    intensityLabel: 'شدة المرشح',
    loading: 'جاري التحميل...',
    enterUrl: 'أدخل رابطًا للبدء',
    limitedAccess: {
      title: 'وصول محدود',
      description: 'قم بالترقية إلى النسخة المميزة للوصول إلى جميع أنواع ضعف البصر.',
      upgradeButton: 'ترقية'
    },
    visionTypes: {
      normal: 'رؤية طبيعية',
      protanopia: 'عمى اللون الأحمر (أحمر-أخضر)',
      deuteranopia: 'عمى اللون الأخضر (أحمر-أخضر)',
      tritanopia: 'عمى اللون الأزرق (أزرق-أصفر)',
      achromatopsia: 'عمى الألوان الكلي (أبيض وأسود)',
      blur: 'ضبابية'
    },
    fullscreenControls: {
      exitFullscreen: 'الخروج من وضع ملء الشاشة',
      refreshPage: 'تحديث الصفحة',
      visionType: 'نوع الرؤية',
      otherTypes: 'أنواع أخرى (قياسي)'
    },
    alerts: {
      invalidUrl: 'يرجى إدخال رابط صالح',
      accessAlert: 'هذه المحاكاة متاحة فقط للمستخدمين القياسيين. قم بالترقية إلى النسخة القياسية للوصول إلى جميع أنواع ضعف البصر.'
    }
  }
} 