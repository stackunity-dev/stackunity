import { defineEventHandler, readBody } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';

interface RegisterWebsiteRequest {
  name: string;
  url: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { name, url } = await readBody<RegisterWebsiteRequest>(event);

    if (!name || !url) {
      return {
        success: false,
        message: 'Name and URL are required'
      };
    }

    const trackingId = uuidv4();

    const [result] = await pool.query(
      'INSERT INTO analytics_websites (tracking_id, name, url) VALUES (?, ?, ?)',
      [trackingId, name, url]
    );

    return {
      success: true,
      websiteId: trackingId,
      message: 'Website registered successfully'
    };
  } catch (error) {
    console.error('Error registering website:', error);
    return {
      success: false,
      message: 'Error registering website',
      error: error.message
    };
  }
}); 