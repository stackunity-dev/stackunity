import { createError, defineEventHandler } from 'h3';

// Cache des résultats pendant 1 heure pour limiter les appels à l'API externe
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 heure en millisecondes

export default defineEventHandler(async (event) => {
  try {
    // Récupérer l'IP du client
    const clientIP = event.req.headers['x-forwarded-for'] ||
      event.req.socket.remoteAddress ||
      '127.0.0.1';

    const ip = Array.isArray(clientIP) ? clientIP[0] : String(clientIP).split(',')[0].trim();

    // Vérifier le cache
    const now = Date.now();
    const cachedResult = cache.get(ip);

    if (cachedResult && (now - cachedResult.timestamp) < CACHE_TTL) {
      return cachedResult.data;
    }

    // Effectuer la requête à ipapi.co
    const response = await fetch(`https://ipapi.co/${ip}/json/`);

    if (!response.ok) {
      console.error(`Erreur API ipapi: ${response.status} - ${response.statusText}`);
      throw createError({
        statusCode: response.status,
        statusMessage: 'Erreur lors de la récupération des données de localisation'
      });
    }

    const data = await response.json();

    // Stocker dans le cache
    cache.set(ip, { data, timestamp: now });

    return data;
  } catch (error) {
    console.error('Erreur proxy ipapi:', error);

    // Renvoyer des données par défaut en cas d'erreur
    return {
      country_name: 'Unknown',
      city: 'Unknown',
      ip: 'Unknown',
      error: true
    };
  }
}); 