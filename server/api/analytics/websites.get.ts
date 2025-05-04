import { defineEventHandler } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        id, 
        tracking_id AS trackingId, 
        name, 
        url, 
        created_at AS createdAt 
       FROM analytics_websites 
       ORDER BY created_at DESC`
    );

    return {
      success: true,
      websites: rows
    };
  } catch (error) {
    console.error('Error fetching websites:', error);
    return {
      success: false,
      message: 'Error fetching websites',
      error: error.message
    };
  }
}); 