import { defineEventHandler, readBody } from 'h3';
import { ErrorLogger } from '../../utils/ErrorLogger';
import { createUnauthorizedError } from '../../utils/GlobalErrorHandler';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { path, timestamp, type } = body;

    if (type === 'unauthorized_access') {
      await ErrorLogger.logError(
        createUnauthorizedError(`Tentative d'accès non autorisé à ${path}`),
        {
          context: 'Navigation non autorisée',
          path,
          timestamp,
          type
        },
        event
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors du log d\'accès:', error);
    return { success: false, error: 'Erreur lors de l\'enregistrement du log' };
  }
}); 