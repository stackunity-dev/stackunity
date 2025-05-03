export default {
  info: {
    text: 'Information',
    description: 'This is an informational message.'
  },
  status: {
    text: '3',
    position: 'top end'
  },
  barChart: {
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  lineChart: {
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  pieChart: {
    chartLabels: ['Team A', 'Team B', 'Team C']
  },
  doughnutChart: {
    chartLabels: ['Product A', 'Product B', 'Product C', 'Product D']
  },
  radarChart: {
    chartLabels: ['Speed', 'Agility', 'Strength', 'Endurance', 'Technique', 'Tactics', 'Teamwork']
  },
  polarAreaChart: {
    chartLabels: ['Region A', 'Region B', 'Region C', 'Region D', 'Region E']
  },
  dataTable: {
    headers: {
      place: 'Place',
      city: 'City',
      country: 'Country',
      popularity: 'Popularity'
    },
    items: [
      { place: 'Eiffel Tower', city: 'Paris', country: 'France', popularity: '4.7/5' },
      { place: 'Grand Canyon', city: 'Arizona', country: 'USA', popularity: '4.8/5' },
      { place: 'Colosseum', city: 'Rome', country: 'Italy', popularity: '4.7/5' }
    ]
  },
  fileUpload: {
    dropzoneText: 'Drop your files here or click to upload',
    acceptTypes: 'image/*,.pdf,.docx',
    maxFiles: 5,
    maxSize: 10
  },
  photoGallery: {
    images: [
      { alt: 'Nature', title: 'Natural landscape' },
      { alt: 'Mountain', title: 'Mountain view' },
      { alt: 'Water', title: 'Waterfall' },
      { alt: 'Architecture', title: 'Modern building' }
    ]
  }
} 