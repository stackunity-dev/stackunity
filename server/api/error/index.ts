import { defineEventHandler, getQuery } from 'h3';
import { ErrorDatabase } from '../../utils/ErrorDatabase';
import { createForbiddenError, createUnauthorizedError } from '../../utils/GlobalErrorHandler';

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createUnauthorizedError('Connexion requise pour accéder aux logs d\'erreurs');
  }

  if (!user.isAdmin) {
    throw createForbiddenError('Seuls les administrateurs peuvent accéder aux logs d\'erreurs');
  }

  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const errorId = query.id as string;

    if (errorId) {
      return await ErrorDatabase.getErrors(1, 1, { errorId });
    }

    const filters: {
      userId?: number;
      fromDate?: Date;
      toDate?: Date;
      environment?: string;
    } = {};

    if (query.userId) {
      filters.userId = parseInt(query.userId as string);
    }

    if (query.fromDate) {
      filters.fromDate = new Date(query.fromDate as string);
    }

    if (query.toDate) {
      filters.toDate = new Date(query.toDate as string);
    }

    if (query.environment) {
      filters.environment = query.environment as string;
    }

    return await ErrorDatabase.getErrors(page, limit, filters);
  }

  if (method === 'DELETE') {
    const days = parseInt(query.days as string) || 30;

    const olderThan = new Date();
    olderThan.setDate(olderThan.getDate() - days);

    const deletedCount = await ErrorDatabase.cleanupOldErrors(olderThan);

    return {
      success: true,
      message: `${deletedCount} erreurs supprimées avec succès`,
      deletedCount,
      olderThan: olderThan.toISOString()
    };
  }

  return {
    success: false,
    message: 'Méthode non supportée'
  };
}); 