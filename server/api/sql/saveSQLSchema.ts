import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.user.id;

  try {
    const result = await pool.execute(
      'INSERT INTO sql_schemas (user_id, database_name, schema_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE schema_data = ?, updated_at = NOW()',
      [userId, body.databaseName, JSON.stringify(body), JSON.stringify(body)]
    );

    // @ts-ignore
    const insertId = result[0].insertId || result[0].affectedRows;

    return {
      success: true,
      id: insertId
    };
  }
  catch (err: any) {
    console.error('Erreur lors de la sauvegarde du schéma SQL:', err.stack);
    return {
      success: false,
      error: err.message,
    };
  }
});
