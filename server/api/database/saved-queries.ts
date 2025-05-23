// @ts-ignore
import { createError, defineEventHandler, getQuery, readBody } from 'h3';
import { getUserId } from '../../utils/auth-utils';
import { pool } from '../db';

export default defineEventHandler(async (event) => {

  const method = event.method;
  const userId = getUserId(event);

  if (method === 'GET') {
    try {
      const [queries] = await pool.query(
        'SELECT * FROM saved_queries WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return { success: true, queries };
    } catch (error) {
      console.error('Error fetching saved queries:', error);
      throw createError({
        statusCode: 500,
        message: 'Erreur lors de la récupération des requêtes sauvegardées'
      });
    }
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const { name, query, description, connectionId } = body;

    if (!name || !query) {
      throw createError({
        statusCode: 400,
        message: 'Le nom et la requête sont requis'
      });
    }

    try {
      const uuid = crypto.randomUUID();
      const [result] = await pool.query(
        'INSERT INTO saved_queries (id, user_id, connection_id, name, description, query_text) VALUES (?, ?, ?, ?, ?, ?)',
        [uuid, userId, connectionId, name, description, query]
      );

      const [newQuery] = await pool.query(
        'SELECT * FROM saved_queries WHERE id = ?',
        [uuid]
      );

      return { success: true, query: newQuery[0] };
    } catch (error) {
      console.error('Error saving query:', error);
      throw createError({
        statusCode: 500,
        message: 'Erreur lors de la sauvegarde de la requête'
      });
    }
  }

  // PUT - Mettre à jour une requête existante
  if (method === 'PUT') {
    const query = getQuery(event);
    const body = await readBody(event);
    const { id } = query;
    const { name, query: queryText, description, connectionId } = body;

    if (!id || !name || !queryText) {
      throw createError({
        statusCode: 400,
        message: 'ID, nom et requête sont requis'
      });
    }

    try {
      await pool.query(
        'UPDATE saved_queries SET name = ?, description = ?, query_text = ?, connection_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [name, description, queryText, connectionId, id, userId]
      );

      const [updatedQuery] = await pool.query(
        'SELECT * FROM saved_queries WHERE id = ?',
        [id]
      );

      return { success: true, query: updatedQuery[0] };
    } catch (error) {
      console.error('Error updating query:', error);
      throw createError({
        statusCode: 500,
        message: 'Erreur lors de la mise à jour de la requête'
      });
    }
  }

  // DELETE - Supprimer une requête
  if (method === 'DELETE') {
    const query = getQuery(event);
    const { id } = query;

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID requis'
      });
    }

    try {
      await pool.query(
        'DELETE FROM saved_queries WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting query:', error);
      throw createError({
        statusCode: 500,
        message: 'Erreur lors de la suppression de la requête'
      });
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Méthode non autorisée'
  });
}); 