export default {
  meta: {
    title: 'Centro de Pruebas de API',
    description: 'Pruebe sus APIs RESTful con nuestra interfaz fácil de usar'
  },
  alerts: {
    deleteWarning: 'Advertencia: tome precauciones al usar el método DELETE.',
    noCustomHeaders: 'No se enviaron encabezados personalizados con esta solicitud.',
    runTests: 'Ejecute las pruebas para ver los resultados.'
  },
  cardTitles: {
    newTest: 'Nueva Prueba de API',
    response: 'Respuesta',
    history: 'Historial de solicitudes',
    documentation: 'Documentación OpenAPI',
    apiTests: 'Pruebas automatizadas de API',
    status: 'Estado',
    historySettings: 'Configuración del historial',
    historyCount: 'Número de solicitudes'
  },
  tooltips: {
    historySettings: 'Configuración del historial',
    commonHeaders: 'Encabezados comunes añadidos automáticamente por los navegadores'
  },
  forms: {
    method: 'Método',
    url: 'URL',
    urlPlaceholder: 'https://api.ejemplo.com/endpoint',
    tabs: {
      headers: 'Encabezados',
      body: 'Cuerpo',
      params: 'Parámetros',
      docs: 'Docs',
      tests: 'Pruebas',
      raw: 'Crudo',
      tree: 'Árbol',
      response: 'Encabezados de respuesta',
      request: 'Encabezados de solicitud'
    },
    headers: {
      key: 'Clave',
      keyPlaceholder: 'Authorization',
      value: 'Valor',
      valuePlaceholder: 'Bearer token123',
      add: 'Añadir un encabezado',
      common: 'Encabezados comunes',
      commonNote: 'Algunos encabezados estándar se añaden automáticamente por los navegadores y no se muestran aquí.',
      etc: 'etc.) se añaden automáticamente por los navegadores y no se muestran aquí.'
    },
    params: {
      key: 'Clave',
      keyPlaceholder: 'página',
      value: 'Valor',
      valuePlaceholder: '1',
      add: 'Añadir un parámetro'
    },
    body: {
      label: 'Cuerpo',
      placeholder: '{"clave": "valor"}'
    },
    submit: 'Enviar la solicitud',
    send: 'Enviar la solicitud',
    schemaDepth: 'Profundidad del esquema',
    showExamples: 'Mostrar ejemplos',
    impact: 'Impacto:',
    result: 'Resultado',
    status: 'Estado',
    data: 'Datos',
    saveToHistory: 'Guardar solicitudes en el historial'
  },
  response: {
    status: 'Estado',
    tabs: {
      body: 'Cuerpo',
      headers: 'Encabezados',
      docs: 'Docs',
      tests: 'Pruebas'
    },
    bodyViews: {
      raw: 'Crudo',
      tree: 'Árbol'
    },
    headerTypes: {
      response: 'Encabezados de respuesta',
      request: 'Encabezados de solicitud'
    },
    noCustomHeaders: 'No se enviaron encabezados personalizados con esta solicitud.'
  },
  docs: {
    title: 'Documentación OpenAPI',
    download: 'Descargar',
    schemaDepth: 'Profundidad del esquema',
    showExamples: 'Mostrar ejemplos'
  },
  apiTests: {
    title: 'Pruebas automatizadas de API',
    run: 'Ejecutar pruebas',
    results: {
      success: 'Éxito',
      failure: 'Error',
      pending: 'Pendiente'
    },
    generate: 'Generar pruebas',
    testTypes: {
      status: 'Verificación de estado',
      schema: 'Validación de esquema',
      dataPresence: 'Presencia de datos',
      performance: 'Rendimiento'
    }
  },
  history: {
    title: 'Historial de solicitudes',
    noHistory: 'No hay historial disponible',
    clearAll: 'Borrar todo',
    saveAs: 'Guardar como',
    load: 'Cargar',
    delete: 'Eliminar',
    settings: {
      title: 'Configuración del historial',
      maxEntries: 'Entradas máximas',
      saveAutomatically: 'Guardar solicitudes automáticamente',
      includeHeaders: 'Incluir encabezados',
      includeBody: 'Incluir cuerpo',
      save: 'Guardar configuración'
    }
  },
  collection: {
    title: 'Colecciones',
    create: 'Crear colección',
    import: 'Importar',
    export: 'Exportar',
    addRequest: 'Añadir solicitud a la colección',
    name: 'Nombre de la colección',
    description: 'Descripción'
  },
  errors: {
    invalidUrl: 'URL inválida',
    networkError: 'Error de red',
    timeout: 'Tiempo de espera agotado',
    serverError: 'Error del servidor'
  },
  buttons: {
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    run: 'Ejecutar',
    copy: 'Copiar',
    clear: 'Limpiar',
    delete: 'Eliminar',
    download: 'Descargar'
  }
} 