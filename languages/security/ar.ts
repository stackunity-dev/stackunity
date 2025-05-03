export default {
  meta: {
    title: 'تحليل الأمان',
    description: 'تحليل ثغرات الأمان في موقعك الإلكتروني'
  },
  form: {
    urlLabel: 'رابط للتحليل',
    urlPlaceholder: 'https://example.com',
    urlHint: 'أدخل الرابط الكامل بما في ذلك https://',
    urlRuleInvalid: 'الرجاء إدخال رابط صالح يبدأ بـ http:// أو https://',
    analyzeButton: 'تحليل المحتوى',
    analyzeAriaLabel: 'تحليل المحتوى'
  },
  loading: {
    ariaLabel: 'جاري تحميل نتائج التحليل'
  },
  results: {
    title: 'نتائج التحليل',
    globalScore: 'النتيجة الإجمالية',
    headers: 'الترويسات',
    cookies: 'ملفات تعريف الارتباط',
    vulnerabilities: 'الثغرات الأمنية'
  },
  scoreLabel: 'النتيجة: {value}%',
  headers: {
    tab: 'الترويسات',
    securityHeaders: 'ترويسات الأمان',
    scoreLabel: 'النتيجة: {value}%',
    missingHeaders: 'الترويسات المفقودة',
    allPresent: 'جميع ترويسات الأمان موجودة'
  },
  cookies: {
    tab: 'ملفات تعريف الارتباط',
    securityTitle: 'أمان ملفات تعريف الارتباط',
    scoreLabel: 'النتيجة: {value}%',
    secureAttribute: 'خاصية Secure',
    httpOnlyAttribute: 'خاصية HttpOnly',
    sameSiteAttribute: 'خاصية SameSite',
    present: 'موجود',
    missing: 'مفقود',
    https: 'HTTPS',
    httpsEnabled: 'تم تفعيل HTTPS'
  },
  vulnerabilities: {
    tab: 'الثغرات الأمنية',
    title: 'الثغرات المكتشفة',
    scoreLabel: 'النتيجة: {value}%',
    level: 'المستوى',
    levels: {
      high: 'مرتفع',
      medium: 'متوسط',
      low: 'منخفض',
      info: 'معلومات'
    },
    noVulnerabilities: 'لم يتم اكتشاف أي ثغرات',
    details: {
      title: 'التفاصيل',
      description: 'الوصف',
      impact: 'التأثير',
      remediation: 'الإصلاح',
      element: 'العنصر',
      problemCode: 'كود المشكلة',
      issue: 'المشكلة',
      content: 'المحتوى',
      recommendation: 'التوصية',
      evidence: 'البرهان',
      detectedVulnerabilities: 'الثغرات المكتشفة',
    },
    summary: 'الثغرات المكتشفة',
    sensitiveData: 'البيانات الحساسة',
    issuesDetected: 'المشاكل المكتشفة',
    csrf: 'CSRF',
    headerIssues: 'المشاكل المتعلقة بالرؤوس',
    otherIssues: 'المشاكل الأخرى'
  },
  recommendations: {
    title: 'توصيات الأمان',
    implementHeaders: 'تنفيذ الترويسات المفقودة',
    secureCookies: 'تأمين ملفات تعريف الارتباط',
    fixVulnerabilities: 'إصلاح الثغرات',
    enableHttps: 'تفعيل HTTPS'
  }
} 