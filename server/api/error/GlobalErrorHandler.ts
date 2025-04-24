import { H3Event, defineEventHandler } from 'h3';
import { ErrorLogger } from './ErrorLogger';

export interface ExtendedError extends Error {
  code?: string | number;
  statusCode?: number;
}

export const globalErrorHandler = defineEventHandler(async (event: H3Event) => {
  try {
    if (!event.path?.startsWith('/api/')) {
      return await event;
    }

    const result = await event;

    if (result instanceof Error) {
      throw result;
    }

    return result;
  } catch (error) {
    console.error('[GlobalErrorHandler] Erreur capturée:', error);

    const err = error as ExtendedError;
    const url = event.node.req.url;

    const user = event.context?.user;

    const context = {
      route: url,
      timestamp: new Date().toISOString(),
      appRoute: event.path || 'unknown',
      method: event.node.req.method
    };

    await ErrorLogger.logError(err, context, event, user);

    const statusCode = err.statusCode || 500;

    const errorResponse = {
      success: false,
      error: err.message || 'Une erreur est survenue',
      statusCode,
      path: event.path,
      errorId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };

    if (process.env.NODE_ENV === 'development') {
      (errorResponse as any).stack = err.stack;
      (errorResponse as any).code = err.code;
      (errorResponse as any).context = context;
    }

    event.node.res.statusCode = statusCode;
    return errorResponse;
  }
});

export function createCustomError(message: string, statusCode: number = 500, code?: string | number): ExtendedError {
  const error = new Error(message) as ExtendedError;
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
}

export function createBadRequestError(message: string, code?: string | number): ExtendedError {
  return createCustomError(message, 400, code);
}

export function createUnauthorizedError(message: string = 'Unauthorized', code?: string | number): ExtendedError {
  return createCustomError(message, 401, code);
}

export function createForbiddenError(message: string = 'Access denied', code?: string | number): ExtendedError {
  return createCustomError(message, 403, code);
}

export function createNotFoundError(message: string = 'Resource not found', code?: string | number): ExtendedError {
  return createCustomError(message, 404, code);
}

export function createServerError(message: string = 'Internal server error', code?: string | number): ExtendedError {
  return createCustomError(message, 500, code);
} 