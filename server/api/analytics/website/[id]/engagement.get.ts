import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const period = query.period as string || 'all';

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

    let dateFilter = '';
    let dateParams: any[] = [];

    const now = new Date();
    let startDate: Date | null = null;

    if (period === '7d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === '30d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else if (period === '90d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
    }

    if (startDate) {
      dateFilter = 'AND timestamp >= ?';
      dateParams.push(startDate.toISOString().slice(0, 19).replace('T', ' '));
    }

    const scrollQuery = `
      SELECT 
        AVG(CASE 
          WHEN JSON_EXTRACT(value_data, '$.scrollDepth') IS NOT NULL 
          THEN CAST(JSON_EXTRACT(value_data, '$.scrollDepth') AS DECIMAL(10,2))
          ELSE NULL 
        END) AS averageScrollDepth,
        COUNT(*) AS totalPageViews,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.scrollDepth') >= 25 THEN 1 ELSE 0 END) AS reaching25,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.scrollDepth') >= 50 THEN 1 ELSE 0 END) AS reaching50,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.scrollDepth') >= 75 THEN 1 ELSE 0 END) AS reaching75,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.scrollDepth') >= 100 THEN 1 ELSE 0 END) AS reaching100
      FROM analytics_interactions
      WHERE website_id = ? 
        AND interaction_type = 'page_duration'
        ${startDate ? dateFilter : ''}
    `;

    const [scrollRows] = await pool.query<RowDataPacket[]>(
      scrollQuery,
      startDate ? [dbWebsiteId, ...dateParams] : [dbWebsiteId]
    );

    const scrollData = scrollRows[0];
    const totalPageViews = scrollData.totalPageViews || 1; // Éviter la division par zéro

    const scrollMetrics = {
      averageScrollDepth: scrollData.averageScrollDepth || 0,
      percentagesReaching25: (scrollData.reaching25 / totalPageViews) * 100 || 0,
      percentagesReaching50: (scrollData.reaching50 / totalPageViews) * 100 || 0,
      percentagesReaching75: (scrollData.reaching75 / totalPageViews) * 100 || 0,
      percentagesReaching100: (scrollData.reaching100 / totalPageViews) * 100 || 0
    };

    const timeQuery = `
      SELECT 
        AVG(duration) AS averageSessionDuration,
        COUNT(*) AS totalSessions,
        SUM(duration) AS totalTimeSpent,
        SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) AS bounceCount
      FROM analytics_sessions
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
    `;

    const [timeRows] = await pool.query<RowDataPacket[]>(
      timeQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );

    const pageTimeQuery = `
      SELECT 
        AVG(duration) AS averageTimeOnPage,
        COUNT(*) AS totalPages
      FROM analytics_pageviews
      WHERE website_id = ? ${startDate ? 'AND enter_time >= ?' : ''}
    `;

    const [pageTimeRows] = await pool.query<RowDataPacket[]>(
      pageTimeQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );

    const timeData = timeRows[0];
    const pageTimeData = pageTimeRows[0];
    const totalSessions = timeData.totalSessions || 1;

    const timeMetrics = {
      averageSessionDuration: timeData.averageSessionDuration || 0,
      averageTimeOnPage: pageTimeData.averageTimeOnPage || 0,
      totalTimeSpent: timeData.totalTimeSpent || 0,
      bounceRate: (timeData.bounceCount / totalSessions) * 100 || 0
    };

    const sessionQuery = `
      SELECT 
        COUNT(*) AS totalSessions,
        COUNT(DISTINCT visitor_id) AS uniqueVisitors
      FROM analytics_sessions
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
    `;

    const [sessionRows] = await pool.query<RowDataPacket[]>(
      sessionQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );

    const returningQuery = `
      SELECT COUNT(DISTINCT visitor_id) AS returningVisitors
      FROM analytics_sessions
      WHERE website_id = ? 
        AND visitor_id IN (
          SELECT visitor_id
          FROM analytics_sessions
          WHERE website_id = ?
          GROUP BY visitor_id
          HAVING COUNT(*) > 1
        )
        ${startDate ? 'AND start_time >= ?' : ''}
    `;

    const [returningRows] = await pool.query<RowDataPacket[]>(
      returningQuery,
      startDate
        ? [dbWebsiteId, dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
        : [dbWebsiteId, dbWebsiteId]
    );

    const sessionData = sessionRows[0];
    const returningData = returningRows[0];
    const uniqueVisitors = sessionData.uniqueVisitors || 1;

    const sessionMetrics = {
      totalSessions: sessionData.totalSessions || 0,
      uniqueVisitors: uniqueVisitors,
      sessionsPerVisitor: sessionData.totalSessions / uniqueVisitors || 1,
      returningVisitors: returningData.returningVisitors || 0
    };

    const clickQuery = `
      SELECT 
        COUNT(*) AS totalClicks,
        COUNT(DISTINCT session_id) AS sessionsWithClicks
      FROM analytics_interactions
      WHERE website_id = ? 
        AND interaction_type = 'click'
        ${startDate ? dateFilter : ''}
    `;

    const [clickRows] = await pool.query<RowDataPacket[]>(
      clickQuery,
      startDate ? [dbWebsiteId, ...dateParams] : [dbWebsiteId]
    );

    const elementQuery = `
      SELECT 
        element_selector AS selector,
        COUNT(*) AS count
      FROM analytics_interactions
      WHERE website_id = ? 
        AND interaction_type = 'click'
        AND element_selector IS NOT NULL
        ${startDate ? dateFilter : ''}
      GROUP BY element_selector
      ORDER BY count DESC
      LIMIT 5
    `;

    const [elementRows] = await pool.query<RowDataPacket[]>(
      elementQuery,
      startDate ? [dbWebsiteId, ...dateParams] : [dbWebsiteId]
    );

    const clickData = clickRows[0];
    const totalClicks = clickData.totalClicks || 0;
    const totalMinutes = timeData.totalTimeSpent / 60 || 1;

    const clickMetrics = {
      clickRate: clickData.sessionsWithClicks / totalSessions || 0,
      clicksPerSession: totalClicks / totalSessions || 0,
      clicksPerMinute: totalClicks / totalMinutes || 0,
      mostClickedElements: elementRows
    };

    const timeScore = Math.min(100, (timeMetrics.averageTimeOnPage / 120) * 100);
    const scrollScore = scrollMetrics.averageScrollDepth;
    const clickScore = Math.min(100, (clickMetrics.clicksPerSession / 3) * 100);
    const bounceScore = Math.max(0, 100 - timeMetrics.bounceRate);
    const returnScore = Math.min(100, (sessionMetrics.returningVisitors / uniqueVisitors) * 200);

    const globalScore = Math.round(
      timeScore * 0.3 +
      scrollScore * 0.25 +
      clickScore * 0.2 +
      bounceScore * 0.15 +
      returnScore * 0.1
    );

    return {
      success: true,
      data: {
        globalScore,
        scrollMetrics,
        timeMetrics,
        sessionMetrics,
        clickMetrics
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'engagement:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des données d\'engagement'
    };
  }
}); 