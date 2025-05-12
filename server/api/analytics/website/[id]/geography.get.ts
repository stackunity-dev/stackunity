import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { getCityNameFromCoords, getGeoCountryFromCoords } from '../../../../utils/geo-utils';
import { pool } from '../../../db';

interface GeoCountry {
  name: string;
  code: string;
  visitors: number;
  percentage: number;
  trend?: number;
  region: string;
}

interface GeoCity {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  visitors: number;
  percentage: number;
}

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const query = getQuery(event);
    const period = query.period || 'all';

    if (!id) {
      return {
        success: false,
        message: 'ID de site web manquant'
      };
    }

    // Récupérer l'ID interne du site web
    const [websiteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM analytics_websites WHERE tracking_id = ?',
      [id]
    );

    if (!Array.isArray(websiteRows) || websiteRows.length === 0) {
      return {
        success: false,
        message: 'Site web non trouvé'
      };
    }

    const websiteId = websiteRows[0].id;

    // Construire la condition de période
    let periodCondition = '';
    let periodParams: any[] = [];

    if (period !== 'all') {
      let days = 30;
      if (period === '7d') days = 7;
      else if (period === '90d') days = 90;

      periodCondition = 'AND gl.timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)';
      periodParams.push(days);
    }

    // Récupérer les données de géolocalisation
    const [geoLocations] = await pool.query<RowDataPacket[]>(
      `SELECT 
        ROUND(gl.latitude, 2) as latitude,
        ROUND(gl.longitude, 2) as longitude,
        gl.country, 
        COUNT(DISTINCT gl.visitor_id) as visitor_count
      FROM 
        analytics_geo_locations gl
      WHERE 
        gl.website_id = ? 
        ${periodCondition}
      GROUP BY 
        gl.country, 
        ROUND(gl.latitude, 2), 
        ROUND(gl.longitude, 2)`,
      [websiteId, ...periodParams]
    );

    // Récupérer les données détaillées par coordonnées (villes)
    const [geoCities] = await pool.query<RowDataPacket[]>(
      `SELECT 
        ROUND(gl.latitude, 4) as latitude, 
        ROUND(gl.longitude, 4) as longitude, 
        gl.country,
        COUNT(DISTINCT gl.visitor_id) as visitor_count
      FROM 
        analytics_geo_locations gl
      WHERE 
        gl.website_id = ? 
        ${periodCondition}
      GROUP BY 
        ROUND(gl.latitude, 4), 
        ROUND(gl.longitude, 4), 
        gl.country
      ORDER BY 
        visitor_count DESC
      LIMIT 100`,
      [websiteId, ...periodParams]
    );

    // Organiser les données par pays
    const countryMap = new Map<string, { visitors: number, name: string, code: string, region: string }>();
    let totalVisitors = 0;

    // Si aucune donnée, utiliser des données fictives pour démonstration
    if (!Array.isArray(geoLocations) || geoLocations.length === 0) {
      return {
        success: true,
        data: {
          totalVisitors: 0,
          countries: [],
          cities: [],
          message: 'Aucune donnée de géolocalisation disponible'
        }
      };
    }

    // Traiter les données réelles par pays
    for (const location of geoLocations) {
      let countryInfo = {
        name: location.country || 'Unknown',
        code: 'XX',
        region: 'Unknown'
      };

      // Si le pays n'est pas défini, essayer de le déterminer à partir des coordonnées
      if (!location.country && location.latitude && location.longitude) {
        countryInfo = await getGeoCountryFromCoords(location.latitude, location.longitude);
      }

      const countryKey = countryInfo.name || 'Unknown';
      const currentCount = countryMap.get(countryKey)?.visitors || 0;

      countryMap.set(countryKey, {
        visitors: currentCount + location.visitor_count,
        name: countryInfo.name,
        code: countryInfo.code,
        region: countryInfo.region
      });

      totalVisitors += location.visitor_count;
    }

    // Convertir en tableau et calculer les pourcentages
    const countries: GeoCountry[] = [];
    for (const [key, data] of countryMap.entries()) {
      countries.push({
        name: data.name,
        code: data.code,
        visitors: data.visitors,
        percentage: totalVisitors > 0 ? (data.visitors / totalVisitors) * 100 : 0,
        region: data.region
      });
    }

    // Trier par nombre de visiteurs décroissant
    countries.sort((a, b) => b.visitors - a.visitors);

    // Traiter les données par villes
    const cities: GeoCity[] = [];
    if (Array.isArray(geoCities)) {
      for (const location of geoCities) {
        let countryInfo = {
          name: location.country || 'Unknown',
          code: 'XX',
          region: 'Unknown'
        };

        if (!location.country && location.latitude && location.longitude) {
          countryInfo = await getGeoCountryFromCoords(location.latitude, location.longitude);
        }

        // Utiliser la fonction getCityNameFromCoords pour déterminer le nom de la ville
        const cityName = getCityNameFromCoords(
          location.latitude,
          location.longitude,
          countryInfo.code
        );

        cities.push({
          name: cityName,
          country: countryInfo.name,
          countryCode: countryInfo.code,
          latitude: location.latitude,
          longitude: location.longitude,
          visitors: location.visitor_count,
          percentage: totalVisitors > 0 ? (location.visitor_count / totalVisitors) * 100 : 0
        });
      }
    }

    return {
      success: true,
      data: {
        totalVisitors,
        countries,
        cities,
        growthRate: 0 // À implémenter pour calculer la tendance entre les périodes
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données géographiques:', error);

    return {
      success: false,
      message: 'Erreur lors de la récupération des données géographiques',
      error: error.message
    };
  }
}); 