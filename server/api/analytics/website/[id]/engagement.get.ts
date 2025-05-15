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
          WHEN JSON_EXTRACT(value_data, '$.depth') IS NOT NULL 
          THEN CAST(JSON_EXTRACT(value_data, '$.depth') AS DECIMAL(10,2))
          ELSE NULL 
        END) AS averageScrollDepth,
        COUNT(DISTINCT pageview_id) AS totalPageViews,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.depth') >= 25 THEN 1 ELSE 0 END) AS reaching25,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.depth') >= 50 THEN 1 ELSE 0 END) AS reaching50,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.depth') >= 75 THEN 1 ELSE 0 END) AS reaching75,
        SUM(CASE WHEN JSON_EXTRACT(value_data, '$.depth') >= 100 THEN 1 ELSE 0 END) AS reaching100
      FROM analytics_interactions
      WHERE website_id = ? 
        AND interaction_type = 'scroll_depth'
        ${startDate ? dateFilter : ''}
    `;

    const [scrollRows] = await pool.query<RowDataPacket[]>(
      scrollQuery,
      startDate ? [dbWebsiteId, ...dateParams] : [dbWebsiteId]
    );

    const scrollData = scrollRows[0];
    const totalPageViews = scrollData.totalPageViews || 1; // Éviter la division par zéro

    const scrollMetrics = {
      averageScrollDepth: Number(scrollData.averageScrollDepth) || 0,
      percentagesReaching25: Math.min(100, Number((scrollData.reaching25 / totalPageViews) * 100) || 0),
      percentagesReaching50: Math.min(100, Number((scrollData.reaching50 / totalPageViews) * 100) || 0),
      percentagesReaching75: Math.min(100, Number((scrollData.reaching75 / totalPageViews) * 100) || 0),
      percentagesReaching100: Math.min(100, Number((scrollData.reaching100 / totalPageViews) * 100) || 0)
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
      averageSessionDuration: Number(timeData.averageSessionDuration) || 0,
      averageTimeOnPage: Number(pageTimeData.averageTimeOnPage) || 0,
      totalTimeSpent: Number(timeData.totalTimeSpent) || 0,
      bounceRate: Math.min(100, Number((timeData.bounceCount / totalSessions) * 100) || 0)
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
      totalSessions: Number(sessionData.totalSessions) || 0,
      uniqueVisitors: Number(uniqueVisitors) || 0,
      sessionsPerVisitor: Number(sessionData.totalSessions / uniqueVisitors) || 1,
      returningVisitors: Number(returningData.returningVisitors) || 0
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

    // Requête pour les interactions de formulaire
    const formQuery = `
      SELECT 
        COUNT(*) AS totalFormSubmits,
        COUNT(DISTINCT session_id) AS sessionsWithForms,
        COUNT(DISTINCT element_selector) AS uniqueForms
      FROM analytics_interactions
      WHERE website_id = ? 
        AND interaction_type = 'form_submit'
        ${startDate ? dateFilter : ''}
    `;

    const [formRows] = await pool.query<RowDataPacket[]>(
      formQuery,
      startDate ? [dbWebsiteId, ...dateParams] : [dbWebsiteId]
    );

    // Requête pour les interactions de champs de saisie
    const inputQuery = `
      SELECT 
        COUNT(*) AS totalInputChanges,
        COUNT(DISTINCT session_id) AS sessionsWithInputs,
        COUNT(DISTINCT element_selector) AS uniqueInputs
      FROM analytics_interactions
      WHERE website_id = ? 
        AND interaction_type = 'input_change'
        ${startDate ? dateFilter : ''}
    `;

    const [inputRows] = await pool.query<RowDataPacket[]>(
      inputQuery,
      startDate ? [dbWebsiteId, ...dateParams] : [dbWebsiteId]
    );

    // Requête pour les formulaires les plus utilisés
    const topFormsQuery = `
      SELECT 
        element_selector AS selector,
        COUNT(*) AS count
      FROM analytics_interactions
      WHERE website_id = ? 
        AND interaction_type = 'form_submit'
        AND element_selector IS NOT NULL
        ${startDate ? dateFilter : ''}
      GROUP BY element_selector
      ORDER BY count DESC
      LIMIT 3
    `;

    const [topFormsRows] = await pool.query<RowDataPacket[]>(
      topFormsQuery,
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
    const formData = formRows[0];
    const inputData = inputRows[0];
    const totalClicks = clickData.totalClicks || 0;
    const totalMinutes = timeData.totalTimeSpent / 60 || 1;

    const clickMetrics = {
      clickRate: Math.min(1, Number(clickData.sessionsWithClicks / totalSessions) || 0),
      clicksPerSession: Number(totalClicks / totalSessions) || 0,
      clicksPerMinute: Number(totalClicks / totalMinutes) || 0,
      mostClickedElements: elementRows.map(row => ({
        selector: row.selector,
        count: Number(row.count) || 0
      }))
    };

    // Nouvelles métriques d'engagement pour les formulaires
    const formMetrics = {
      totalFormSubmits: Number(formData.totalFormSubmits) || 0,
      formSubmitRate: Math.min(1, Number(formData.sessionsWithForms / totalSessions) || 0),
      averageFormSubmitsPerSession: Number(formData.totalFormSubmits / totalSessions) || 0,
      uniqueForms: Number(formData.uniqueForms) || 0,
      topForms: topFormsRows.map(row => ({
        selector: row.selector,
        count: Number(row.count) || 0
      }))
    };

    // Nouvelles métriques d'engagement pour les champs de saisie
    const inputMetrics = {
      totalInputChanges: Number(inputData.totalInputChanges) || 0,
      inputChangeRate: Math.min(1, Number(inputData.sessionsWithInputs / totalSessions) || 0),
      averageInputChangesPerSession: Number(inputData.totalInputChanges / totalSessions) || 0,
      uniqueInputs: Number(inputData.uniqueInputs) || 0
    };

    const timeScore = Math.min(100, Number((timeMetrics.averageTimeOnPage / 120) * 100));
    const scrollScore = Math.min(100, Number(scrollMetrics.averageScrollDepth));
    const clickScore = Math.min(100, Number((clickMetrics.clicksPerSession / 3) * 100));
    const bounceScore = Math.max(0, Math.min(100, Number(100 - timeMetrics.bounceRate)));
    const returnScore = Math.min(100, Number((sessionMetrics.returningVisitors / uniqueVisitors) * 200));
    // Nouveau score pour l'engagement avec les formulaires
    const formScore = Math.min(100, Number((formMetrics.formSubmitRate * 100) + (inputMetrics.inputChangeRate * 50)));

    const globalScore = Math.round(
      timeScore * 0.2 +
      scrollScore * 0.2 +
      clickScore * 0.2 +
      bounceScore * 0.15 +
      returnScore * 0.1 +
      formScore * 0.15
    );

    return {
      success: true,
      data: {
        globalScore,
        scrollMetrics,
        timeMetrics,
        sessionMetrics,
        clickMetrics,
        formMetrics,
        inputMetrics
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