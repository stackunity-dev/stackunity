import { defineEventHandler, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface StatsRow extends RowDataPacket {
  totalVisitors?: number;
  totalPageViews?: number;
  avgSessionDuration?: number;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');

    if (!websiteId) {
      return {
        success: false,
        message: 'ID du site web requis'
      };
    }

    const [websiteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );

    if (!Array.isArray(websiteRows) || websiteRows.length === 0) {
      return {
        success: false,
        message: 'Site web non trouvé'
      };
    }

    const dbWebsiteId = websiteRows[0].id;

    const [visitorCountRows] = await pool.query<StatsRow[]>(
      `SELECT COUNT(DISTINCT visitor_id) AS totalVisitors 
       FROM analytics_sessions 
       WHERE website_id = ?`,
      [dbWebsiteId]
    );
    const totalVisitors = visitorCountRows[0]?.totalVisitors || 0;

    const [pageViewRows] = await pool.query<StatsRow[]>(
      `SELECT COUNT(*) AS totalPageViews 
       FROM analytics_pageviews 
       WHERE website_id = ?`,
      [dbWebsiteId]
    );
    const totalPageViews = pageViewRows[0]?.totalPageViews || 0;

    const [avgSessionRows] = await pool.query<StatsRow[]>(
      `SELECT AVG(duration) AS avgSessionDuration 
       FROM analytics_sessions 
       WHERE website_id = ? AND duration IS NOT NULL`,
      [dbWebsiteId]
    );
    const avgSessionDuration = Math.round(avgSessionRows[0]?.avgSessionDuration || 0);

    return {
      success: true,
      data: {
        totalVisitors,
        totalPageViews,
        avgSessionDuration
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques basiques:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    };
  }
}); 