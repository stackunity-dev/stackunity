import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../db';

interface WebsiteRow extends RowDataPacket {
  id: number;
  trackingId: string;
  name: string;
  url: string;
}

interface StatsRow extends RowDataPacket {
  totalVisitors?: number;
  totalPageViews?: number;
  avgSessionDuration?: number;
  bounceRate?: number;
  bounceCount?: number;
  totalSessions?: number;
  frustratedSessions?: number;
}

interface PageRow extends RowDataPacket {
  page: string;
  views: number;
  avgTime: string;
}

interface SourceRow extends RowDataPacket {
  source: string;
  visitors: number;
  percentage: number;
}

interface DeviceRow extends RowDataPacket {
  type: string;
  count: number;
  percentage: number;
}

interface BrowserOsRow extends RowDataPacket {
  name: string;
  count: number;
  percentage: number;
  type: string;
}

interface ErrorRow extends RowDataPacket {
  page: string;
  errorMessage: string;
  count: number;
  browserInfo: string;
}

interface InteractionRow extends RowDataPacket {
  id: string;
  pageviewId: string;
  sessionId: string;
  interactionType: string;
  elementSelector: string;
  elementText: string;
  timestamp: string;
  valueData: string;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const period = query.period as string || 'all';

    if (!websiteId) {
      return {
        success: false,
        message: 'Website ID is required'
      };
    }

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

    const [websiteRows] = await pool.query<WebsiteRow[]>(
      'SELECT id, tracking_id AS trackingId, name, url FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );

    if (!Array.isArray(websiteRows) || websiteRows.length === 0) {
      return {
        success: false,
        message: 'Website not found'
      };
    }

    const website = websiteRows[0];
    const dbWebsiteId = website.id;

    const visitorQuery = `
      SELECT COUNT(DISTINCT visitor_id) AS totalVisitors 
      FROM analytics_sessions 
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
    `;

    const [visitorCountRows] = await pool.query<StatsRow[]>(
      visitorQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );
    const totalVisitors = visitorCountRows[0]?.totalVisitors || 0;

    const pageViewQuery = `
      SELECT COUNT(*) AS totalPageViews 
      FROM analytics_pageviews 
      WHERE website_id = ? ${startDate ? 'AND enter_time >= ?' : ''}
    `;

    const [pageViewRows] = await pool.query<StatsRow[]>(
      pageViewQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );
    const totalPageViews = pageViewRows[0]?.totalPageViews || 0;

    const avgSessionQuery = `
      SELECT AVG(duration) AS avgSessionDuration 
      FROM analytics_sessions 
      WHERE website_id = ? AND duration IS NOT NULL ${startDate ? 'AND start_time >= ?' : ''}
    `;

    const [avgSessionRows] = await pool.query<StatsRow[]>(
      avgSessionQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );
    const avgSessionDuration = Math.round(avgSessionRows[0]?.avgSessionDuration || 0);

    const bounceRateQuery = `
      SELECT 
      (SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) / GREATEST(COUNT(*), 1)) * 100 AS bounceRate,
      SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) AS bounceCount,
      COUNT(*) AS totalSessions
      FROM analytics_sessions
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
    `;

    console.log('Requête de rebond:', bounceRateQuery);

    const [bounceRows] = await pool.query<StatsRow[]>(
      bounceRateQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );
    const rawBounceRate = bounceRows[0]?.bounceRate || 0;
    const bounceRate = Math.min(Math.round(rawBounceRate), 100);
    const bounceCount = bounceRows[0]?.bounceCount || 0;
    const totalSessions = bounceRows[0]?.totalSessions || 0;

    const topPagesQuery = `
      SELECT 
        page_url AS page, 
        COUNT(*) AS views,
        CONCAT(FLOOR(AVG(duration) / 60), 'm ', MOD(FLOOR(AVG(duration)), 60), 's') AS avgTime
      FROM analytics_pageviews 
      WHERE website_id = ? AND duration IS NOT NULL ${startDate ? 'AND enter_time >= ?' : ''}
      GROUP BY page_url 
      ORDER BY views DESC 
      LIMIT 10
    `;

    const [topPagesRows] = await pool.query<PageRow[]>(
      topPagesQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );

    // Ajuster la requête des sources de trafic
    let trafficSourcesQuery = `
      SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' THEN 'direct_links'
          WHEN referrer LIKE '%google%' THEN 'organic_search'
          WHEN referrer LIKE '%facebook%' OR referrer LIKE '%twitter%' OR referrer LIKE '%instagram%' OR referrer LIKE '%linkedin%' THEN 'social_media'
          ELSE 'referrers'
        END AS source,
        COUNT(DISTINCT visitor_id) AS visitors,
        ROUND((COUNT(DISTINCT visitor_id) * 100.0) / 
          (SELECT SUM(visitor_count) FROM 
            (SELECT COUNT(DISTINCT visitor_id) AS visitor_count 
             FROM analytics_sessions 
             WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
             GROUP BY 
               CASE 
                 WHEN referrer IS NULL OR referrer = '' THEN 'direct_links'
                 WHEN referrer LIKE '%google%' THEN 'organic_search'
                 WHEN referrer LIKE '%facebook%' OR referrer LIKE '%twitter%' OR referrer LIKE '%instagram%' OR referrer LIKE '%linkedin%' THEN 'social_media'
                 ELSE 'referrers'
               END
            ) AS source_counts)
        ) AS percentage
      FROM analytics_sessions 
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
      GROUP BY source
      ORDER BY visitors DESC
    `;

    let trafficSourcesParams = startDate
      ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' '), dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId, dbWebsiteId];

    const [trafficSourcesRows] = await pool.query<SourceRow[]>(trafficSourcesQuery, trafficSourcesParams);

    // Ajuster la requête des statistiques d'appareils
    let deviceStatsQuery = `
      SELECT 
        device_type AS type,
        COUNT(*) AS count,
        ROUND((COUNT(*) * 100.0) / (
          SELECT SUM(device_count) FROM (
            SELECT COUNT(*) AS device_count 
            FROM analytics_sessions 
            WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
            GROUP BY device_type
          ) AS dev_counts
        ), 2) AS percentage
      FROM analytics_sessions
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
      GROUP BY device_type
      ORDER BY count DESC
    `;

    let deviceStatsParams = startDate
      ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' '), dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId, dbWebsiteId];

    const [deviceStatsRows] = await pool.query<DeviceRow[]>(deviceStatsQuery, deviceStatsParams);

    // Ajuster la requête des navigateurs
    let browsersQuery = `
      SELECT 
        browser AS name,
        COUNT(*) AS count,
        ROUND((COUNT(*) * 100.0) / (
          SELECT SUM(browser_count) FROM (
            SELECT COUNT(*) AS browser_count 
            FROM analytics_sessions 
            WHERE website_id = ? AND browser IS NOT NULL AND browser != '' ${startDate ? 'AND start_time >= ?' : ''}
            GROUP BY browser
          ) AS browser_counts
        ), 2) AS percentage,
        'browser' AS type
      FROM analytics_sessions
      WHERE website_id = ? AND browser IS NOT NULL AND browser != '' ${startDate ? 'AND start_time >= ?' : ''}
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 5
    `;

    let browsersParams = startDate
      ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' '), dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId, dbWebsiteId];

    const [browsersRows] = await pool.query<BrowserOsRow[]>(browsersQuery, browsersParams);

    // Ajuster la requête des systèmes d'exploitation
    let osQuery = `
      SELECT 
        os AS name,
        COUNT(*) AS count,
        ROUND((COUNT(*) * 100.0) / (
          SELECT SUM(os_count) FROM (
            SELECT COUNT(*) AS os_count 
            FROM analytics_sessions 
            WHERE website_id = ? AND os IS NOT NULL AND os != '' ${startDate ? 'AND start_time >= ?' : ''}
            GROUP BY os
          ) AS os_counts
        ), 2) AS percentage,
        'os' AS type
      FROM analytics_sessions
      WHERE website_id = ? AND os IS NOT NULL AND os != '' ${startDate ? 'AND start_time >= ?' : ''}
      GROUP BY os
      ORDER BY count DESC
      LIMIT 5
    `;

    let osParams = startDate
      ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' '), dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId, dbWebsiteId];

    const [osRows] = await pool.query<BrowserOsRow[]>(osQuery, osParams);

    // Ajuster la requête des erreurs
    let errorEventsQuery = `
      SELECT 
        p.page_url AS page,
        e.message AS errorMessage,
        COUNT(*) AS count,
        e.browser_info AS browserInfo
      FROM analytics_errors e
      JOIN analytics_pageviews p ON e.pageview_id = p.pageview_id
      WHERE e.website_id = ? ${startDate ? 'AND e.timestamp >= ?' : ''}
      GROUP BY p.page_url, e.message, e.browser_info
      ORDER BY count DESC
      LIMIT 10
    `;

    let errorEventsParams = startDate
      ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId];

    const [errorEventsRows] = await pool.query<ErrorRow[]>(errorEventsQuery, errorEventsParams);

    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 500;
    const offset = (page - 1) * limit;

    const interactionsQuery = `
      SELECT 
        i.interaction_id AS id,
        i.pageview_id AS pageviewId,
        i.session_id AS sessionId,
        i.interaction_type AS type,
        i.element_selector AS elementSelector,
        i.element_text AS elementText,
        i.timestamp,
        i.value_data AS valueData,
        COALESCE(i.page_url, p.page_url) AS pageUrl
      FROM analytics_interactions i
      LEFT JOIN analytics_pageviews p ON i.pageview_id = p.pageview_id AND p.website_id = i.website_id
      WHERE i.website_id = ? ${dateFilter}
      ORDER BY i.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const getTotalInteractions = async (websiteId, dateFilter) => {
      const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM analytics_interactions WHERE website_id = ? ${dateFilter}`,
        [websiteId, ...(startDate ? [startDate.toISOString().slice(0, 19).replace('T', ' ')] : [])]
      );
      return countRows[0].total;
    };

    const [interactionRows] = await pool.query<InteractionRow[]>(
      interactionsQuery,
      [
        dbWebsiteId,
        ...(startDate ? [startDate.toISOString().slice(0, 19).replace('T', ' ')] : []),
        limit,
        offset
      ]
    );

    const totalInteractions = await getTotalInteractions(dbWebsiteId, dateFilter);

    const userInteractions = interactionRows.map(row => {
      let valueObj = {};
      try {
        if (row.valueData && typeof row.valueData === 'string') {
          if (row.valueData.trim().startsWith('{') || row.valueData.trim().startsWith('[')) {
            valueObj = JSON.parse(row.valueData);
          } else if (row.valueData === '[object Object]') {
            valueObj = {};
          } else {
            valueObj = { value: row.valueData };
          }
        } else if (typeof row.valueData === 'object' && row.valueData !== null) {
          valueObj = row.valueData;
        }
      } catch (e) {
        console.error('Error parsing interaction value data:', row.valueData, e);
      }

      return {
        id: row.id,
        pageviewId: row.pageviewId,
        sessionId: row.sessionId,
        type: row.type,
        elementSelector: row.elementSelector || '',
        elementText: row.elementText || '',
        timestamp: row.timestamp,
        value: valueObj,
        pageUrl: row.pageUrl || 'URL inconnue'
      };
    });

    let frustratedSessionsQuery = `
      SELECT COUNT(DISTINCT s.session_id) AS frustratedSessions
      FROM analytics_sessions s
      LEFT JOIN analytics_errors e ON s.session_id = e.session_id
      WHERE s.website_id = ? ${startDate ? 'AND s.start_time >= ?' : ''} 
      AND (e.error_id IS NOT NULL OR s.duration < 10)
    `;

    let frustratedSessionsParams = startDate
      ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId];

    const [frustratedSessionsRows] = await pool.query<StatsRow[]>(
      frustratedSessionsQuery,
      frustratedSessionsParams
    );
    const frustratedSessions = frustratedSessionsRows[0]?.frustratedSessions || 0;

    return {
      success: true,
      data: {
        websiteId: website.trackingId,
        name: website.name,
        url: website.url,
        totalVisitors,
        totalPageViews,
        avgSessionDuration,
        bounceRate,
        bounceCount,
        totalSessions,
        frustratedSessions,
        timeOnSite: `${Math.floor(avgSessionDuration / 60)}m ${avgSessionDuration % 60}s`,
        topPages: topPagesRows,
        trafficSources: trafficSourcesRows,
        devices: deviceStatsRows,
        browsers: browsersRows,
        os: osRows,
        errorEvents: errorEventsRows,
        userInteractions: userInteractions,
        period: period,
        interactions: {
          data: userInteractions,
          total: totalInteractions,
          limit: limit,
          page: page,
          hasMore: userInteractions.length === limit
        }
      }
    };
  } catch (error) {
    console.error('Error fetching website analytics:', error);
    return {
      success: false,
      message: 'Error fetching website analytics',
      error: error.message
    };
  }
});