interface UtilsTemplate {
  type: string;
  [key: string]: any;
}

const templates: Record<string, UtilsTemplate> = {
  info: {
    type: 'alert',
    variant: 'tonal',
    color: 'info',
    text: 'Information',
    description: 'This is an informational message.',
    icon: 'mdi-information'
  },
  status: {
    type: 'badge',
    color: 'success',
    text: '3',
    position: 'top end',
    icon: 'mdi-account'
  },
  barChart: {
    type: 'chart',
    chartType: 'bar',
    chartData: [12, 19, 3, 5, 2, 3],
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    showLegend: true,
    responsive: true,
    maintainAspectRatio: true
  },
  lineChart: {
    type: 'chart',
    chartType: 'line',
    chartData: [5, 10, 15, 10, 20, 15, 25],
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    showLegend: true,
    responsive: true,
    maintainAspectRatio: true
  },
  pieChart: {
    type: 'chart',
    chartType: 'pie',
    chartData: [30, 40, 30],
    chartLabels: ['Team A', 'Team B', 'Team C'],
    showLegend: true,
    responsive: true,
    maintainAspectRatio: true
  },
  doughnutChart: {
    type: 'chart',
    chartType: 'doughnut',
    chartData: [45, 25, 20, 10],
    chartLabels: ['Product A', 'Product B', 'Product C', 'Product D'],
    showLegend: true,
    responsive: true,
    maintainAspectRatio: true
  },
  radarChart: {
    type: 'chart',
    chartType: 'radar',
    chartData: [65, 59, 90, 81, 56, 55, 40],
    chartLabels: ['Speed', 'Agility', 'Strength', 'Endurance', 'Technique', 'Tactics', 'Teamwork'],
    showLegend: true,
    responsive: true,
    maintainAspectRatio: true
  },
  polarAreaChart: {
    type: 'chart',
    chartType: 'polarArea',
    chartData: [11, 16, 7, 3, 14],
    chartLabels: ['Region A', 'Region B', 'Region C', 'Region D', 'Region E'],
    showLegend: true,
    responsive: true,
    maintainAspectRatio: true
  },
  dataTable: {
    type: 'table',
    tableHeaders: [
      { title: 'Place', key: 'place', sortable: true },
      { title: 'City', key: 'city', sortable: true },
      { title: 'Country', key: 'country', sortable: true },
      { title: 'Popularity', key: 'popularity', sortable: true }
    ],
    tableItems: [
      { place: 'Eiffel Tower', city: 'Paris', country: 'France', popularity: '4.7/5' },
      { place: 'Grand Canyon', city: 'Arizona', country: 'USA', popularity: '4.8/5' },
      { place: 'Colosseum', city: 'Rome', country: 'Italy', popularity: '4.7/5' },
    ],
    itemsPerPage: 10,
    sortBy: 'place',
    sortOrder: 'asc',
    showSelect: true,
    showFooter: true,
    dense: false
  },
  // File Upload
  fileUpload: {
    type: 'file',
    acceptTypes: 'image/*,.pdf,.docx',
    maxFiles: 5,
    maxSize: 10,
    dropzoneText: 'Déposez vos fichiers ici ou cliquez pour télécharger',
    showPreview: true,
    autoUpload: true,
    chips: true,
    counter: true,
    validateOnSelect: true,
    returnObject: false,
    color: 'primary',
    multiple: true
  },
  // Galerie d'images
  photoGallery: {
    type: 'gallery',
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', alt: 'Nature', title: 'Paysage naturel' },
      { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', alt: 'Montagne', title: 'Vue montagne' },
      { src: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe', alt: 'Eau', title: 'Cascade' },
      { src: 'https://images.unsplash.com/photo-1486728297118-82a07bc48a28', alt: 'Architecture', title: 'Bâtiment moderne' }
    ],
    thumbnailSize: 120,
    showCaption: true,
    lightbox: true
  },
};

export function getUtilsTemplate(templateName: string): UtilsTemplate | null {
  return templates[templateName] || null;
} 