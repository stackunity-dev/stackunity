import { defineEventHandler, readBody } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const { websiteId, sessionId, visitorId, events } = data;

    if (!websiteId || !sessionId || !visitorId || !events || !Array.isArray(events)) {
      return {
        success: false,
        message: 'Invalid data format'
      };
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

    const dbWebsiteId = (websiteRows as any)[0]?.id;

    const sessionData = events.find(event => event.type === 'session');
    if (sessionData) {
      await pool.query(
        `INSERT INTO analytics_sessions 
          (session_id, website_id, visitor_id, start_time, device_type, browser, os, referrer, landing_page) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
          last_activity = NOW()`,
        [
          sessionId,
          dbWebsiteId,
          visitorId,
          new Date(sessionData.startTime),
          sessionData.deviceType,
          sessionData.browser,
          sessionData.os,
          sessionData.referrer || null,
          sessionData.landingPage
        ]
      );
    }

    for (const event of events) {
      switch (event.type) {
        case 'pageView':
          await pool.query(
            `INSERT INTO analytics_pageviews 
              (pageview_id, session_id, website_id, page_url, page_title, enter_time, utm_source, utm_medium, utm_campaign, referrer) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              event.id,
              sessionId,
              dbWebsiteId,
              event.pageUrl,
              event.title,
              new Date(event.enterTime),
              event.utm_source || null,
              event.utm_medium || null,
              event.utm_campaign || null,
              event.referrer || null
            ]
          );
          break;

        case 'pageViewExit':
          await pool.query(
            `UPDATE analytics_pageviews 
             SET exit_time = ?, duration = ?, scroll_depth = ? 
             WHERE pageview_id = ?`,
            [
              new Date(event.exitTime),
              event.duration,
              event.scrollDepth,
              event.pageViewId
            ]
          );
          break;

        case 'interaction':
          await pool.query(
            `INSERT INTO analytics_interactions
              (interaction_id, pageview_id, website_id, session_id, interaction_type, element_selector, timestamp, element_text, value_data)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              event.id,
              event.pageViewId,
              dbWebsiteId,
              sessionId,
              event.interactionType,
              event.elementSelector,
              new Date(event.timestamp),
              event.elementText || null,
              JSON.stringify(event.value || {})
            ]
          );
          break;

        case 'error':
          await pool.query(
            `INSERT INTO analytics_errors
              (error_id, pageview_id, website_id, session_id, message, stack_trace, timestamp, browser_info)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              event.id,
              event.pageViewId,
              dbWebsiteId,
              sessionId,
              event.message,
              event.stackTrace || null,
              new Date(event.timestamp),
              event.browserInfo
            ]
          );
          break;

        case 'customEvent':
          await pool.query(
            `INSERT INTO analytics_custom_events
              (event_id, pageview_id, website_id, session_id, event_name, event_category, timestamp, properties)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              event.id,
              event.pageViewId,
              dbWebsiteId,
              sessionId,
              event.name,
              event.category,
              new Date(event.timestamp),
              JSON.stringify(event.properties || {})
            ]
          );
          break;

        case 'sessionEnd':
          await pool.query(
            `UPDATE analytics_sessions
             SET end_time = ?, duration = ?, is_bounce = ?, is_complete = ?, exit_page = ?
             WHERE session_id = ?`,
            [
              new Date(event.endTime),
              event.duration,
              event.isBounce ? 1 : 0,
              event.isComplete ? 1 : 0,
              event.exitPage,
              sessionId
            ]
          );
          break;
      }
    }

    await pool.query(
      `INSERT INTO analytics_visitors (visitor_id, last_activity)
       VALUES (?, NOW())
       ON DUPLICATE KEY UPDATE last_activity = NOW()`,
      [visitorId]
    );

    return {
      success: true,
      message: 'Data saved successfully'
    };
  } catch (error) {
    console.error('Error saving analytics data:', error);
    return {
      success: false,
      message: 'Error saving data',
      error: error.message
    };
  }
}); 