import { pool } from '../db'

export default defineEventHandler(async (event) => {
  try {
    const token = getRequestHeader(event, 'Authorization')?.replace('Bearer ', '');
    if (!token) {
      return {
        statusCode: 401,
        body: { error: 'Non autorisé' }
      };
    }
    const [statsRows] = await pool.execute('SELECT * FROM newsletters');
    const stats = (statsRows as any[]).map((row: any) => ({
      id: row.id,
      name: row.name,
      emails_sent: row.emails_sent,
      subscribers: row.subscribers,
      content: row.content
    }));

    return {
      stats: stats,
      total: stats.length
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques:', error);

    return {
      stats: [],
      total: 0
    };
  }
});
