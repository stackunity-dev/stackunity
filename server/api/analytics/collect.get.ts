import { defineEventHandler, getQuery } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    if (query.emergency && query.websiteId) {
      const websiteId = query.websiteId as string;
      const sessionId = query.sessionId as string;
      const visitorId = query.visitorId as string;

      if (query.bounce) {
        const url = query.url as string;
        const duration = parseInt(query.duration as string || '0');

        await pool.query(
          `INSERT INTO analytics_events 
          (website_id, visitor_id, session_id, type, data, created_at) 
          VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            websiteId,
            visitorId,
            sessionId,
            'sessionEnd',
            JSON.stringify({
              isBounce: true,
              exitPage: url,
              duration: duration
            })
          ]
        );
      }

      else if (query.cancelBounce) {
        await pool.query(
          `UPDATE analytics_events 
          SET data = JSON_SET(data, '$.isBounce', false) 
          WHERE website_id = ? AND session_id = ? AND type = 'sessionEnd' 
          AND JSON_EXTRACT(data, '$.isBounce') = true 
          ORDER BY created_at DESC LIMIT 1`,
          [websiteId, sessionId]
        );
      }

      else if (query.unload) {
        await pool.query(
          `INSERT INTO analytics_events 
          (website_id, visitor_id, session_id, type, data, created_at) 
          VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            websiteId,
            visitorId,
            sessionId,
            'pageViewExit',
            JSON.stringify({
              exitTime: new Date().toISOString()
            })
          ]
        );
      }
    }

    return new Response(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('Error in emergency tracking:', error);

    return new Response(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  }
}); 