/**
 * Service de gestion des tokens de rafraîchissement côté serveur
 */
import { pool } from '../api/db';
import { RefreshToken } from './TokenManager';

export class TokenService {
  /**
   * Enregistre un token de rafraîchissement dans la base de données
   */
  static async saveRefreshToken(tokenId: string, userId: number): Promise<boolean> {
    try {
      await pool.execute(
        'INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
        [tokenId, userId]
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token de rafraîchissement:', error);
      return false;
    }
  }

  /**
   * Vérifie si un token de rafraîchissement existe et est valide
   */
  static async verifyRefreshTokenInDb(tokenId: string, userId: number): Promise<boolean> {
    try {
      const [rows] = await pool.execute<RefreshToken[]>(
        'SELECT * FROM refresh_tokens WHERE token_id = ? AND user_id = ? AND expires_at > NOW() AND revoked = 0',
        [tokenId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification du token de rafraîchissement:', error);
      return false;
    }
  }

  /**
   * Révoque un token de rafraîchissement
   */
  static async revokeRefreshToken(tokenId: string): Promise<boolean> {
    try {
      await pool.execute(
        'UPDATE refresh_tokens SET revoked = 1 WHERE token_id = ?',
        [tokenId]
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la révocation du token de rafraîchissement:', error);
      return false;
    }
  }

  /**
   * Remplace un token de rafraîchissement par un nouveau
   */
  static async rotateRefreshToken(oldTokenId: string, newTokenId: string): Promise<boolean> {
    try {
      await pool.execute(
        'UPDATE refresh_tokens SET revoked = 1, replaced_by = ? WHERE token_id = ?',
        [newTokenId, oldTokenId]
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la rotation du token de rafraîchissement:', error);
      return false;
    }
  }
} 