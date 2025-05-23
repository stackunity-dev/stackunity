import { createError, getRequestHeaders } from 'h3';
import { ServerTokenManager } from './ServerTokenManager';

export function getAuthToken(event: any) {
  const headers = getRequestHeaders(event);
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[AUTH] Header d\'authorization manquant ou invalide');
    throw createError({
      statusCode: 401,
      message: 'Header d\'authorization manquant ou invalide'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decodedToken = ServerTokenManager.verifyAccessToken(token);
    if (!decodedToken) {
      throw new Error('Token invalide');
    }
    return decodedToken;
  } catch (tokenError) {
    console.error('[AUTH] Erreur lors du décodage du token:', tokenError);
    throw createError({
      statusCode: 401,
      message: 'Token invalide ou expiré'
    });
  }
}

export function getUserId(event: any): string {
  if (!event.context.user) {
    try {
      const decodedToken = getAuthToken(event);
      if (decodedToken) {
        event.context.user = decodedToken;
      }
    } catch (tokenError) {
      console.error('[AUTH] Erreur lors de la vérification de l\'authentification:', tokenError);
      throw createError({
        statusCode: 401,
        message: 'Session utilisateur non trouvée'
      });
    }
  }

  if (!event.context.user) {
    console.error('[AUTH] Contexte utilisateur toujours manquant après tentative de décodage');
    throw createError({
      statusCode: 401,
      message: 'Session utilisateur non trouvée'
    });
  }

  const userId = event.context.user.id || event.context.user.userId;

  if (!userId) {
    console.error('[AUTH] ID utilisateur non trouvé dans le contexte:', JSON.stringify(event.context.user));
    throw createError({
      statusCode: 401,
      message: 'ID utilisateur non trouvé dans la session'
    });
  }

  return userId;
} 