export default {
  meta: {
    title: 'Análisis de contenido - StackUnity',
    description: 'Analiza la estructura y la calidad de tus páginas web para mejorar tu SEO'
  },
  page: {
    title: 'Análisis de contenido',
    subtitle: 'Analiza la estructura y la calidad de tus páginas web para mejorar tu SEO'
  },
  form: {
    urlLabel: 'URL del sitio web a analizar',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Introduce la URL completa incluyendo https://',
    urlRule: 'Por favor, introduce una URL válida que comience con http:// o https://',
    crawlEnabled: 'Analiza también las páginas vinculadas',
    crawlHint: 'Límite: 10 URLs máximo',
    analyzeButton: 'Analizar contenido'
  },
  loading: {
    text: 'Analizando en progreso'
  },
  averageScore: {
    title: 'Puntuación media del contenido',
    calculated: 'Puntuación media calculada a partir de {count} páginas analizadas',
    exportButton: 'Exportar'
  },
  contentScore: {
    title: 'Puntuación del contenido',
    excellent: 'Excelente',
    good: 'Bueno',
    average: 'Promedio',
    poor: 'Malo',
    critical: 'Crítico'
  },
  improvement: {
    title: 'Prioridad de mejora',
    lowestScore: 'La página con la puntuación más baja ({score}%) es',
    openInNew: 'Abrir en una nueva pestaña'
  },
  trends: {
    improving: 'Mejorando',
    declining: 'Declinando',
    stable: 'Estable',
    tooltipImproving: 'La calidad del contenido está mejorando en todas las páginas',
    tooltipDeclining: 'La calidad del contenido está declinando en todas las páginas',
    tooltipStable: 'La calidad del contenido es consistente en todas las páginas'
  },
  statistics: {
    title: 'Estadísticas del contenido',
    wordCount: 'Número de palabras',
    readabilityScore: 'Puntuación de legibilidad',
    headingsDetected: 'Encabezados detectados',
    links: 'Enlaces',
    internal: 'Interno',
    external: 'Externo'
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
    tooShort: 'Demasiado corto',
    short: 'Corto',
    good: 'Bueno',
    excellent: 'Excelente'
  },
  headings: {
    title: 'Estructura de encabezados',
    noHeadings: 'No se han detectado encabezados (H1-H6) en esta página.'
  },
  issues: {
    title: 'Problemas detectados',
    noIssues: 'No se han detectado problemas importantes en el contenido.',
    missingH1: 'Encabezado H1 ausente',
    multipleH1: 'Múltiples encabezados H1',
    shortContent: 'El contenido es demasiado corto',
    poorReadability: 'Puntuación de legibilidad pobre',
    lowKeywordDensity: 'Densidad de palabras clave baja',
    missingAltText: 'Imágenes sin texto alternativo',
    brokenHeadingStructure: 'Estructura de encabezados rota',
    lowWordCount: 'Número de palabras bajo',
    duplicateTitle: 'Título duplicado y H1',
    noExternalLinks: 'No hay enlaces externos',
    tooManyLinks: 'Demasiados enlaces',
    lowTextToHtmlRatio: 'Bajo ratio de texto a HTML'
  },
  images: {
    title: 'Análisis de imágenes',
    preview: 'Vista previa de la imagen',
    altText: 'Texto alternativo',
    missingAlt: 'Texto alternativo ausente',
    hasAlt: 'Texto alternativo presente',
    dimensions: 'Dimensiones',
    hasDimensions: 'Optimizado',
    noDimensions: 'Sin dimensiones'
  },
  keywords: {
    title: 'Análisis de palabras clave',
    topKeywords: 'Palabras clave principales',
    density: 'Densidad',
    optimal: 'Óptimo',
    tooLow: 'Demasiado bajo',
    tooHigh: 'Demasiado alto',
    noKeywords: 'No se han detectado palabras clave significativas'
  },
  seo: {
    title: 'Elementos SEO',
    metaTitle: 'Título Meta',
    metaDescription: 'Descripción Meta',
    canonical: 'URL canónica',
    og: 'Etiquetas Open Graph',
    missingElement: 'Ausente',
    tooShort: 'Demasiado corto',
    tooLong: 'Demasiado largo',
    good: 'Bueno'
  },
  recommendations: {
    title: 'Recomendaciones',
    excellentQuality: {
      title: 'Calidad de contenido excelente',
      description: 'Tu contenido está bien estructurado y optimizado para SEO. ¡Mantente así!'
    },
    improveContent: {
      title: 'Cómo mejorar tu contenido',
      addMoreContent: {
        title: 'Añadir más contenido',
        description: 'Tu contenido tiene {count} palabras. Considera expandirlo a al menos 800-1000 palabras para mejorar el rendimiento de SEO.'
      },
      addH1: {
        title: 'Añadir un encabezado H1',
        description: 'Cada página debe tener exactamente un encabezado H1 que describa el contenido de la página.'
      },
      multipleH1: {
        title: 'Usar solo un encabezado H1',
        description: 'Tu página tiene {count} encabezados H1. Para mejor SEO, usa exactamente uno H1 y estructura los otros encabezados con H2-H6.'
      },
      addH2: {
        title: 'Añadir encabezados H2',
        description: 'Usa encabezados H2 para dividir tu contenido en secciones lógicas para mejor legibilidad y SEO.'
      },
      addAltText: {
        title: 'Añadir texto alternativo a imágenes',
        description: '{count} imágenes sin texto alternativo. Añade texto alternativo descriptivo a todas las imágenes para mejor accesibilidad y SEO.'
      },
      improveReadability: {
        title: 'Mejorar la legibilidad',
        description: 'Tu contenido tiene una puntuación de legibilidad de {score}. Intenta usar frases más cortas y un lenguaje más simple.'
      },
      addInternalLinks: {
        title: 'Añadir enlaces internos',
        description: 'Añade enlaces a otras páginas relevantes en tu sitio para mejorar la navegación y SEO.'
      },
      addExternalLinks: {
        title: 'Añadir enlaces externos',
        description: 'Crea enlaces a fuentes de autoridad externas para aumentar la credibilidad y el valor de SEO.'
      },
      generalImprovements: {
        title: 'Mejoras generales',
        description: '- Usa un lenguaje más variado y atractivo\n- Añade elementos multimedia (imágenes, videos, infografías)\n- Incluye ejemplos específicos y datos para respaldar tus puntos\n- Estructura el contenido con claras introducciones y conclusiones'
      }
    },
    seoTips: {
      title: 'SEO tips',
      useKeywords: {
        title: 'Usar palabras clave objetivo',
        description: 'Usa palabras clave objetivo en el título, la descripción Meta y el contenido.'
      },
      addAltText: {
        title: 'Añadir texto alternativo a imágenes',
        description: '{count} imágenes sin texto alternativo. Añade texto alternativo descriptivo a todas las imágenes para mejor accesibilidad y SEO.'
      },
      addH2: {
        title: 'Añadir encabezados H2',
        description: 'Usa encabezados H2 para dividir tu contenido en secciones lógicas para mejor legibilidad y SEO.'
      },
      addH1: {
        title: 'Añadir un encabezado H1',
        description: 'Cada página debe tener exactamente un encabezado H1 que describa el contenido de la página.'
      },
      addMoreContent: {
        title: 'Añadir más contenido',
        description: 'Tu contenido tiene {count} palabras. Considera expandirlo a al menos 800-1000 palabras para mejorar el rendimiento de SEO.'
      },
      addExternalLinks: {
        title: 'Añadir enlaces externos',
        description: 'Crea enlaces a fuentes de autoridad externas para aumentar la credibilidad y el valor de SEO.'
      },
      addInternalLinks: {
        title: 'Añadir enlaces internos',
        description: 'Añade enlaces a otras páginas relevantes en tu sitio para mejorar la navegación y SEO.'
      },
      generalImprovements: {
        title: 'Mejoras generales',
        description: '- Usa un lenguaje más variado y atractivo\n- Añade elementos multimedia (imágenes, videos, infografías)\n- Incluye ejemplos específicos y datos para respaldar tus puntos\n- Estructura el contenido con claras introducciones y conclusiones'
      },
      optimizeMeta: {
        title: 'Optimizar descripción Meta',
        description: 'Crea una descripción Meta atractiva (150-160 caracteres) que incluya tus palabras clave objetivo.'
      },
      improveSpeed: {
        title: 'Mejorar la velocidad de la página',
        description: 'Optimiza imágenes, reduce scripts y usa caché del navegador para mejorar los tiempos de carga.'
      },
      mobileOptimization: {
        title: 'Optimización para móviles',
        description: 'Asegura que tu página sea totalmente responsive y ofrezca una buena experiencia de usuario en dispositivos móviles.'
      },
      useSchema: {
        title: 'Usar esquema',
        description: 'Usa el esquema schema.org para describir tu contenido para ayudar a los motores de búsqueda a entenderlo y aumentar las tasas de clic en los resultados de búsqueda.'
      }
    }
  },
  error: {
    title: 'Error',
    message: 'Error al analizar la URL. Por favor, verifica la URL y vuelve a intentarlo.',
    retry: 'Reintentar'
  }
} 