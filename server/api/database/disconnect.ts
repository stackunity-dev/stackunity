import { createError, defineEventHandler, readBody } from 'h3';
import { closeConnectionPool } from './pool';

/**
 * API pour fermer une connexion à une base de données
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { connectionId } = body;

    // Vérifier l'authentification
    const user = event.context.user || { id: 'demo-user' }; // Fallback pour démo

    // Validation des entrées
    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database connection ID is required'
      });
    }

    // Fermer le pool de connexion
    try {
      const closed = await closeConnectionPool(connectionId);

      if (closed) {
        console.log(`Connection closed for ID: ${connectionId}`);
        return {
          success: true,
          message: 'Database connection closed successfully'
        };
      } else {
        console.log(`No active connection found for ID: ${connectionId}`);
        return {
          success: true,
          message: 'No active connection to close'
        };
      }
    } catch (error: any) {
      console.error('Error closing database connection:', error);
      return {
        success: false,
        message: `Failed to close connection: ${error.message}`
      };
    }
  } catch (error: any) {
    console.error('Error processing disconnection request:', error);
    return {
      success: false,
      error: error.message || 'Failed to close database connection',
      errorCode: error.statusCode || 500
    };
  }
}); 