export default {
  meta: {
    title: 'Análisis de Rendimiento Web - StackUnity',
    description: 'Analice la velocidad de carga y las métricas de rendimiento de su sitio web'
  },
  page: {
    title: 'Análisis de Rendimiento Web',
    subtitle: 'Analice la velocidad de carga y las métricas de rendimiento de su sitio web'
  },
  form: {
    urlLabel: 'URL a analizar',
    urlPlaceholder: 'https://ejemplo.com',
    urlHint: 'Ingrese la URL completa incluyendo https://',
    urlRule: 'Por favor, ingrese una URL válida que comience con http:// o https://',
    analyzeButton: 'Analizar rendimiento'
  },
  loading: {
    text: 'Cargando resultados del análisis'
  },
  results: {
    title: 'Resultados del Análisis de Rendimiento',
    averageScore: 'Puntuación Media de Rendimiento',
    scoreLabel: 'Puntuación: {score}%',
    metrics: {
      title: 'Métricas Principales',
      loadingMetrics: 'Métricas de Carga',
      scoreBreakdown: 'Desglose de Puntuación de Rendimiento',
      firstContentfulPaint: {
        title: 'Primera Pintura con Contenido',
        short: 'FCP',
        description: 'Tiempo hasta que el navegador renderiza el primer elemento de contenido'
      },
      largestContentfulPaint: {
        title: 'Mayor Pintura con Contenido',
        short: 'LCP',
        description: 'Tiempo hasta que se renderiza el elemento de contenido más grande'
      },
      speedIndex: {
        title: 'Índice de Velocidad',
        short: 'SI',
        description: 'Con qué rapidez se muestra visualmente el contenido durante la carga de la página'
      },
      totalBlockingTime: {
        title: 'Tiempo Total de Bloqueo',
        short: 'TBT',
        description: 'Suma del tiempo en que el hilo principal estaba bloqueado'
      },
      cumulativeLayoutShift: {
        title: 'Cambio Acumulativo de Diseño',
        short: 'CLS',
        description: 'Medida de estabilidad visual durante la carga de la página'
      },
      timeToInteractive: {
        title: 'Tiempo hasta Interactividad',
        short: 'TTI',
        description: 'Tiempo hasta que la página se vuelve completamente interactiva'
      }
    },
    resources: {
      title: 'Recursos',
      networkRequests: 'Peticiones de Red',
      resourceSizes: 'Tamaños de Recursos',
      resourceTypes: 'Tipos de Recursos',
      requestCount: 'Número de peticiones:',
      totalSize: 'Tamaño total:',
      transferSize: 'Tamaño de transferencia:',
      contentType: 'Tipo de contenido',
      size: 'Tamaño',
      transferTime: 'Tiempo de transferencia'
    },
    optimization: {
      title: 'Optimización',
      opportunities: 'Oportunidades de Optimización',
      diagnostics: 'Diagnósticos de Rendimiento',
      passed: 'Auditorías Aprobadas',
      wastefulResizing: 'Imágenes con codificación o dimensionamiento ineficiente',
      uncompressedImages: 'Codificar imágenes eficientemente',
      unusedJavascript: 'Eliminar JavaScript no utilizado',
      unusedCss: 'Eliminar CSS no utilizado',
      preconnectOrigins: 'Preconectar a orígenes requeridos',
      thirdParty: 'Reducir el impacto del código de terceros',
      fontDisplay: 'Asegurar que el texto permanezca visible durante la carga de fuentes web',
      potential: 'Ahorros potenciales:'
    },
    scoreIntervals: {
      excellent: 'Excelente',
      needsImprovement: 'Necesita mejoras',
      poor: 'Deficiente',
      excellentRange: '90-100: Excelente',
      improvementRange: '50-89: Necesita mejoras',
      poorRange: '0-49: Deficiente'
    }
  },
  tabs: {
    metrics: 'Métricas Principales',
    resources: 'Recursos',
    optimization: 'Optimización'
  },
  summary: {
    title: 'Resumen de Rendimiento',
    baselineMetrics: 'Métricas de Referencia',
    optimizationScore: 'Puntuación de optimización:',
    resourceEfficiency: 'Eficiencia de recursos:',
    loadingSpeed: 'Velocidad de carga:',
    userExperience: 'Experiencia de usuario:'
  },
  export: {
    title: 'Exportar Resultados',
    pdf: 'Exportar como PDF',
    csv: 'Exportar como CSV',
    json: 'Exportar como JSON'
  },
  error: {
    title: 'Error',
    message: 'No se pudo analizar la URL. Por favor, verifique la URL e intente nuevamente.',
    retry: 'Reintentar'
  }
} 