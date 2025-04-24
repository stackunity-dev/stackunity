import { defineEventHandler } from 'h3';
import { ErrorLogger } from '../api/error/ErrorLogger';
import { ExtendedError } from '../api/error/GlobalErrorHandler';

export default defineEventHandler(async (event) => {
  try {
    // Laisser passer l'événement sans return
  } catch (initError) {
    console.error('Erreur lors de l\'initialisation du système de gestion des erreurs:', initError);

    await ErrorLogger.logError(initError, {
      context: 'Initialisation du système de gestion des erreurs',
      moduleType: 'middleware',
      isStartupError: true
    }, event);

    return {
      success: false,
      error: 'Erreur interne du serveur lors de l\'initialisation',
      statusCode: 500
    };
  }
});

export function captureError(
  error: Error | string,
  context?: Record<string, any>,
  event?: any,
  user?: { id?: number; username?: string; email?: string }
): void {
  const err = typeof error === 'string' ? new Error(error) : error;
  ErrorLogger.logError(err, context, event, user);
}

export function throwAndCaptureError(
  message: string,
  statusCode: number = 500,
  context?: Record<string, any>,
  event?: any,
  user?: { id?: number; username?: string; email?: string }
): never {
  const error = new Error(message) as ExtendedError;
  error.statusCode = statusCode;

  ErrorLogger.logError(error, context, event, user);
  throw error;
} 