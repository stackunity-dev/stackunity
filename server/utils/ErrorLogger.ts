import { H3Event } from 'h3';

export interface ErrorDetail {
  message: string;
  stack?: string;
  code?: string | number;
  name?: string;
  cause?: string;
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
    params?: any;
    query?: any;
  };
  user?: {
    id?: number;
    username?: string;
    email?: string;
  };
  context?: Record<string, any>;
  timestamp: string;
  environment: string;
  ipAddress?: string;
  userAgent?: string;
  app: {
    name: string;
    version: string;
  };
}


export class ErrorLogger {
  private static WEBHOOK_URL = process.env.ERROR_WEBHOOK_URL || 'https://hook.eu2.make.com/8cvasklbao67c9onep3utc5tpatluywi';
  private static APP_NAME = 'Stackunity';
  private static APP_VERSION = '1.0.0';
  private static ENVIRONMENT = process.env.NODE_ENV || 'development';

  public static async logError(
    error: Error | unknown,
    context?: Record<string, any>,
    event?: H3Event,
    user?: { id?: number; username?: string; email?: string }
  ): Promise<void> {
    try {
      const errorDetail = await this.buildErrorDetail(error, context, event, user);
      console.error('[ErrorLogger] Erreur détectée:', errorDetail.message);

      await this.sendToWebhook(errorDetail);

    } catch (logError) {
      console.error('[ErrorLogger] Erreur lors du logging:', logError);
    }
  }

  private static async buildErrorDetail(
    error: Error | unknown,
    context?: Record<string, any>,
    event?: H3Event,
    user?: { id?: number; username?: string; email?: string }
  ): Promise<ErrorDetail> {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const timestamp = new Date().toISOString();

    let requestInfo = {};
    let ipAddress;
    let userAgent;

    if (event) {
      const headers = event.node.req.headers;

      ipAddress = headers['x-forwarded-for'] as string ||
        event.node.req.socket.remoteAddress ||
        'unknown';

      if (typeof ipAddress === 'string' && ipAddress.includes(',')) {
        ipAddress = ipAddress.split(',')[0].trim();
      }

      userAgent = headers['user-agent'] as string;

      let requestBody;
      try {
        if (event.context.body) {
          requestBody = event.context.body;
        } else {
          requestBody = 'Corps de la requête non disponible';
        }
      } catch (e) {
        requestBody = 'Impossible de récupérer le corps de la requête';
      }

      requestInfo = {
        method: event.node.req.method,
        url: event.node.req.url,
        headers: this.sanitizeHeaders(headers),
        body: requestBody,
        params: event.context.params,
        query: event.node.req.url ? new URL(event.node.req.url, 'http://localhost').searchParams : {}
      };
    }

    return {
      message: errorObj.message,
      stack: errorObj.stack,
      name: errorObj.name,
      code: (errorObj as any).code,
      cause: (errorObj as any).cause?.toString(),
      request: requestInfo,
      user,
      context,
      timestamp,
      environment: this.ENVIRONMENT,
      ipAddress,
      userAgent,
      app: {
        name: this.APP_NAME,
        version: this.APP_VERSION
      }
    };
  }

  private static async sendToWebhook(errorDetail: ErrorDetail): Promise<void> {
    try {
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorDetail)
      });

      if (!response.ok) {
        console.error(`[ErrorLogger] Échec de l'envoi au webhook: ${response.status} ${response.statusText}`);
      } else {
        console.log('[ErrorLogger] Erreur envoyée avec succès à make.com');
      }
    } catch (webhookError) {
      console.error('[ErrorLogger] Erreur lors de l\'envoi au webhook:', webhookError);
    }
  }


  private static sanitizeHeaders(headers: any): Record<string, string> {
    const sanitized: Record<string, string> = {};

    Object.entries(headers || {}).forEach(([key, value]) => {
      if (key.toLowerCase() === 'authorization' ||
        key.toLowerCase() === 'cookie' ||
        key.toLowerCase() === 'set-cookie') {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value as string;
      }
    });

    return sanitized;
  }
} 