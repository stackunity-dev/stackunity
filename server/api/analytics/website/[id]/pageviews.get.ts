import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface PageviewRow extends RowDataPacket {
  pageview_id: string;
  page_url: string;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const pageviewIds = (query.ids as string || '').split(',').filter(id => id);

    if (!websiteId) {
      return {
        success: false,
        message: 'Website ID is required'
      };
    }

    if (!pageviewIds.length) {
      return {
        success: true,
        data: []
      };
    }


    // Utiliser des chunks pour éviter les limites de la base de données
    const chunkSize = 500;
    let allResults: PageviewRow[] = [];

    for (let i = 0; i < pageviewIds.length; i += chunkSize) {
      const chunk = pageviewIds.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '?').join(',');


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

      const [pageviewRows] = await pool.query<PageviewRow[]>(
        `SELECT 
          pageview_id, 
          page_url 
        FROM analytics_pageviews 
        WHERE website_id = ? AND pageview_id IN (${placeholders})`,
        [dbWebsiteId, ...chunk]
      );


      allResults = [...allResults, ...(pageviewRows as PageviewRow[])];
    }

    console.log(`Total URLs found: ${allResults.length}`);
    console.log(`Missing URLs: ${pageviewIds.length - allResults.length}`);

    return {
      success: true,
      data: allResults,
      stats: {
        requested: pageviewIds.length,
        found: allResults.length,
        missing: pageviewIds.length - allResults.length
      }
    };
  } catch (error) {
    console.error('Error fetching pageviews:', error);
    return {
      success: false,
      message: 'Error fetching pageviews',
      error: error.message
    };
  }
}); 