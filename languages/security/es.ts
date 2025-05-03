export default {
  meta: {
    title: 'Análisis de Seguridad',
    description: 'Analice las vulnerabilidades de seguridad de su sitio web'
  },
  form: {
    urlLabel: 'URL para analizar',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Ingrese la URL completa incluyendo https://',
    urlRuleInvalid: 'Por favor ingrese una URL válida que comience con http:// o https://',
    analyzeButton: 'Analizar contenido',
    analyzeAriaLabel: 'Analizar contenido'
  },
  loading: {
    ariaLabel: 'Cargando los resultados del análisis'
  },
  results: {
    title: 'Resultados del Análisis',
    globalScore: 'Puntuación Global',
    headers: 'Cabeceras',
    cookies: 'Cookies',
    vulnerabilities: 'Vulnerabilidades'
  },
  scoreLabel: 'Puntuación: {value}%',
  headers: {
    tab: 'Cabeceras',
    securityHeaders: 'Cabeceras de Seguridad',
    scoreLabel: 'Puntuación: {value}%',
    missingHeaders: 'Cabeceras Faltantes',
    allPresent: 'Todas las cabeceras de seguridad están presentes'
  },
  cookies: {
    tab: 'Cookies',
    securityTitle: 'Seguridad de Cookies',
    scoreLabel: 'Puntuación: {value}%',
    secureAttribute: 'Atributo Secure',
    httpOnlyAttribute: 'Atributo HttpOnly',
    sameSiteAttribute: 'Atributo SameSite',
    present: 'Presente',
    missing: 'Faltante',
    https: 'HTTPS',
    httpsEnabled: 'HTTPS Habilitado'
  },
  vulnerabilities: {
    tab: 'Vulnerabilidades',
    title: 'Vulnerabilidades Detectadas',
    scoreLabel: 'Puntuación: {value}%',
    level: 'Nivel',
    levels: {
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      info: 'Info'
    },
    noVulnerabilities: 'No se detectaron vulnerabilidades',
    details: {
      title: 'Detalles',
      description: 'Descripción',
      impact: 'Impacto',
      remediation: 'Corrección',
      element: 'Elemento',
      problemCode: 'Código del Problema',
      issue: 'Problema',
      content: 'Contenido',
      recommendation: 'Recomendación',
      evidence: 'Evidencia',
      detectedVulnerabilities: 'Vulnerabilidades Detectadas',
    },
    summary: 'Vulnerabilidades Detectadas',
    sensitiveData: 'Datos Sensibles',
    issuesDetected: 'Problemas Detectados',
    csrf: 'CSRF',
    headerIssues: 'Problemas de Cabeceras',
    otherIssues: 'Otros Problemas',
  },
  recommendations: {
    title: 'Recomendaciones de Seguridad',
    implementHeaders: 'Implementar Cabeceras Faltantes',
    secureCookies: 'Asegurar Cookies',
    fixVulnerabilities: 'Corregir Vulnerabilidades',
    enableHttps: 'Habilitar HTTPS'
  }
} 