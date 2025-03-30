import { pool } from "../db";

export default defineEventHandler(async (event) => {
  try {
    const [subscribersRows] = await pool.execute('SELECT * FROM newsletters_subscribers');
    const subscribers = (subscribersRows as any[]).map((row: any) => ({
      id: row.id,
      email: row.email,
      date: row.date
    }));


    return {
      subscribers: subscribers,
      total: subscribers.length
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des abonnés:', error);

    return {
      statusCode: 500,
      body: {
        error: 'Erreur lors de la récupération des abonnés',
        message: error.message
      }
    };
  }
}); 