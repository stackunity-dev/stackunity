export default {
  meta: {
    title: 'Accesibilidad - StackUnity',
    description: 'Herramientas de accesibilidad para desarrolladores web'
  },
  contrastChecker: {
    title: 'Verificador de Contraste',
    textColor: 'Color del texto',
    backgroundColor: 'Color de fondo',
    colorHint: 'Soporta hex, rgb, hsl o nombres de colores',
    calculateButton: 'Calcular contraste',
    preview: {
      title: 'Vista previa de Contraste',
      normalText: 'Texto Normal (16px)',
      largeText: 'Texto Grande (18px+)',
      boldText: 'Texto en Negrita',
      italicText: 'Texto en Cursiva',
      linkExample: 'Ejemplo de Enlace'
    },
    results: {
      contrastRatio: 'Ratio de Contraste',
      insufficientContrast: 'Contraste Insuficiente',
      acceptableContrast: 'Contraste Aceptable',
      excellentContrast: 'Contraste Excelente',
      normalTextRequirement: 'Texto Normal (mín. 4.5:1)',
      largeTextRequirement: 'Texto Grande (mín. 3:1)',
      insufficientMessage: 'El contraste es insuficiente para una buena legibilidad. Prueba colores más contrastados.',
      successMessage: '¡Felicitaciones! Tus colores cumplen los estándares de contraste para un sitio accesible.',
      wcagAA: 'Estándar WCAG 2.1 AA',
      wcagAAA: 'Estándar WCAG 2.1 AAA'
    }
  },
  visionSimulator: {
    title: 'Simulador de Discapacidad Visual',
    urlLabel: 'URL del sitio a simular',
    urlHint: 'Ingresa la URL completa (https://...)',
    visionTypeLabel: 'Tipo de discapacidad visual',
    intensityLabel: 'Intensidad del filtro',
    loading: 'Cargando...',
    enterUrl: 'Ingresa una URL para comenzar',
    limitedAccess: {
      title: 'Acceso limitado',
      description: 'Actualiza a la versión premium para acceder a todos los tipos de discapacidades visuales.',
      upgradeButton: 'Actualizar'
    },
    visionTypes: {
      normal: 'Visión normal',
      protanopia: 'Protanopia (Rojo-Verde)',
      deuteranopia: 'Deuteranopia (Rojo-Verde)',
      tritanopia: 'Tritanopia (Azul-Amarillo)',
      achromatopsia: 'Acromatopsia (Blanco y Negro)',
      blur: 'Desenfoque'
    },
    fullscreenControls: {
      exitFullscreen: 'Salir de pantalla completa',
      refreshPage: 'Actualizar página',
      visionType: 'Tipo de visión',
      otherTypes: 'Otros tipos (Estándar)'
    },
    alerts: {
      invalidUrl: 'Por favor, ingresa una URL válida',
      accessAlert: 'Esta simulación solo está disponible para usuarios estándar. Actualiza a la versión estándar para acceder a todos los tipos de discapacidades visuales.'
    }
  }
} 