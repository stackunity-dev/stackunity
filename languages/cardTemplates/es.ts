export default {
  timeline: {
    title: 'Cronología del proyecto',
    subtitle: 'Últimos 7 días',
    text: 'Visualización cronológica de los hitos clave y logros en el ciclo de desarrollo del proyecto con un seguimiento detallado de las actividades.',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d',
    icon: 'mdi-timeline-clock',
    elevation: 3,
    padding: 16,
    rounded: 'xl',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'Filter',
    buttonWidth: 30,
    buttonPosition: 'end',
    showProgress: false,
    variant: 'elevated',
    color: 'deep-orange',
    buttonVariant: 'tonal',
    buttonColor: 'deep-orange-darken-1',
    progressSize: 'small',
    progressColor: 'deep-orange',
    showTimeline: true,
    showSparkline: false
  },

  weather: {
    title: 'Londres, Reino Unido',
    subtitle: 'Parcialmente nublado, 68°F (20°C)',
    text: 'Viento ligero a 6 mph. Humedad: 65%. Probabilidad de precipitación: 20% en la noche. Índice UV: moderado.',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda',
    icon: 'mdi-weather-partly-cloudy',
    elevation: 3,
    padding: 12,
    rounded: 'xl',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'Forecast',
    buttonWidth: 0,
    buttonPosition: 'end',
    showProgress: false,
    variant: 'flat',
    color: 'light-blue',
    buttonVariant: 'tonal',
    buttonColor: 'light-blue-darken-1',
    progressSize: 'default',
    progressColor: 'light-blue',
    showTimeline: false,
    showSparkline: true,
    sparklineData: [18, 16, 20, 22, 19, 18, 17],
    sparklineLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sparklineShowLabels: true,
    sparklineLineWidth: 2,
    sparklineColor: 'light-blue',
    sparklineGradient: false
  },

  statistics: {
    title: 'Rendimiento comercial',
    subtitle: 'Q1 2024',
    text: 'Ingresos: $2.8M (+22%)\nMargen bruto: $1.9M (+18%)\nNuevos clientes: 145 (+35%)',
    image: '',
    icon: 'mdi-finance',
    elevation: 3,
    padding: 16,
    rounded: 'lg',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'Informe detallado',
    buttonWidth: 0,
    buttonPosition: 'end',
    showProgress: false,
    showTimeline: false,
    showSparkline: true,
    sparklineType: 'area',
    sparklineData: [120, 145, 138, 162, 185, 175, 198, 220, 210, 245, 260],
    sparklineColor: 'green',
    sparklineHeight: 100,
    sparklineLabelSize: 16,
    sparklineShowValue: true,
    sparklineLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    sparklineShowLabels: true,
    sparklineLineWidth: 2,
    sparklineGradient: false
  },

  file: {
    title: 'Presentación estratégica.pptx',
    subtitle: '8.2 MB - Actualizado hoy',
    text: 'Presentación completa que incluye análisis del mercado, objetivos estratégicos y plan de acción para 2024-2025.',
    image: '',
    icon: 'mdi-file-presentation-box',
    variant: '',
    color: 'orange',
    elevation: 2,
    padding: 12,
    rounded: 'lg',
    loading: false,
    disabled: false,
    showButtons: true,
    buttonText: 'Abrir en github',
    buttonVariant: 'text',
    buttonColor: 'orange-darken-1',
    buttonWidth: 0,
    buttonPosition: 'start',
    buttonIcon: 'mdi-github',
    showProgress: false,
  }
}