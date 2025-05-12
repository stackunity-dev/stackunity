/**
 * Utilitaires pour la géolocalisation
 */

// Correspondance des codes ISO 2 pour certains pays
const countryCodes: Record<string, { code: string, region: string }> = {
  'France': { code: 'FR', region: 'Europe' },
  'United States': { code: 'US', region: 'Amérique du Nord' },
  'USA': { code: 'US', region: 'Amérique du Nord' },
  'Canada': { code: 'CA', region: 'Amérique du Nord' },
  'United Kingdom': { code: 'GB', region: 'Europe' },
  'UK': { code: 'GB', region: 'Europe' },
  'Germany': { code: 'DE', region: 'Europe' },
  'Belgium': { code: 'BE', region: 'Europe' },
  'Switzerland': { code: 'CH', region: 'Europe' },
  'Italy': { code: 'IT', region: 'Europe' },
  'Spain': { code: 'ES', region: 'Europe' },
  'Netherlands': { code: 'NL', region: 'Europe' },
  'Japan': { code: 'JP', region: 'Asie' },
  'Australia': { code: 'AU', region: 'Océanie' },
  'Morocco': { code: 'MA', region: 'Afrique' },
  'China': { code: 'CN', region: 'Asie' },
  'Brazil': { code: 'BR', region: 'Amérique du Sud' },
  'India': { code: 'IN', region: 'Asie' },
  'South Africa': { code: 'ZA', region: 'Afrique' },
  'Argentina': { code: 'AR', region: 'Amérique du Sud' },
  'Mexico': { code: 'MX', region: 'Amérique du Nord' },
  'Russia': { code: 'RU', region: 'Europe' },
  'Sweden': { code: 'SE', region: 'Europe' },
  'Norway': { code: 'NO', region: 'Europe' },
  'Denmark': { code: 'DK', region: 'Europe' },
  'Finland': { code: 'FI', region: 'Europe' },
  'Portugal': { code: 'PT', region: 'Europe' }
};

// Base de données simplifiée des principales villes pour la démonstration
const majorCities: Record<string, { name: string, latitude: number, longitude: number, country: string }[]> = {
  'FR': [
    { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
    { name: 'Lyon', latitude: 45.7578, longitude: 4.8320, country: 'France' },
    { name: 'Marseille', latitude: 43.2965, longitude: 5.3698, country: 'France' },
    { name: 'Toulouse', latitude: 43.6047, longitude: 1.4442, country: 'France' },
    { name: 'Bordeaux', latitude: 44.8378, longitude: -0.5792, country: 'France' },
    { name: 'Lille', latitude: 50.6292, longitude: 3.0573, country: 'France' },
    { name: 'Nice', latitude: 43.7102, longitude: 7.2620, country: 'France' },
    { name: 'Nantes', latitude: 47.2184, longitude: -1.5536, country: 'France' },
    { name: 'Strasbourg', latitude: 48.5734, longitude: 7.7521, country: 'France' },
    { name: 'Rennes', latitude: 48.1173, longitude: -1.6778, country: 'France' },
    { name: 'Poitiers', latitude: 46.5802, longitude: 0.3404, country: 'France' }
  ],
  'US': [
    { name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States' },
    { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, country: 'United States' },
    { name: 'Chicago', latitude: 41.8781, longitude: -87.6298, country: 'United States' },
    { name: 'Houston', latitude: 29.7604, longitude: -95.3698, country: 'United States' },
    { name: 'Phoenix', latitude: 33.4484, longitude: -112.0740, country: 'United States' },
    { name: 'Philadelphia', latitude: 39.9526, longitude: -75.1652, country: 'United States' },
    { name: 'San Antonio', latitude: 29.4241, longitude: -98.4936, country: 'United States' },
    { name: 'San Diego', latitude: 32.7157, longitude: -117.1611, country: 'United States' },
    { name: 'Dallas', latitude: 32.7767, longitude: -96.7970, country: 'United States' },
    { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country: 'United States' }
  ],
  'GB': [
    { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' },
    { name: 'Manchester', latitude: 53.4808, longitude: -2.2426, country: 'United Kingdom' },
    { name: 'Birmingham', latitude: 52.4862, longitude: -1.8904, country: 'United Kingdom' },
    { name: 'Glasgow', latitude: 55.8642, longitude: -4.2518, country: 'United Kingdom' },
    { name: 'Liverpool', latitude: 53.4084, longitude: -2.9916, country: 'United Kingdom' },
    { name: 'Edinburgh', latitude: 55.9533, longitude: -3.1883, country: 'United Kingdom' }
  ],
  'DE': [
    { name: 'Berlin', latitude: 52.5200, longitude: 13.4050, country: 'Germany' },
    { name: 'Munich', latitude: 48.1351, longitude: 11.5820, country: 'Germany' },
    { name: 'Hamburg', latitude: 53.5511, longitude: 9.9937, country: 'Germany' },
    { name: 'Frankfurt', latitude: 50.1109, longitude: 8.6821, country: 'Germany' },
    { name: 'Cologne', latitude: 50.9375, longitude: 6.9603, country: 'Germany' }
  ]
};

/**
 * Détermine le pays à partir des coordonnées géographiques
 * Note: Dans une implémentation réelle, on utiliserait un service de géocodage inverse
 * Comme Google Maps Geocoding API, OpenStreetMap Nominatim, etc.
 * 
 * @param latitude Latitude
 * @param longitude Longitude
 * @returns Information du pays
 */
export async function getGeoCountryFromCoords(latitude: number, longitude: number): Promise<{ name: string, code: string, region: string }> {
  try {
    // Version simplifiée pour la démonstration
    // Détermination approximative basée sur des zones géographiques

    // Europe Occidentale
    if (latitude >= 36 && latitude <= 71 && longitude >= -10 && longitude <= 25) {
      if (latitude >= 43 && latitude <= 51 && longitude >= -5 && longitude <= 8) {
        return { name: 'France', code: 'FR', region: 'Europe' };
      } else if (latitude >= 36 && latitude <= 44 && longitude >= -10 && longitude <= 3) {
        return { name: 'Spain', code: 'ES', region: 'Europe' };
      } else if (latitude >= 36 && latitude <= 47 && longitude >= 6 && longitude <= 18) {
        return { name: 'Italy', code: 'IT', region: 'Europe' };
      } else if (latitude >= 47 && latitude <= 55 && longitude >= 5 && longitude <= 15) {
        return { name: 'Germany', code: 'DE', region: 'Europe' };
      } else if (latitude >= 49 && latitude <= 60 && longitude >= -8 && longitude <= 2) {
        return { name: 'United Kingdom', code: 'GB', region: 'Europe' };
      }
      return { name: 'Europe', code: 'EU', region: 'Europe' };
    }

    // Amérique du Nord
    else if (latitude >= 25 && latitude <= 80 && longitude >= -170 && longitude <= -50) {
      if (latitude >= 25 && latitude <= 50 && longitude >= -125 && longitude <= -65) {
        return { name: 'United States', code: 'US', region: 'Amérique du Nord' };
      } else if (latitude >= 45 && latitude <= 80 && longitude >= -140 && longitude <= -55) {
        return { name: 'Canada', code: 'CA', region: 'Amérique du Nord' };
      }
      return { name: 'North America', code: 'NA', region: 'Amérique du Nord' };
    }

    // Asie
    else if (latitude >= 10 && latitude <= 60 && longitude >= 60 && longitude <= 150) {
      if (latitude >= 30 && latitude <= 50 && longitude >= 110 && longitude <= 150) {
        return { name: 'China', code: 'CN', region: 'Asie' };
      } else if (latitude >= 30 && latitude <= 45 && longitude >= 130 && longitude <= 145) {
        return { name: 'Japan', code: 'JP', region: 'Asie' };
      } else if (latitude >= 8 && latitude <= 35 && longitude >= 70 && longitude <= 90) {
        return { name: 'India', code: 'IN', region: 'Asie' };
      }
      return { name: 'Asia', code: 'AS', region: 'Asie' };
    }

    // Amérique du Sud
    else if (latitude >= -55 && latitude <= 12 && longitude >= -80 && longitude <= -35) {
      if (latitude >= -33 && latitude <= 5 && longitude >= -75 && longitude <= -35) {
        return { name: 'Brazil', code: 'BR', region: 'Amérique du Sud' };
      } else if (latitude >= -55 && latitude <= -20 && longitude >= -75 && longitude <= -55) {
        return { name: 'Argentina', code: 'AR', region: 'Amérique du Sud' };
      }
      return { name: 'South America', code: 'SA', region: 'Amérique du Sud' };
    }

    // Afrique
    else if (latitude >= -35 && latitude <= 37 && longitude >= -18 && longitude <= 52) {
      if (latitude >= -35 && latitude <= -20 && longitude >= 15 && longitude <= 35) {
        return { name: 'South Africa', code: 'ZA', region: 'Afrique' };
      } else if (latitude >= 28 && latitude <= 37 && longitude >= -12 && longitude <= 0) {
        return { name: 'Morocco', code: 'MA', region: 'Afrique' };
      }
      return { name: 'Africa', code: 'AF', region: 'Afrique' };
    }

    // Océanie
    else if (latitude >= -50 && latitude <= -10 && longitude >= 110 && longitude <= 180) {
      return { name: 'Australia', code: 'AU', region: 'Océanie' };
    }

    // Par défaut
    return { name: 'Unknown', code: 'XX', region: 'Unknown' };
  } catch (error) {
    console.error('Erreur lors de la détermination du pays:', error);
    return { name: 'Unknown', code: 'XX', region: 'Unknown' };
  }
}

/**
 * Retourne les informations d'un pays à partir de son nom
 * @param countryName Nom du pays
 * @returns Information du pays
 */
export function getCountryInfo(countryName: string): { code: string, region: string } {
  if (!countryName) return { code: 'XX', region: 'Unknown' };

  const normalizedName = countryName.trim();
  const info = countryCodes[normalizedName];

  return info || { code: 'XX', region: 'Unknown' };
}

export function getCityNameFromCoords(latitude: number, longitude: number, countryCode: string): string {
  // Vérifier si on a des villes pour ce pays
  const cities = majorCities[countryCode];
  if (!cities || cities.length === 0) {
    // Si aucune ville connue pour ce pays, générer un nom basé sur les coordonnées
    return `Ville (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
  }

  // Calculer la distance entre les coordonnées et chaque ville connue
  let closestCity = cities[0];
  let minDistance = calculateDistance(latitude, longitude, closestCity.latitude, closestCity.longitude);

  for (let i = 1; i < cities.length; i++) {
    const distance = calculateDistance(latitude, longitude, cities[i].latitude, cities[i].longitude);
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = cities[i];
    }
  }

  // Si la distance est trop grande, générer un nom basé sur les coordonnées
  // (ici 50 km comme seuil arbitraire)
  if (minDistance > 50) {
    return `Proche de ${closestCity.name} (${minDistance.toFixed(0)} km)`;
  }

  return closestCity.name;
}

/**
 * Calcule la distance en kilomètres entre deux points géographiques 
 * en utilisant la formule de Haversine
 * 
 * @param lat1 Latitude du premier point
 * @param lon1 Longitude du premier point 
 * @param lat2 Latitude du deuxième point
 * @param lon2 Longitude du deuxième point
 * @returns Distance en kilomètres
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
} 