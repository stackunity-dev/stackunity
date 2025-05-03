export default {
  meta: {
    title: 'Visualizador Responsivo',
    description: 'Visualiza tus sitios web en diferentes dispositivos'
  },
  url: {
    label: 'Introduce una URL',
    placeholder: 'https://ejemplo.com',
    select: 'Selecciona una URL',
    rules: {
      required: 'URL requerida',
      startWithHttp: 'La URL debe comenzar con http o https'
    }
  },
  controls: {
    autoRefresh: 'Auto-actualizar',
    interval: 'Intervalo',
    view: 'Ver',
    refresh: 'Actualizar'
  },
  intervals: {
    fiveSeconds: '5 segundos',
    tenSeconds: '10 segundos',
    thirtySeconds: '30 segundos',
    oneMinute: '1 minuto'
  },
  devices: {
    iphone: 'iPhone',
    android: 'Android',
    ipad: 'iPad',
    tablet: 'Tablet',
    laptop: 'Portátil',
    desktop: 'Escritorio'
  },
  messages: {
    iframeError: 'Este sitio no se puede mostrar en un iframe.',
    openInNewTab: 'Abrir en una nueva pestaña',
    enterUrl: 'Introduce una URL para previsualizar',
    urlLoaded: 'URL cargada',
    noUrlToRefresh: 'No hay URL para actualizar'
  }
} 