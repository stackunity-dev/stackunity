export default {
  meta: {
    title: 'Análisis de Contenido - StackUnity',
    description: 'Analice la estructura y calidad de sus páginas web para mejorar su SEO'
  },
  page: {
    title: 'Análisis de Contenido',
    subtitle: 'Analice la estructura y calidad de sus páginas web para mejorar su SEO'
  },
  form: {
    urlLabel: 'URL del sitio a analizar',
    urlPlaceholder: 'https://ejemplo.com',
    urlHint: 'Ingrese la URL completa incluyendo https://',
    urlRule: 'Por favor, ingrese una URL válida que comience con http:// o https://',
    crawlEnabled: 'Analizar también páginas enlazadas',
    crawlHint: 'Límite: 10 URLs máximo',
    analyzeButton: 'Analizar contenido'
  },
  loading: {
    text: 'Análisis en progreso'
  },
  averageScore: {
    title: 'Puntuación media del contenido',
    calculated: 'Puntuación media calculada de {count} páginas analizadas',
    exportButton: 'Exportar'
  },
  contentScore: {
    title: 'Puntuación del contenido',
    excellent: 'Excelente',
    good: 'Bueno',
    average: 'Promedio',
    poor: 'Deficiente',
    critical: 'Crítico'
  },
  improvement: {
    title: 'Prioridad de mejora',
    lowestScore: 'La página con la puntuación más baja ({score}%) es',
    openInNew: 'Abrir en nueva pestaña'
  },
  trends: {
    improving: 'Mejorando',
    declining: 'Empeorando',
    stable: 'Estable',
    tooltipImproving: 'La calidad del contenido está mejorando en todas las páginas',
    tooltipDeclining: 'La calidad del contenido está empeorando en todas las páginas',
    tooltipStable: 'La calidad del contenido es constante en todas las páginas'
  },
  statistics: {
    title: 'Estadísticas de contenido',
    wordCount: 'Número de palabras',
    readabilityScore: 'Puntuación de legibilidad',
    headingsDetected: 'Encabezados detectados',
    links: 'Enlaces',
    internal: 'Internos',
    external: 'Externos'
  },
  readability: {
    veryEasy: 'Muy fácil',
    easy: 'Fácil',
    fairlyEasy: 'Bastante fácil',
    standard: 'Estándar',
    fairlyDifficult: 'Bastante difícil',
    difficult: 'Difícil',
    veryDifficult: 'Muy difícil'
  },
  wordCount: {
    tooShort: 'Muy corto',
    short: 'Corto',
    good: 'Bueno',
    excellent: 'Excelente'
  },
  headings: {
    title: 'Estructura de encabezados',
    noHeadings: 'No se detectaron encabezados (H1-H6) en esta página.'
  },
  issues: {
    title: 'Problemas detectados',
    noIssues: 'No se detectaron problemas importantes en el contenido.',
    missingH1: 'Falta encabezado H1',
    multipleH1: 'Múltiples encabezados H1',
    shortContent: 'Contenido demasiado corto',
    poorReadability: 'Baja puntuación de legibilidad',
    lowKeywordDensity: 'Baja densidad de palabras clave',
    missingAltText: 'Imágenes sin texto alternativo',
    brokenHeadingStructure: 'Estructura de encabezado rota',
    lowWordCount: 'Número bajo de palabras',
    duplicateTitle: 'Título y H1 duplicados',
    noExternalLinks: 'Sin enlaces externos',
    tooManyLinks: 'Demasiados enlaces',
    lowTextToHtmlRatio: 'Proporción baja de texto/HTML'
  },
  images: {
    title: 'Análisis de Imágenes',
    preview: 'Vista previa de imagen',
    altText: 'Texto alternativo',
    missingAlt: 'Falta texto alternativo',
    hasAlt: 'Texto alternativo presente',
    dimensions: 'Dimensiones',
    hasDimensions: 'Optimizada',
    noDimensions: 'Sin dimensiones'
  },
  keywords: {
    title: 'Análisis de palabras clave',
    topKeywords: 'Palabras clave principales',
    density: 'Densidad',
    optimal: 'Óptima',
    tooLow: 'Muy baja',
    tooHigh: 'Muy alta',
    noKeywords: 'No se detectaron palabras clave significativas'
  },
  seo: {
    title: 'Elementos SEO',
    metaTitle: 'Meta Título',
    metaDescription: 'Meta Descripción',
    canonical: 'URL Canónica',
    og: 'Etiquetas Open Graph',
    missingElement: 'Faltante',
    tooShort: 'Demasiado corto',
    tooLong: 'Demasiado largo',
    good: 'Bueno'
  },
  recommendations: {
    title: 'Recomendaciones',
    excellentQuality: {
      title: 'Excelente calidad de contenido',
      description: 'Tu contenido está bien estructurado y optimizado para SEO. ¡Sigue con el buen trabajo!'
    },
    improveContent: {
      title: 'Cómo mejorar tu contenido',
      addMoreContent: {
        title: 'Añadir más contenido',
        description: 'Tu contenido tiene {count} palabras. Considera expandirlo a al menos 800-1000 palabras para un mejor rendimiento SEO.'
      },
      addH1: {
        title: 'Añadir un encabezado H1',
        description: 'Cada página debe tener exactamente un encabezado H1 que describa claramente el contenido de la página.'
      },
      multipleH1: {
        title: 'Usar solo un encabezado H1',
        description: 'Tu página tiene {count} encabezados H1. Para un mejor SEO, usa exactamente un H1 y estructura los demás encabezados con H2-H6.'
      },
      addH2: {
        title: 'Añadir subencabezados H2',
        description: 'Usa subencabezados H2 para dividir tu contenido en secciones lógicas para una mejor legibilidad y SEO.'
      },
      addAltText: {
        title: 'Añadir texto alternativo a las imágenes',
        description: '{count} imagen(es) sin texto alternativo. Añade un texto descriptivo a todas las imágenes para una mejor accesibilidad y SEO.'
      },
      improveReadability: {
        title: 'Mejorar la legibilidad',
        description: 'Tu contenido tiene un puntaje de legibilidad de {score}. Intenta usar oraciones más cortas y un lenguaje más simple.'
      },
      addInternalLinks: {
        title: 'Añadir enlaces internos',
        description: 'Añade enlaces a otras páginas relevantes de tu sitio para mejorar la navegación y el SEO.'
      },
      addExternalLinks: {
        title: 'Añadir enlaces externos',
        description: 'Enlaza a fuentes externas autorizadas para aumentar la credibilidad y el valor SEO.'
      },
      generalImprovements: {
        title: 'Mejoras generales',
        description: '- Usa un lenguaje más variado y atractivo\n- Añade elementos multimedia (imágenes, videos, infografías)\n- Incluye ejemplos específicos y datos para respaldar tus puntos\n- Estructura el contenido con una introducción y conclusión claras'
      }
    },
    seoTips: {
      title: 'Consejos de optimización SEO',
      useKeywords: {
        title: 'Usar palabras clave objetivo',
        description: 'Incluye tu palabra clave principal en el título, el encabezado H1, el primer párrafo y naturalmente en todo el contenido.'
      },
      optimizeMeta: {
        title: 'Optimizar la meta descripción',
        description: 'Crea una meta descripción convincente (150-160 caracteres) que incluya tu palabra clave objetivo.'
      },
      improveSpeed: {
        title: 'Mejorar la velocidad de la página',
        description: 'Optimiza las imágenes, reduce los scripts y aprovecha el almacenamiento en caché del navegador para mejorar los tiempos de carga.'
      },
      mobileOptimization: {
        title: 'Optimización móvil',
        description: 'Asegúrate de que tu página sea completamente responsive y ofrezca una buena experiencia de usuario en dispositivos móviles.'
      },
      useSchema: {
        title: 'Usar marcado schema',
        description: 'Implementa el marcado schema.org apropiado para ayudar a los motores de búsqueda a entender mejor tu contenido.'
      }
    }
  },
  error: {
    title: 'Error',
    message: 'No se pudo analizar la URL. Por favor, verifique la URL e intente nuevamente.',
    retry: 'Reintentar'
  }
} 