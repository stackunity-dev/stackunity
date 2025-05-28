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
  views_with_duration?: number;
  raw_avg_time?: number;
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

    const avgPageDurationQuery = `
      SELECT 
        AVG(CASE WHEN duration IS NOT NULL AND duration > 0 THEN duration ELSE NULL END) AS avgPageDuration,
        COUNT(*) AS totalPageViews,
        COUNT(CASE WHEN duration IS NOT NULL AND duration > 0 THEN 1 ELSE NULL END) AS pageViewsWithDuration
      FROM analytics_pageviews 
      WHERE website_id = ? ${startDate ? 'AND enter_time >= ?' : ''}
    `;

    const [avgPageDurationRows] = await pool.query<StatsRow[]>(
      avgPageDurationQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );

    const avgPageDuration = Math.round(avgPageDurationRows[0]?.avgPageDuration || 0);
    const pageViewsWithDuration = avgPageDurationRows[0]?.pageViewsWithDuration || 0;
    const totalPageViewsFromDuration = avgPageDurationRows[0]?.totalPageViews || 0;
    const durationDataQuality = totalPageViewsFromDuration > 0
      ? Math.min(100, Math.round(pageViewsWithDuration * 100 / totalPageViewsFromDuration))
      : 0;

    const bounceRateQuery = `
      SELECT 
      (SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) / GREATEST(COUNT(*), 1)) * 100 AS bounceRate,
      SUM(CASE WHEN is_bounce = 1 THEN 1 ELSE 0 END) AS bounceCount,
      COUNT(*) AS totalSessions
      FROM analytics_sessions
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
    `;


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
        COALESCE(page_url, 'Unknown page') AS page, 
        COUNT(*) AS views,
        CASE 
          WHEN AVG(CASE WHEN duration IS NOT NULL AND duration > 0 THEN duration ELSE NULL END) IS NULL THEN '0m 0s'
          ELSE CONCAT(
            FLOOR(AVG(CASE WHEN duration IS NOT NULL AND duration > 0 THEN duration ELSE NULL END) / 60), 
            'm ', 
            MOD(FLOOR(AVG(CASE WHEN duration IS NOT NULL AND duration > 0 THEN duration ELSE NULL END)), 60), 
            's'
          )
        END AS avgTime,
        COUNT(CASE WHEN duration IS NOT NULL AND duration > 0 THEN 1 ELSE NULL END) AS views_with_duration,
        COALESCE(AVG(CASE WHEN duration IS NOT NULL AND duration > 0 THEN duration ELSE NULL END), 0) AS raw_avg_time
      FROM analytics_pageviews 
      WHERE website_id = ? ${startDate ? 'AND enter_time >= ?' : ''}
      GROUP BY page_url 
      HAVING COUNT(*) > 0
      ORDER BY views DESC 
      LIMIT 10
    `;


    const [topPagesRows] = await pool.query<PageRow[]>(
      topPagesQuery,
      startDate ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')] : [dbWebsiteId]
    );



    const normalizeUrl = (url: string) => {
      if (!url) return url;
      try {
        let pathname = url;
        if (url.startsWith('http')) {
          const urlObj = new URL(url);
          pathname = urlObj.pathname;
        }
        return pathname.replace(/^\/(fr|en)(\/|$)/, '$2');
      } catch (e) {
        console.error('Erreur de normalisation URL:', e);
        return url;
      }
    };

    let trafficSourcesQuery = `
      SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' THEN 'direct_links'
          WHEN referrer LIKE '%google%' THEN 'organic_search'
          WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.com%' THEN 'social_media_facebook'
          WHEN referrer LIKE '%twitter%' OR referrer LIKE '%t.co%' THEN 'social_media_twitter'
          WHEN referrer LIKE '%instagram%' THEN 'social_media_instagram'
          WHEN referrer LIKE '%linkedin%' OR referrer LIKE '%lnkd.in%' OR referrer LIKE '%licdn.com%' THEN 'social_media_linkedin'
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
                 WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.com%' THEN 'social_media_facebook'
                 WHEN referrer LIKE '%twitter%' OR referrer LIKE '%t.co%' THEN 'social_media_twitter'
                 WHEN referrer LIKE '%instagram%' THEN 'social_media_instagram'
                 WHEN referrer LIKE '%linkedin%' OR referrer LIKE '%lnkd.in%' OR referrer LIKE '%licdn.com%' THEN 'social_media_linkedin'
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

    let browserStatsQuery = `
      SELECT 
        CASE 
          WHEN browser LIKE 'Chrome %' THEN 'Chrome'
          WHEN browser LIKE 'Firefox %' THEN 'Firefox'
          WHEN browser LIKE 'Safari %' THEN 'Safari'
          WHEN browser LIKE 'Edge %' THEN 'Edge'
          WHEN browser LIKE 'Opera %' THEN 'Opera'
          WHEN browser LIKE 'Internet Explorer %' THEN 'Internet Explorer'
          WHEN browser IS NULL OR browser = '' THEN 'Unknown'
          ELSE SUBSTRING_INDEX(browser, ' ', 1)
        END AS name,
        COUNT(*) AS count,
        ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM analytics_sessions WHERE website_id = ?)) AS percentage,
        'browser' AS type
      FROM analytics_sessions 
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
      GROUP BY name
      ORDER BY count DESC
    `;

    let browserStatsParams = startDate
      ? [dbWebsiteId, dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId, dbWebsiteId];

    const [browserRows] = await pool.query<BrowserOsRow[]>(browserStatsQuery, browserStatsParams);

    let osStatsQuery = `
      SELECT 
        CASE 
          WHEN os LIKE 'Windows %' THEN 'Windows'
          WHEN os LIKE 'Android %' THEN 'Android'
          WHEN os LIKE 'iOS %' THEN 'iOS'
          WHEN os LIKE 'iPadOS %' THEN 'iPadOS'
          WHEN os LIKE 'macOS %' THEN 'macOS'
          WHEN os IS NULL OR os = '' THEN 'Unknown'
          ELSE SUBSTRING_INDEX(os, ' ', 1)
        END AS name,
        COUNT(*) AS count,
        ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM analytics_sessions WHERE website_id = ?)) AS percentage,
        'os' AS type
      FROM analytics_sessions 
      WHERE website_id = ? ${startDate ? 'AND start_time >= ?' : ''}
      GROUP BY name
      ORDER BY count DESC
    `;

    let osStatsParams = startDate
      ? [dbWebsiteId, dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId, dbWebsiteId];

    const [osRows] = await pool.query<BrowserOsRow[]>(osStatsQuery, osStatsParams);

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

    const detailedReferrersQuery = `
      SELECT 
        CASE
          WHEN referrer_source = 'linkedin' THEN 'social_media_linkedin'
          WHEN referrer_source = 'facebook' THEN 'social_media_facebook'
          WHEN referrer_source = 'twitter' THEN 'social_media_twitter'
          WHEN referrer_source = 'instagram' THEN 'social_media_instagram'
          WHEN referrer_source = 'google' THEN 'organic_search'
          WHEN referrer_source = 'direct' THEN 'direct_links'
          ELSE 'referrers'
        END AS source,
        referrer_name AS name,
        referrer AS url,
        COUNT(*) AS visits,
        MAX(enter_time) AS lastVisit
      FROM analytics_pageviews
      WHERE website_id = ? 
        AND referrer IS NOT NULL 
        AND referrer != '' 
        ${startDate ? 'AND enter_time >= ?' : ''}
      GROUP BY source, name, url
      ORDER BY visits DESC, lastVisit DESC
      LIMIT 100
    `;

    const detailedReferrersParams = startDate
      ? [dbWebsiteId, startDate.toISOString().slice(0, 19).replace('T', ' ')]
      : [dbWebsiteId];

    const [detailedReferrersRows] = await pool.query(
      detailedReferrersQuery,
      detailedReferrersParams
    );

    const detailedReferrers = Array.isArray(detailedReferrersRows) ? detailedReferrersRows.map(row => ({
      source: row.source || 'referrers',
      name: row.name || 'Référent inconnu',
      url: row.url || '',
      visits: row.visits || 0,
      lastVisit: row.lastVisit || new Date().toISOString()
    })) : [];

    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 500;
    const offset = (page - 1) * limit;

    const excludedInteractionTypes = ['page_viewexit', 'pageViewExit', 'visibility_snapshot', 'segment_visibility', 'page_duration', 'pageVisitDuration', 'page_exit'];

    const excludedTypesSQL = excludedInteractionTypes.map(() => '?').join(',');

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
        AND i.interaction_type NOT IN (${excludedTypesSQL})
      ORDER BY i.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const getTotalInteractions = async (websiteId, dateFilter) => {
      const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM analytics_interactions 
         WHERE website_id = ? ${dateFilter}
         AND interaction_type NOT IN (${excludedTypesSQL})`,
        [websiteId, ...excludedInteractionTypes, ...(startDate ? [startDate.toISOString().slice(0, 19).replace('T', ' ')] : [])]
      );
      return countRows[0].total;
    };

    const [interactionRows] = await pool.query<InteractionRow[]>(
      interactionsQuery,
      [
        dbWebsiteId,
        ...excludedInteractionTypes,
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

    const cleanUrl = (url) => {
      if (!url || url === 'Unknown page') return url;

      try {
        if (url.startsWith('http')) {
          const urlObj = new URL(url);
          return urlObj.pathname || '/';
        }

        return url;
      } catch (e) {
        console.error('Erreur lors du nettoyage d\'URL:', e);
        return url;
      }
    };

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
        avgPageDuration: avgPageDuration,
        avgPageTime: `${Math.floor(avgPageDuration / 60)}m ${avgPageDuration % 60}s`,
        pageViewsWithDuration: pageViewsWithDuration,
        durationDataQuality: durationDataQuality,
        topPages: topPagesRows.map(page => {
          let pageUrl = page.page || 'Unknown page';
          let cleanPageUrl = cleanUrl(pageUrl);

          cleanPageUrl = normalizeUrl(cleanPageUrl);

          const isHomePage = cleanPageUrl === '/' || cleanPageUrl === '';

          const avgTimeSec = page.raw_avg_time || 0;
          const hasValidTime = avgTimeSec > 0;
          const viewsWithDuration = page.views_with_duration || 0;
          const durationDataQuality = viewsWithDuration > 0 ? Math.min(100, Math.round(viewsWithDuration * 100 / page.views)) : 0;

          return {
            page: pageUrl,
            cleanPath: cleanPageUrl,
            isHome: isHomePage,
            views: page.views || 0,
            viewsWithDuration: viewsWithDuration,
            durationDataQuality: durationDataQuality,
            avgTime: '0m 0s',
            avgTimeSeconds: Math.round(avgTimeSec || 0),
            hasDuration: hasValidTime
          };
        }),
        trafficSources: trafficSourcesRows.map(source => ({
          source: source.source || 'unknown',
          visitors: source.visitors || 0,
          percentage: source.percentage || 0
        })),
        devices: deviceStatsRows.map(device => ({
          type: device.type || 'unknown',
          count: device.count || 0,
          percentage: device.percentage || 0
        })),
        browsers: browserRows.map(browser => ({
          name: browser.name || 'Unknown',
          count: browser.count || 0,
          percentage: browser.percentage || 0,
          type: browser.type || 'browser'
        })),
        os: osRows.map(os => ({
          name: os.name || 'Unknown',
          count: os.count || 0,
          percentage: os.percentage || 0,
          type: os.type || 'os'
        })),
        errorEvents: errorEventsRows.map(error => ({
          page: error.page || 'Unknown page',
          errorMessage: error.errorMessage || 'Unknown error',
          count: error.count || 0,
          browserInfo: error.browserInfo || 'Unknown browser'
        })),
        userInteractions: userInteractions,
        period: period,
        interactions: {
          data: userInteractions,
          total: totalInteractions,
          limit: limit,
          page: page,
          hasMore: userInteractions.length === limit
        },
        detailedReferrers
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