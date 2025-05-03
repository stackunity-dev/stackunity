export default {
  meta: {
    title: 'Generador de Robots.txt y Schema.org',
    description: 'Genere archivos robots.txt y datos estructurados Schema.org para su sitio web'
  },
  privacyNotice: {
    title: 'Aviso de privacidad',
    content: 'No se recopilan ni almacenan datos en nuestros servidores durante el proceso de generación. Todo el contenido se procesa localmente en su navegador.'
  },
  errorInfo: {
    title: 'Información:',
    stillGenerate: 'La auditoría SEO falló, pero aún puede generar contenido con los datos actuales.',
    solutions: 'Posibles soluciones para la auditoría:',
    chromeServer: 'Compruebe que Google Chrome está instalado en el servidor',
    chromeAccess: 'El usuario del servidor debe tener acceso al archivo chrome.exe'
  },
  configuration: {
    title: 'Configuración',
    websiteInfo: 'Información del sitio web',
    domain: 'Dominio del sitio',
    domainHint: 'Introduzca el dominio de su sitio sin protocolo (http/https)',
    protocol: 'Protocolo',
    skipAnalysis: 'Generar sin análisis del sitio (usar solo datos ingresados)',
    skipAnalysisHint: 'Active esta opción si el análisis del sitio falla'
  },
  tabs: {
    robots: 'Robots.txt',
    schema: 'Schema.org'
  },
  robotsConfig: {
    pathManagement: 'Gestión de rutas',
    templates: 'Plantillas predefinidas',
    disallowedPaths: 'Rutas prohibidas',
    allowedPaths: 'Rutas permitidas',
    pathToDisallow: 'Ruta a prohibir',
    pathToAllow: 'Ruta a permitir'
  },
  schemaConfig: {
    templates: 'Plantillas de Schema.org'
  },
  robotsSettings: {
    title: 'Ajustes de Robots.txt',
    userAgent: 'Agente de usuario',
    customUserAgent: 'Agente de usuario personalizado',
    crawlDelay: 'Retardo de rastreo (segundos)',
    noDelay: 'Dejar vacío para no retrasar',
    disallowedPaths: 'Rutas prohibidas',
    allowedPaths: 'Rutas permitidas',
    add: 'Añadir',
    sitemapUrl: 'URL del Sitemap'
  },
  schemaSettings: {
    title: 'Ajustes de Schema.org',
    schemaType: 'Tipo de Schema',
    name: 'Nombre',
    description: 'Descripción',
    url: 'URL',
    commonProperties: 'Propiedades comunes',
    imageUrl: 'URL de la imagen',
    telephone: 'Teléfono',
    email: 'Correo electrónico',
    address: 'Dirección',
    logoUrl: 'URL del logotipo',
    properties: 'Propiedades'
  },
  templateTitles: {
    wordpress: 'WordPress',
    ecommerce: 'E-commerce',
    blog: 'Blog',
    article: 'Artículo',
    product: 'Producto',
    organization: 'Organización',
    localBusiness: 'Negocio local'
  },
  templateDescriptions: {
    wordpress: 'Configuración óptima para sitios WordPress',
    ecommerce: 'Configuración óptima para sitios de comercio electrónico',
    blog: 'Configuración óptima para blogs',
    article: 'Estructura para artículos de blog',
    product: 'Estructura para productos de comercio electrónico',
    organization: 'Estructura para organizaciones',
    localBusiness: 'Estructura para negocios locales'
  },
  templateTypes: {
    wordpress: {
      name: 'WordPress',
      description: 'Configuración óptima para sitios WordPress'
    },
    ecommerce: {
      name: 'E-commerce',
      description: 'Configuración óptima para sitios de comercio electrónico'
    },
    blog: {
      name: 'Blog',
      description: 'Configuración óptima para blogs'
    },
    article: {
      name: 'Artículo',
      description: 'Estructura para artículos de blog'
    },
    product: {
      name: 'Producto',
      description: 'Estructura para productos de comercio electrónico'
    },
    organization: {
      name: 'Organización',
      description: 'Estructura para organizaciones'
    },
    localBusiness: {
      name: 'Negocio local',
      description: 'Estructura para negocios locales'
    }
  },
  preview: {
    configureSettings: 'Configure sus ajustes',
    andGenerate: 'y haga clic en "Generar"',
    generatedCode: 'Código generado'
  },
  actions: {
    generate: 'Generar contenido',
    analyzing: 'Analizando...'
  },
  codePreview: {
    code: 'Código',
    preview: 'Vista previa',
    copy: 'Copiar',
    download: 'Descargar',
    errorParsingJson: 'Error al analizar JSON'
  },
  errors: {
    validDomain: 'Por favor, introduzca un dominio válido.',
    auditFailed: 'El servidor de análisis encontró un error (500). Esto puede deberse a una sobrecarga del servidor o a un problema con el sitio que se está analizando.',
    notFound: 'El sitio solicitado no se encontró (404). Compruebe que la URL es correcta y que el sitio es accesible.',
    connectionRefused: 'Imposible conectar con el sitio. Asegúrese de que el sitio es accesible y que su conexión a internet funciona.',
    timeout: 'El análisis tomó demasiado tiempo y fue interrumpido. Intente analizar un sitio más pequeño o aumente el tiempo de espera.',
    generic: 'Se produjo un error durante el análisis del sitio.',
    contentGeneration: 'Se produjo un error al generar el contenido.',
    continueWithSettings: 'Aún puede generar contenido con los ajustes actuales.',
    warning: 'Advertencia:'
  },
  templates: {
    rules: {
      description: 'Descripción',
      severity: 'Importancia',
      category: 'Categoría',
      path: 'Ruta',
      type: 'Tipo'
    },
    properties: {
      headline: 'Título del artículo',
      author: 'Nombre del autor',
      datePublished: 'Fecha de publicación',
      dateModified: 'Fecha de modificación',
      image: 'Imagen principal',
      description: 'Descripción',
      articleBody: 'Contenido del artículo',
      publisher: 'Nombre del editor',
      keywords: 'Palabras clave',
      articleSection: 'Categoría',
      inLanguage: 'Idioma',
      name: 'Nombre',
      offers: 'Precio y disponibilidad',
      brand: 'Marca',
      sku: 'Referencia del producto',
      gtin: 'GTIN del producto',
      mpn: 'Número de pieza del fabricante',
      color: 'Color',
      material: 'Material',
      weight: 'Peso',
      category: 'Categoría',
      aggregateRating: 'Valoración media',
      logo: 'Logotipo',
      telephone: 'Número de teléfono',
      email: 'Correo electrónico',
      address: 'Dirección postal',
      foundingDate: 'Fecha de fundación',
      legalName: 'Razón social',
      numberOfEmployees: 'Número de empleados',
      socialProfiles: 'Perfiles sociales',
      url: 'URL del sitio web',
      openingHours: 'Horario de apertura',
      priceRange: 'Rango de precios',
      areaServed: 'Área de servicio',
      hasMap: 'Enlace al mapa',
      geo: 'Coordenadas geográficas'
    },
    categories: {
      admin: 'Administración',
      system: 'Sistema',
      plugins: 'Plugins',
      themes: 'Temas',
      security: 'Seguridad',
      auth: 'Autenticación',
      media: 'Medios',
      cache: 'Caché',
      checkout: 'Pago',
      cart: 'Carrito',
      user: 'Usuario',
      search: 'Búsqueda',
      catalog: 'Catálogo',
      products: 'Productos',
      categories: 'Categorías',
      api: 'API',
      static: 'Archivos estáticos',
      tags: 'Etiquetas',
      authors: 'Autores',
      feeds: 'Feeds RSS',
      comments: 'Comentarios'
    },
    severity: {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    }
  },
  tools: {
    new: 'Nuevo',
    premium: 'Premium',
    explore: 'Explorar'
  }
} 