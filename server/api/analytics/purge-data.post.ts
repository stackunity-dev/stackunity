import { defineEventHandler, readBody } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';

interface DeletedCounts {
  interactions?: number;
  pageviews?: number;
  sessions?: number;
  errors?: number;
  customEvents?: number;
  visitors?: number;
  geoLocations?: number;
}

export default defineEventHandler(async (event) => {
  try {
    const { websiteId, purgeOption } = await readBody(event);

    if (!websiteId) {
      return {
        success: false,
        message: 'ID du site web requis'
      };
    }

    console.log('Purge demandée pour site:', websiteId);

    const [websiteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, tracking_id FROM analytics_websites WHERE tracking_id = ? OR id = ?',
      [websiteId, websiteId]
    );

    if (Array.isArray(websiteRows) && websiteRows.length === 0) {
      return {
        success: false,
        message: 'Site web non trouvé'
      };
    }

    const site = websiteRows[0];
    const siteId = site.id;

    console.log('Site trouvé, id numérique:', siteId);

    let dateLimit = new Date();
    let deleteAll = false;

    switch (purgeOption) {
      case 'older90':
        dateLimit.setDate(dateLimit.getDate() - 90);
        break;
      case 'older30':
        dateLimit.setDate(dateLimit.getDate() - 30);
        break;
      case 'older7':
        dateLimit.setDate(dateLimit.getDate() - 7);
        break;
      case 'all':
        deleteAll = true;
        break;
      default:
        dateLimit.setDate(dateLimit.getDate() - 30);
    }

    const dateLimitString = dateLimit.toISOString().slice(0, 19).replace('T', ' ');
    const deletedCounts: DeletedCounts = {};
    let totalDeleted = 0;

    if (deleteAll) {
      const [interactionsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_interactions WHERE website_id = ?',
        [siteId]
      );
      deletedCounts.interactions = interactionsResult.affectedRows;
      totalDeleted += interactionsResult.affectedRows;
      console.log('Interactions supprimées:', interactionsResult.affectedRows);
    } else {
      const [interactionsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_interactions WHERE website_id = ? AND timestamp < ?',
        [siteId, dateLimitString]
      );
      deletedCounts.interactions = interactionsResult.affectedRows;
      totalDeleted += interactionsResult.affectedRows;
    }

    if (deleteAll) {
      const [pageviewsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_pageviews WHERE website_id = ?',
        [siteId]
      );
      deletedCounts.pageviews = pageviewsResult.affectedRows;
      totalDeleted += pageviewsResult.affectedRows;
      console.log('Pages vues supprimées:', pageviewsResult.affectedRows);
    } else {
      const [pageviewsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_pageviews WHERE website_id = ? AND enter_time < ?',
        [siteId, dateLimitString]
      );
      deletedCounts.pageviews = pageviewsResult.affectedRows;
      totalDeleted += pageviewsResult.affectedRows;
      console.log('Pages vues supprimées (avec date limite):', pageviewsResult.affectedRows);
    }

    if (deleteAll) {
      const [sessionsResult] = await pool.execute<ResultSetHeader>(
        'DELETE s FROM analytics_sessions s WHERE s.website_id = ?',
        [siteId]
      );
      deletedCounts.sessions = sessionsResult.affectedRows;
      totalDeleted += sessionsResult.affectedRows;
      console.log('Sessions supprimées:', sessionsResult.affectedRows);
    } else {
      const [sessionsResult] = await pool.execute<ResultSetHeader>(
        'DELETE s FROM analytics_sessions s WHERE s.website_id = ? AND s.start_time < ?',
        [siteId, dateLimitString]
      );
      deletedCounts.sessions = sessionsResult.affectedRows;
      totalDeleted += sessionsResult.affectedRows;
      console.log('Sessions supprimées (avec date limite):', sessionsResult.affectedRows);
    }

    if (deleteAll) {
      const [errorsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_errors WHERE website_id = ?',
        [siteId]
      );
      deletedCounts.errors = errorsResult.affectedRows;
      totalDeleted += errorsResult.affectedRows;
    } else {
      const [errorsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_errors WHERE website_id = ? AND timestamp < ?',
        [siteId, dateLimitString]
      );
      deletedCounts.errors = errorsResult.affectedRows;
      totalDeleted += errorsResult.affectedRows;
    }

    if (deleteAll) {
      const [customEventsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_custom_events WHERE website_id = ?',
        [siteId]
      );
      deletedCounts.customEvents = customEventsResult.affectedRows;
      totalDeleted += customEventsResult.affectedRows;
    } else {
      const [customEventsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_custom_events WHERE website_id = ? AND timestamp < ?',
        [siteId, dateLimitString]
      );
      deletedCounts.customEvents = customEventsResult.affectedRows;
      totalDeleted += customEventsResult.affectedRows;
    }

    if (deleteAll) {
      const [visitorsResult] = await pool.execute<ResultSetHeader>(`
        DELETE v FROM analytics_visitors v
        LEFT JOIN analytics_sessions s ON v.visitor_id = s.visitor_id
        WHERE s.visitor_id IS NULL
      `);
      deletedCounts.visitors = visitorsResult.affectedRows;
      totalDeleted += visitorsResult.affectedRows;
    } else {
      const [visitorsResult] = await pool.execute<ResultSetHeader>(`
        DELETE v FROM analytics_visitors v
        LEFT JOIN analytics_sessions s ON v.visitor_id = s.visitor_id AND s.website_id = ?
        WHERE s.visitor_id IS NULL OR s.session_id IS NULL
      `, [siteId]);
      deletedCounts.visitors = visitorsResult.affectedRows;
      totalDeleted += visitorsResult.affectedRows;
    }

    if (deleteAll) {
      const [geoLocationsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_geo_locations WHERE website_id = ?',
        [siteId]
      );
      deletedCounts.geoLocations = geoLocationsResult.affectedRows;
      totalDeleted += geoLocationsResult.affectedRows;
    } else {
      const [geoLocationsResult] = await pool.execute<ResultSetHeader>(
        'DELETE FROM analytics_geo_locations WHERE website_id = ? AND timestamp < ?',
        [siteId, dateLimitString]
      );
      deletedCounts.geoLocations = geoLocationsResult.affectedRows;
      totalDeleted += geoLocationsResult.affectedRows;
    }

    console.log(`Purge de données pour le site ${websiteId} (${purgeOption}):`, deletedCounts);

    return {
      success: true,
      message: `Les données ont été purgées avec succès.`,
      deletedCounts,
      deletedCount: totalDeleted,
      purgeOption
    };
  } catch (error) {
    console.error('Erreur lors de la purge des données:', error);
    return {
      success: false,
      message: `Erreur lors de la purge des données: ${error.message}`,
      error: error.message
    };
  }
}); 