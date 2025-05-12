import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface EngagementData {
  pageUrl: string;
  sessionCount: number;
  avgSessionDuration: number;
  overallScore: number;
  metrics: {
    interactionRate: number;
    scrollDepth: number;
    timeOnPage: number;
    returnRate: number;
  };
  factors: {
    interactionsPerMinute: number;
    scrollPercentage: number;
    averageTimeSpent: number;
    bounceRate: number;
    clickThroughRate: number;
    formCompletionRate: number;
    readingTime: number;
  };
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const period = query.period || 'all';
    const limit = parseInt(query.limit as string) || 10;

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

    let timeConstraint = '';
    const now = new Date();
    if (period === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeConstraint = `AND s.enter_time >= '${sevenDaysAgo.toISOString()}'`;
    } else if (period === '30d') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeConstraint = `AND s.enter_time >= '${thirtyDaysAgo.toISOString()}'`;
    } else if (period === '90d') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      timeConstraint = `AND s.enter_time >= '${ninetyDaysAgo.toISOString()}'`;
    }

    const [topPagesRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        p.page_url AS pageUrl,
        COUNT(DISTINCT s.session_id) AS sessionCount
      FROM analytics_pageviews p
      JOIN analytics_sessions s ON p.session_id = s.session_id
      WHERE p.website_id = ? ${timeConstraint}
      GROUP BY p.page_url
      ORDER BY sessionCount DESC
      LIMIT ?`,
      [dbWebsiteId, limit]
    );

    if (!Array.isArray(topPagesRows) || topPagesRows.length === 0) {
      return {
        success: true,
        data: []
      };
    }

    const engagementData: EngagementData[] = await Promise.all(
      topPagesRows.map(async (page) => {
        const [durationRows] = await pool.query<RowDataPacket[]>(
          `SELECT AVG(duration) AS avgDuration
          FROM analytics_pageviews
          WHERE website_id = ? AND page_url = ? AND duration IS NOT NULL ${timeConstraint.replace('s.', '')}`,
          [dbWebsiteId, page.pageUrl]
        );
        const avgSessionDuration = Math.round(durationRows[0]?.avgDuration || 0);

        const [interactionsRows] = await pool.query<RowDataPacket[]>(
          `SELECT 
            COUNT(*) AS totalInteractions,
            COUNT(DISTINCT session_id) AS sessionsWithInteractions
          FROM analytics_interactions
          WHERE website_id = ? AND page_url = ? ${timeConstraint.replace('s.', '')}`,
          [dbWebsiteId, page.pageUrl]
        );

        const totalInteractions = interactionsRows[0]?.totalInteractions || 0;
        const sessionsWithInteractions = interactionsRows[0]?.sessionsWithInteractions || 0;

        const interactionRate = page.sessionCount > 0
          ? Math.min(100, Math.round((sessionsWithInteractions / page.sessionCount) * 100))
          : 0;

        const interactionsPerMinute = avgSessionDuration > 0
          ? Math.round((totalInteractions / (avgSessionDuration / 60)) * 10) / 10
          : 0;

        const [scrollRows] = await pool.query<RowDataPacket[]>(
          `SELECT 
            AVG(CASE WHEN interaction_type = 'scroll_depth' THEN CAST(value_data AS DECIMAL(10,2)) ELSE NULL END) AS avgScrollDepth
          FROM analytics_interactions
          WHERE website_id = ? AND page_url = ? AND interaction_type = 'scroll_depth' ${timeConstraint.replace('s.', '')}`,
          [dbWebsiteId, page.pageUrl]
        );

        const scrollDepth = Math.min(100, Math.round(scrollRows[0]?.avgScrollDepth || 0));

        // Récupérer le taux de rebond
        const [bounceRows] = await pool.query<RowDataPacket[]>(
          `SELECT 
            SUM(CASE WHEN page_count = 1 THEN 1 ELSE 0 END) AS bounces,
            COUNT(*) AS totalSessions
          FROM (
            SELECT s.session_id, COUNT(p.pageview_id) AS page_count
            FROM analytics_sessions s
            LEFT JOIN analytics_pageviews p ON s.session_id = p.session_id
            WHERE s.website_id = ? AND s.session_id IN (
              SELECT session_id FROM analytics_pageviews 
              WHERE website_id = ? AND page_url = ? ${timeConstraint.replace('s.', '')}
            )
            GROUP BY s.session_id
          ) AS session_counts`,
          [dbWebsiteId, dbWebsiteId, page.pageUrl]
        );

        const bounceRate = bounceRows[0]?.totalSessions > 0
          ? Math.round((bounceRows[0].bounces / bounceRows[0].totalSessions) * 100)
          : 0;

        // Calculer le taux de clics (estimation basée su r les interactions de type clic)
        const [clickRows] = await pool.query<RowDataPacket[]>(
          `SELECT 
            COUNT(*) AS totalClicks,
            COUNT(DISTINCT session_id) AS sessionsWithClicks
          FROM analytics_interactions
          WHERE website_id = ? AND page_url = ? AND interaction_type IN ('click', 'button_click', 'link_click') ${timeConstraint.replace('s.', '')}`,
          [dbWebsiteId, page.pageUrl]
        );

        const clickThroughRate = page.sessionCount > 0
          ? Math.round((clickRows[0]?.sessionsWithClicks || 0) / page.sessionCount * 100)
          : 0;

        const [formRows] = await pool.query<RowDataPacket[]>(
          `SELECT 
            COUNT(*) AS totalFormSubmits,
            COUNT(DISTINCT session_id) AS sessionsWithForms
          FROM analytics_interactions
          WHERE website_id = ? AND page_url = ? AND interaction_type IN ('form_submit', 'submit') ${timeConstraint.replace('s.', '')}`,
          [dbWebsiteId, page.pageUrl]
        );

        const formCompletionRate = page.sessionCount > 0
          ? Math.round((formRows[0]?.sessionsWithForms || 0) / page.sessionCount * 100)
          : 0;

        const [returnRows] = await pool.query<RowDataPacket[]>(
          `SELECT 
            COUNT(DISTINCT session_id) AS uniqueSessions,
            COUNT(*) AS totalPageViews
          FROM analytics_pageviews
          WHERE website_id = ? AND page_url = ? ${timeConstraint.replace('s.', '')}`,
          [dbWebsiteId, page.pageUrl]
        );

        // Si le ratio pageViews/sessions est élevé, cela indique des retours sur la page
        const returnRate = returnRows[0]?.uniqueSessions > 0
          ? Math.min(100, Math.round((returnRows[0].totalPageViews / returnRows[0].uniqueSessions - 1) * 50))
          : 0;

        const readingTime = Math.min(100, Math.round(avgSessionDuration / 5));

        const weights = {
          interactionRate: 0.3,
          scrollDepth: 0.2,
          timeOnPage: 0.25,
          returnRate: 0.25
        };

        const timeOnPage = Math.min(100, Math.round(avgSessionDuration / 120 * 100));

        const overallScore = Math.round(
          interactionRate * weights.interactionRate +
          scrollDepth * weights.scrollDepth +
          timeOnPage * weights.timeOnPage +
          returnRate * weights.returnRate
        );

        return {
          pageUrl: page.pageUrl,
          sessionCount: page.sessionCount,
          avgSessionDuration,
          overallScore,
          metrics: {
            interactionRate,
            scrollDepth,
            timeOnPage,
            returnRate
          },
          factors: {
            interactionsPerMinute,
            scrollPercentage: scrollDepth,
            averageTimeSpent: avgSessionDuration,
            bounceRate,
            clickThroughRate,
            formCompletionRate,
            readingTime
          }
        };
      })
    );

    return {
      success: true,
      data: engagementData
    };

  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'engagement:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des données d\'engagement'
    };
  }
}); 