export default {
  meta: {
    title: 'Análisis Semántico - StackUnity',
    description: 'Analice la estructura semántica de su sitio web, evalúe HTML, ARIA y etiquetas meta'
  },
  page: {
    title: 'Análisis Semántico',
    subtitle: 'Analice la estructura semántica de su sitio web'
  },
  form: {
    urlLabel: 'URL del sitio a analizar',
    urlPlaceholder: 'https://ejemplo.com',
    urlHint: 'Ingrese la URL completa incluyendo https://',
    urlRule: 'Por favor, ingrese una URL válida que comience con http:// o https://',
    analyzeButton: 'Analizar contenido'
  },
  loading: {
    text: 'Cargando resultados del análisis'
  },
  results: {
    title: 'Resultados del Análisis',
    averageScore: 'Puntuación Media',
    scoreLabel: 'Puntuación: {score}%',
    html: {
      title: 'Estructura HTML',
      score: 'Puntuación estructura HTML: {score}%',
      elements: 'Elementos de estructura HTML'
    },
    aria: {
      title: 'Accesibilidad ARIA',
      score: 'Puntuación ARIA: {score}%',
      missingAttributes: 'Atributos ARIA faltantes',
      missingLabels: 'Etiquetas faltantes',
      formElementsWithLabels: 'Elementos de formulario con etiquetas',
      missingAriaCount: 'Cantidad de atributos ARIA faltantes',
      invalidAriaCount: 'Atributos ARIA inválidos',
      interactiveElementsWithAria: 'Elementos interactivos con ARIA',
      totalInteractiveElements: 'Total de elementos interactivos',
      elementsToCompleteWithAria: 'Elementos a completar con ARIA'
    },
    meta: {
      title: 'Etiquetas Meta',
      score: 'Puntuación etiquetas meta: {score}%',
      requiredTags: 'Etiquetas meta requeridas',
      presentCount: 'Presentes: {count}',
      missingCount: 'Faltantes: {count}',
      availableTags: 'Etiquetas meta disponibles',
      detailedScore: 'Puntuación detallada de etiquetas meta',
      essentialTags: 'Etiquetas meta esenciales',
      socialTags: 'Etiquetas meta sociales',
      technicalTags: 'Etiquetas meta técnicas',
      contentTags: 'Etiquetas meta de contenido',
      socialSharingTags: 'Etiquetas meta de compartición social',
      htmlCodeOfMetaTags: 'Código HTML de etiquetas meta',
      detectedIssues: 'Problemas detectados'
    },
    readability: {
      title: 'Análisis de Legibilidad',
      score: 'Puntuación:',
      grade: 'Grado:',
      words: 'Palabras:',
      sentences: 'Frases:'
    },
    headings: {
      title: 'Estructura de Encabezados',
      structure: 'Estructura de encabezados de la página'
    },
    headingStructure: {
      title: 'Estructura de Encabezados'
    }
  },
  tabs: {
    htmlStructure: 'Estructura HTML',
    accessibilityAria: 'Accesibilidad ARIA',
    metaTags: 'Etiquetas Meta'
  },
  categories: {
    html: 'HTML',
    aria: 'ARIA',
    meta: 'META'
  },
  elementTitles: {
    doctype: 'DOCTYPE',
    html: 'Etiqueta HTML',
    head: 'Etiqueta HEAD',
    title: 'Etiqueta TITLE',
    body: 'Etiqueta BODY',
    header: 'Etiqueta HEADER',
    main: 'Etiqueta MAIN',
    footer: 'Etiqueta FOOTER',
    navigation: 'Navegación',
    headings: 'Encabezados',
    semanticElements: 'Elementos semánticos',
    lists: 'Listas',
    images: 'Imágenes',
    links: 'Enlaces',
    tables: 'Tablas',
    forms: 'Formularios'
  },
  suggestions: {
    title: 'Sugerencias de Mejora',
    htmlSuggestions: 'Sugerencias para la Estructura HTML',
    ariaSuggestions: 'Sugerencias para ARIA',
    metaSuggestions: 'Sugerencias para Etiquetas Meta',
    noSuggestions: '¡No hay sugerencias disponibles. Su sitio web está bien estructurado!'
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