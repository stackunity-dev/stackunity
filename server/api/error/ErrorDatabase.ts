import { pool } from '../db';
import { ErrorDetail } from './ErrorLogger';

export class ErrorDatabase {

  static async saveError(errorDetail: ErrorDetail): Promise<number | null> {
    try {
      const errorId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const [result] = await pool.execute(`
        INSERT INTO error_logs (
          error_id,
          message,
          stack,
          code,
          user_id,
          request_method,
          request_url,
          request_body,
          user_agent,
          ip_address,
          environment,
          timestamp,
          context
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        errorId,
        errorDetail.message.substring(0, 255),
        errorDetail.stack || null,
        errorDetail.code?.toString() || null,
        errorDetail.user?.id || null,
        errorDetail.request?.method || null,
        errorDetail.request?.url || null,
        JSON.stringify(errorDetail.request?.body) || null,
        errorDetail.userAgent || null,
        errorDetail.ipAddress || null,
        errorDetail.environment,
        new Date(errorDetail.timestamp),
        JSON.stringify(errorDetail.context) || null
      ]);

      // @ts-ignore
      return result.insertId;
    } catch (error) {
      console.error('[ErrorDatabase] Erreur lors de l\'enregistrement de l\'erreur:', error);
      return null;
    }
  }

  static async getErrors(
    page: number = 1,
    limit: number = 20,
    filters: {
      userId?: number;
      fromDate?: Date;
      toDate?: Date;
      environment?: string;
      errorId?: string;
    } = {}
  ): Promise<{ errors: any[]; total: number; page: number; limit: number }> {
    try {
      const conditions: string[] = [];
      const params: any[] = [];

      if (filters.userId) {
        conditions.push('user_id = ?');
        params.push(filters.userId);
      }

      if (filters.fromDate) {
        conditions.push('timestamp >= ?');
        params.push(filters.fromDate);
      }

      if (filters.toDate) {
        conditions.push('timestamp <= ?');
        params.push(filters.toDate);
      }

      if (filters.environment) {
        conditions.push('environment = ?');
        params.push(filters.environment);
      }

      if (filters.errorId) {
        conditions.push('error_id = ?');
        params.push(filters.errorId);
      }

      const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

      const [countResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM error_logs ${whereClause}`,
        params
      );

      // @ts-ignore
      const total = countResult[0].total;

      const offset = (page - 1) * limit;

      const [rows] = await pool.execute(
        `SELECT * FROM error_logs ${whereClause} 
         ORDER BY timestamp DESC 
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return {
        // @ts-ignore
        errors: rows.map(row => ({
          ...row,
          context: row.context ? JSON.parse(row.context) : null,
          request_body: row.request_body ? JSON.parse(row.request_body) : null
        })),
        total,
        page,
        limit
      };
    } catch (error) {
      console.error('[ErrorDatabase] Erreur lors de la récupération des erreurs:', error);
      return { errors: [], total: 0, page, limit };
    }
  }

  static async cleanupOldErrors(olderThan: Date): Promise<number> {
    try {
      const [result] = await pool.execute(
        'DELETE FROM error_logs WHERE timestamp < ?',
        [olderThan]
      );

      // @ts-ignore
      return result.affectedRows || 0;
    } catch (error) {
      console.error('[ErrorDatabase] Erreur lors du nettoyage des anciennes erreurs:', error);
      return 0;
    }
  }
} 