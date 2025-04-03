import { defineEventHandler, readBody } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('body', body);

  try {
    if (!body.userId || !body.database_name || !body.tables) {
      throw new Error('Données manquantes : userId, database_name et tables sont requis');
    }

    const schemaData = {
      database_name: body.database_name,
      tables: body.tables
    };

    const result = await pool.execute(
      'INSERT INTO sql_schemas (user_id, database_name, schema_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE schema_data = ?, updated_at = NOW()',
      [body.userId, body.database_name, JSON.stringify(schemaData), JSON.stringify(schemaData)]
    );

    // @ts-ignore
    const insertId = result[0].insertId || result[0].affectedRows;

    return {
      success: true,
      id: insertId
    };
  }
  catch (err: any) {
    console.error('Erreur lors de la sauvegarde du schéma SQL:', err);
    return {
      success: false,
      error: err.message,
    };
  }
});
