import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface PageDistributionRow extends RowDataPacket {
  page: string;
  views: number;
  percentage: number;
  isHome: boolean;
  rawUrl: string;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const period = query.period as string || 'all';
    const limit = parseInt(query.limit as string || '20', 10);

    if (!websiteId) {
      return {
        success: false,
        message: 'Website ID is required'
      };
    }

    let dateCondition = '';

    const now = new Date();
    if (period === '7d') {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      dateCondition = `AND enter_time >= '${sevenDaysAgo.toISOString().slice(0, 19).replace('T', ' ')}'`;
    } else if (period === '30d') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      dateCondition = `AND enter_time >= '${thirtyDaysAgo.toISOString().slice(0, 19).replace('T', ' ')}'`;
    } else if (period === '90d') {
      const ninetyDaysAgo = new Date(now);
      ninetyDaysAgo.setDate(now.getDate() - 90);
      dateCondition = `AND enter_time >= '${ninetyDaysAgo.toISOString().slice(0, 19).replace('T', ' ')}'`;
    }

    const [websiteRows] = await pool.query(
      'SELECT id FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );

    if (!Array.isArray(websiteRows) || websiteRows.length === 0) {
      return {
        success: false,
        message: 'Website not found'
      };
    }

    const dbWebsiteId = (websiteRows as RowDataPacket[])[0].id;

    const [totalViewsRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalViews
       FROM analytics_pageviews
       WHERE website_id = ? ${dateCondition}`,
      [dbWebsiteId]
    );

    const totalViews = totalViewsRows[0].totalViews || 0;

    const [pageDistRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        page_url as page, 
        COUNT(*) as views,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM analytics_pageviews WHERE website_id = ?), 2) as percentage
      FROM analytics_pageviews
      WHERE website_id = ? ${dateCondition}
      GROUP BY page_url
      ORDER BY views DESC
      LIMIT ?`,
      [dbWebsiteId, dbWebsiteId, limit]
    );

    const processedPages = pageDistRows.map(row => {
      let cleanPath = row.page;
      let isHome = false;

      try {
        if (row.page.startsWith('http')) {
          const urlObj = new URL(row.page);
          cleanPath = urlObj.pathname;

          cleanPath = cleanPath.replace(/^\/?(fr|en)\//, '/');

          isHome = cleanPath === '/' || cleanPath === '' || cleanPath === '/index.html';
        } else {
          isHome = row.page === '/' || row.page === '' || row.page === '/index.html';
        }
      } catch (e) {
        console.error('Erreur lors du traitement de l\'URL:', e);
      }

      let percentage;
      try {
        percentage = typeof row.percentage === 'number'
          ? Number(row.percentage.toFixed(2))
          : Number(parseFloat(String(row.percentage)).toFixed(2));

        // Si c'est NaN, utiliser 0
        if (isNaN(percentage)) {
          percentage = 0;
        }
      } catch (e) {
        console.error('Erreur lors du formatage du pourcentage:', e);
        percentage = 0;
      }

      return {
        page: row.page,
        rawUrl: row.page,
        views: row.views,
        percentage,
        cleanPath,
        isHome
      };
    });

    return {
      success: true,
      data: {
        totalViews,
        pages: processedPages
      }
    };
  } catch (error) {
    console.error('Error fetching page distribution:', error);
    return {
      success: false,
      message: 'Error fetching page distribution',
      error: error.message
    };
  }
}); 