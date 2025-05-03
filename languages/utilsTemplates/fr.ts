export default {
  info: {
    text: 'Information',
    description: 'Ceci est un message informatif.'
  },
  status: {
    text: '3',
    position: 'haut fin'
  },
  barChart: {
    chartLabels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  },
  lineChart: {
    chartLabels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  },
  pieChart: {
    chartLabels: ['Équipe A', 'Équipe B', 'Équipe C']
  },
  doughnutChart: {
    chartLabels: ['Produit A', 'Produit B', 'Produit C', 'Produit D']
  },
  radarChart: {
    chartLabels: ['Vitesse', 'Agilité', 'Force', 'Endurance', 'Technique', 'Tactique', 'Travail d\'équipe']
  },
  polarAreaChart: {
    chartLabels: ['Région A', 'Région B', 'Région C', 'Région D', 'Région E']
  },
  dataTable: {
    headers: {
      place: 'Lieu',
      city: 'Ville',
      country: 'Pays',
      popularity: 'Popularité'
    },
    items: [
      { place: 'Tour Eiffel', city: 'Paris', country: 'France', popularity: '4.7/5' },
      { place: 'Grand Canyon', city: 'Arizona', country: 'États-Unis', popularity: '4.8/5' },
      { place: 'Colisée', city: 'Rome', country: 'Italie', popularity: '4.7/5' }
    ]
  },
  fileUpload: {
    dropzoneText: 'Déposez vos fichiers ici ou cliquez pour télécharger',
    acceptTypes: 'image/*,.pdf,.docx',
    maxFiles: 5,
    maxSize: 10
  },
  photoGallery: {
    images: [
      { alt: 'Nature', title: 'Paysage naturel' },
      { alt: 'Montagne', title: 'Vue montagne' },
      { alt: 'Eau', title: 'Cascade' },
      { alt: 'Architecture', title: 'Bâtiment moderne' }
    ]
  }
} 