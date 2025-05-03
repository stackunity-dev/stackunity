export default {
  meta: {
    title: 'Análisis de Sitios Web',
    description: 'Analice el rendimiento, la seguridad y el SEO de su sitio web'
  },
  alerts: {
    noWebsiteData: 'No hay datos de sitio web disponibles para esta cuenta. Por favor, añada un sitio web a su cuenta a continuación.',
    addWebsite: 'Añadir sitio web'
  },
  loading: {
    progress: '{value}%'
  },
  cards: {
    websiteData: {
      title: 'Datos del sitio web',
      mainUrl: 'URL principal',
      urlsDetected: '{count} URL{plural} detectada{plural}',
      socialMedia: 'Vista previa de redes sociales',
      socialUnavailable: 'Metadatos de redes sociales no disponibles',
      generatedSitemap: 'Mapa del sitio generado',
      copySitemap: 'Copiar mapa del sitio',
      showLess: 'Mostrar menos',
      showMore: 'Mostrar {count} más'
    },
    analysis: {
      title: 'Análisis del sitio web',
      description: 'Ejecute un análisis completo de su sitio web para obtener información sobre rendimiento, seguridad y más.',
      startAnalysis: 'Iniciar análisis'
    },
    metrics: {
      title: 'Métricas SSUC',
      averageOf: 'Promedio de {count} URLs',
      performance: 'Rendimiento',
      seo: 'SEO',
      security: 'Seguridad',
      usability: 'Usabilidad',
      tooltips: {
        fcp: 'Primera Pintura con Contenido',
        lcp: 'Pintura de Contenido Más Grande',
        cls: 'Cambio Acumulativo de Diseño'
      }
    },
    technical: {
      title: 'Análisis técnico',
      robotsTxt: 'Robots.txt',
      sitemap: 'Mapa del sitio',
      ssl: 'Certificado SSL',
      responsiveness: 'Diseño responsivo',
      headers: 'Cabeceras HTTP',
      mobileFriendly: 'Adaptado para móviles',
      found: 'Encontrado',
      notFound: 'No encontrado',
      valid: 'Válido',
      invalid: 'No válido',
      enabled: 'Activado',
      disabled: 'Desactivado',
      secure: 'Seguro',
      notSecure: 'No seguro'
    }
  },
  issues: {
    title: 'Problemas detectados',
    severity: {
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      info: 'Info'
    },
    noIssues: 'No se detectaron problemas',
    viewAll: 'Ver todos los problemas',
    fix: 'Corregir',
    ignore: 'Ignorar'
  },
  pageDetails: {
    title: 'Detalles de la página',
    mainUrl: 'URL principal',
    lastAnalyzed: 'Último análisis: {date}',
    metaTags: 'Etiquetas Meta',
    headings: 'Estructura de encabezados',
    images: 'Imágenes',
    links: 'Enlaces',
    scripts: 'Scripts',
    stylesheets: 'Hojas de estilo',
    noItems: 'No se encontraron elementos'
  },
  insights: {
    title: 'Estadísticas del sitio',
    pageCount: 'Páginas analizadas',
    totalIssues: 'Problemas totales',
    avgPageSize: 'Tamaño promedio de página',
    avgLoadTime: 'Tiempo promedio de carga'
  },
  buttons: {
    reanalyze: 'Reanalizar',
    export: 'Exportar informe',
    settings: 'Configuración',
    viewDetails: 'Ver detalles',
    found: 'Encontrado',
    notFound: 'No encontrado',
    viewContent: 'Ver contenido',
    issues: 'Problemas'
  }
} 