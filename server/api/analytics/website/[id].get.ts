import { defineEventHandler, getRouterParam } from 'h3';
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

interface ErrorRow extends RowDataPacket {
  page: string;
  errorMessage: string;
  count: number;
  browserInfo: string;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');

    if (!websiteId) {
      return {
        success: false,
        message: 'Website ID is required'
      };
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

    const [bounceRateRows] = await pool.query<StatsRow[]>(
      `SELECT 
         (SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS bounceRate
       FROM analytics_sessions 
       WHERE website_id = ?`,
      [dbWebsiteId]
    );
    const bounceRate = Math.round(bounceRateRows[0]?.bounceRate || 0);

    const [topPagesRows] = await pool.query<PageRow[]>(
      `SELECT 
         page_url AS page, 
         COUNT(*) AS views,
         CONCAT(FLOOR(AVG(duration) / 60), 'm ', MOD(FLOOR(AVG(duration)), 60), 's') AS avgTime
       FROM analytics_pageviews 
       WHERE website_id = ? AND duration IS NOT NULL
       GROUP BY page_url 
       ORDER BY views DESC 
       LIMIT 10`,
      [dbWebsiteId]
    );

    const [trafficSourcesRows] = await pool.query<SourceRow[]>(
      `SELECT 
         CASE 
           WHEN referrer IS NULL OR referrer = '' THEN 'Liens directs'
           WHEN referrer LIKE '%google%' THEN 'Recherche organique'
           WHEN referrer LIKE '%facebook%' OR referrer LIKE '%twitter%' OR referrer LIKE '%instagram%' OR referrer LIKE '%linkedin%' THEN 'Réseaux sociaux'
           ELSE 'Référents'
         END AS source,
         COUNT(DISTINCT visitor_id) AS visitors,
         (COUNT(DISTINCT visitor_id) / ?) * 100 AS percentage
       FROM analytics_sessions
       WHERE website_id = ?
       GROUP BY source
       ORDER BY visitors DESC`,
      [totalVisitors > 0 ? totalVisitors : 1, dbWebsiteId]
    );

    const [deviceStatsRows] = await pool.query<DeviceRow[]>(
      `SELECT 
         device_type AS type,
         COUNT(*) AS count,
         (COUNT(*) / ?) * 100 AS percentage
       FROM analytics_sessions
       WHERE website_id = ?
       GROUP BY device_type
       ORDER BY count DESC`,
      [totalVisitors > 0 ? totalVisitors : 1, dbWebsiteId]
    );

    const [errorEventsRows] = await pool.query<ErrorRow[]>(
      `SELECT 
         p.page_url AS page,
         e.message AS errorMessage,
         COUNT(*) AS count,
         e.browser_info AS browserInfo
       FROM analytics_errors e
       JOIN analytics_pageviews p ON e.pageview_id = p.pageview_id
       WHERE e.website_id = ?
       GROUP BY p.page_url, e.message, e.browser_info
       ORDER BY count DESC
       LIMIT 10`,
      [dbWebsiteId]
    );

    const [frustratedSessionsRows] = await pool.query<StatsRow[]>(
      `SELECT COUNT(DISTINCT s.session_id) AS frustratedSessions
       FROM analytics_sessions s
       LEFT JOIN analytics_errors e ON s.session_id = e.session_id
       WHERE s.website_id = ? AND (e.error_id IS NOT NULL OR s.duration < 10)`,
      [dbWebsiteId]
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
        frustratedSessions,
        timeOnSite: `${Math.floor(avgSessionDuration / 60)}m ${avgSessionDuration % 60}s`,
        topPages: topPagesRows,
        trafficSources: trafficSourcesRows,
        devices: deviceStatsRows,
        errorEvents: errorEventsRows
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