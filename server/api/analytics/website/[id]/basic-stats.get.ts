import { defineEventHandler, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface StatsRow extends RowDataPacket {
  totalVisitors?: number;
  totalPageViews?: number;
  avgSessionDuration?: number;
  avgPageDuration?: number;
  pageViewsWithDuration?: number;
  durationDataQuality?: number;
  totalInteractions?: number;
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

    const [interactionRows] = await pool.query<StatsRow[]>(
      `SELECT COUNT(*) AS totalInteractions 
       FROM analytics_interactions 
       WHERE website_id = ?`,
      [dbWebsiteId]
    );
    const totalInteractions = interactionRows[0]?.totalInteractions || 0;

    const [avgSessionRows] = await pool.query<StatsRow[]>(
      `SELECT AVG(duration) AS avgSessionDuration 
       FROM analytics_sessions 
       WHERE website_id = ? AND duration IS NOT NULL`,
      [dbWebsiteId]
    );
    const avgSessionDuration = Math.round(avgSessionRows[0]?.avgSessionDuration || 0);

    const [avgPageRows] = await pool.query<StatsRow[]>(
      `SELECT 
         AVG(CASE WHEN duration IS NOT NULL AND duration > 0 THEN duration ELSE NULL END) AS avgPageDuration,
         SUM(CASE WHEN duration IS NOT NULL AND duration > 0 THEN 1 ELSE 0 END) AS pageViewsWithDuration,
         COUNT(*) AS totalPageViews
       FROM analytics_pageviews 
       WHERE website_id = ?`,
      [dbWebsiteId]
    );

    const avgPageDuration = Math.round(avgPageRows[0]?.avgPageDuration || 0);
    const pageViewsWithDuration = avgPageRows[0]?.pageViewsWithDuration || 0;
    const durationDataQuality = totalPageViews > 0
      ? Math.round((pageViewsWithDuration / totalPageViews) * 100)
      : 0;

    let enhancedAvgPageDuration = avgPageDuration;
    if (pageViewsWithDuration > 0 && pageViewsWithDuration < 10) {
      const [recentPageRows] = await pool.query<StatsRow[]>(
        `SELECT AVG(duration) AS avgPageDuration
         FROM analytics_pageviews 
         WHERE website_id = ? AND duration IS NOT NULL AND duration > 0
         ORDER BY enter_time DESC
         LIMIT 100`,
        [dbWebsiteId]
      );

      if (recentPageRows[0]?.avgPageDuration) {
        enhancedAvgPageDuration = Math.round(recentPageRows[0].avgPageDuration);
      }
    }

    return {
      success: true,
      data: {
        totalVisitors,
        totalPageViews,
        totalInteractions,
        avgSessionDuration,
        avgPageDuration: enhancedAvgPageDuration,
        pageViewsWithDuration,
        durationDataQuality
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