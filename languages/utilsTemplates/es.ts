export default {
  info: {
    text: 'Información',
    description: 'Este es un mensaje informativo.'
  },
  status: {
    text: '3',
    position: 'arriba final'
  },
  barChart: {
    chartLabels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
  },
  lineChart: {
    chartLabels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  },
  pieChart: {
    chartLabels: ['Equipo A', 'Equipo B', 'Equipo C']
  },
  doughnutChart: {
    chartLabels: ['Producto A', 'Producto B', 'Producto C', 'Producto D']
  },
  radarChart: {
    chartLabels: ['Velocidad', 'Agilidad', 'Fuerza', 'Resistencia', 'Técnica', 'Táctica', 'Trabajo en equipo']
  },
  polarAreaChart: {
    chartLabels: ['Región A', 'Región B', 'Región C', 'Región D', 'Región E']
  },
  dataTable: {
    headers: {
      place: 'Lugar',
      city: 'Ciudad',
      country: 'País',
      popularity: 'Popularidad'
    },
    items: [
      { place: 'Torre Eiffel', city: 'París', country: 'Francia', popularity: '4.7/5' },
      { place: 'Gran Cañón', city: 'Arizona', country: 'EE.UU.', popularity: '4.8/5' },
      { place: 'Coliseo', city: 'Roma', country: 'Italia', popularity: '4.7/5' }
    ]
  },
  fileUpload: {
    dropzoneText: 'Suelta tus archivos aquí o haz clic para cargar',
    acceptTypes: 'image/*,.pdf,.docx',
    maxFiles: 5,
    maxSize: 10
  },
  photoGallery: {
    images: [
      { alt: 'Naturaleza', title: 'Paisaje natural' },
      { alt: 'Montaña', title: 'Vista de montaña' },
      { alt: 'Agua', title: 'Cascada' },
      { alt: 'Arquitectura', title: 'Edificio moderno' }
    ]
  }
} 