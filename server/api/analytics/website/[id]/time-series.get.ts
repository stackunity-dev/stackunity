import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface TimeSeriesRow extends RowDataPacket {
  date: string;
  count: number;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const period = query.period as string || '30d';

    if (!websiteId) {
      return {
        success: false,
        message: 'Website ID is required'
      };
    }

    // Définir la période pour laquelle récupérer les données
    const now = new Date();
    let startDate: Date;
    let intervalFormat: string;

    // Déterminer la période et le format d'intervalle approprié
    if (period === '7d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      intervalFormat = '%Y-%m-%d';  // Format journalier
    } else if (period === '30d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      intervalFormat = '%Y-%m-%d';  // Format journalier
    } else if (period === '90d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
      intervalFormat = '%Y-%m-%d';  // Format journalier
    } else {
      // Période par défaut: 30 jours
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      intervalFormat = '%Y-%m-%d';  // Format journalier
    }

    // Récupérer l'ID interne du site web
    const [websiteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );

    if (!Array.isArray(websiteRows) || websiteRows.length === 0) {
      return {
        success: false,
        message: 'Website not found'
      };
    }

    const dbWebsiteId = websiteRows[0].id;

    // Requête pour obtenir le nombre de visites par jour
    const timeSeriesQuery = `
      SELECT 
        DATE_FORMAT(start_time, ?) AS date,
        COUNT(DISTINCT session_id) AS count
      FROM 
        analytics_sessions
      WHERE 
        website_id = ? 
        AND start_time >= ?
      GROUP BY 
        DATE_FORMAT(start_time, ?)
      ORDER BY 
        date ASC
    `;

    const [timeSeriesRows] = await pool.query<TimeSeriesRow[]>(
      timeSeriesQuery,
      [intervalFormat, dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' '), intervalFormat]
    );

    // Générer toutes les dates dans la période pour assurer une continuité
    const dateRangeComplete: Array<{ date: string, count: number }> = [];
    const endDate = new Date();

    // Clone startDate pour ne pas modifier la référence originale
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().slice(0, 10);

      // Chercher si cette date existe dans les résultats
      const existingRow = timeSeriesRows.find(row => row.date === formattedDate);

      if (existingRow) {
        dateRangeComplete.push({
          date: formattedDate,
          count: existingRow.count
        });
      } else {
        // Ajouter une entrée avec count=0 pour les jours sans visites
        dateRangeComplete.push({
          date: formattedDate,
          count: 0
        });
      }

      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      success: true,
      data: dateRangeComplete
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données temporelles:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des données temporelles',
      error: error.message
    };
  }
}); 