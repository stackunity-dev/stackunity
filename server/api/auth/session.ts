import { defineEventHandler, deleteCookie, getCookie, getRequestHeaders, readBody, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from '../../utils/auth-config';
import { pool } from '../db';

// Durée de validité du cookie et du token (30 jours)
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
// Utiliser le même secret que celui utilisé dans le middleware d'authentification
const JWT_SECRET = ACCESS_TOKEN_SECRET;
// Augmentons la durée de validité du token à 30 jours aussi
const TOKEN_EXPIRY = ACCESS_TOKEN_EXPIRY;

interface TokenRequestBody {
  token: string;
}

interface JwtPayload {
  userId: number;
  id?: number; // Pour la compatibilité avec les anciens tokens
  username?: string;
  email?: string;
  isAdmin?: boolean;
  isPremium?: boolean;
  iat?: number;
  exp?: number;
}

export default defineEventHandler(async (event) => {
  // Configuration du cookie sécurisé
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'strict' as const,
    secure: true
  };

  // Gestion de la méthode GET pour récupérer le token
  if (event.method === 'GET') {
    try {
      // Récupérer le token de l'en-tête Authorization
      const authHeader = getRequestHeaders(event).authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

      // Utiliser le token du cookie comme fallback
      const sessionCookie = getCookie(event, 'devunity_secure_session');
      const sessionToken = token || sessionCookie;

      if (!sessionToken) {
        return {
          success: false,
          message: 'Aucune session active'
        };
      }

      try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(sessionToken, JWT_SECRET) as JwtPayload;

        // Utiliser userId ou id selon ce qui est disponible
        const userId = decoded.userId || decoded.id;

        if (!userId) {
          console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'ID utilisateur manquant dans le token');
          return {
            success: false,
            message: 'ID utilisateur manquant'
          };
        }

        // Vérifier si l'utilisateur existe toujours dans la base de données
        const [rows] = await pool.execute(
          'SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?',
          [userId]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
          deleteCookie(event, 'devunity_secure_session', cookieOptions);
          return {
            success: false,
            message: 'Utilisateur non trouvé'
          };
        }

        const user = rows[0] as any;

        // Générer un nouveau token avec des informations à jour
        const newToken = jwt.sign(
          {
            userId: user.id, // Utiliser userId au lieu de id pour la cohérence
            username: user.username,
            email: user.email,
            isPremium: user.isPremium === 1,
            isAdmin: user.isAdmin === 1
          },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRY }
        );

        // Mettre à jour le cookie avec le nouveau token
        setCookie(event, 'devunity_secure_session', newToken, cookieOptions);

        // Renvoyer le nouveau token au client
        return {
          success: true,
          token: newToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin === 1,
            isPremium: user.isPremium === 1
          }
        };
      } catch (jwtError) {
        // Si le token est invalide, supprimer le cookie
        deleteCookie(event, 'devunity_secure_session', cookieOptions);

        return {
          success: false,
          message: 'Session invalide'
        };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return {
        success: false,
        message: 'Erreur serveur'
      };
    }
  }

  // Gestion de la méthode POST pour créer une session
  if (event.method === 'POST') {
    try {
      // Récupérer le token depuis le corps de la requête
      const body = await readBody(event) as TokenRequestBody;
      const { token } = body;

      if (!token) {
        const authHeader = getRequestHeaders(event).authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const headerToken = authHeader.substring(7);
          if (headerToken) {
            // Vérifier que le token est valide
            try {
              jwt.verify(headerToken, JWT_SECRET);
              // Définir le cookie HttpOnly avec le token
              setCookie(event, 'devunity_secure_session', headerToken, cookieOptions);

              return {
                success: true,
                message: 'Session créée avec succès'
              };
            } catch (jwtError) {
              return {
                success: false,
                message: 'Token invalide'
              };
            }
          }
        }

        return {
          success: false,
          message: 'Token manquant'
        };
      }

      // Vérifier que le token est valide
      try {
        jwt.verify(token, JWT_SECRET);
      } catch (jwtError) {
        return {
          success: false,
          message: 'Token invalide'
        };
      }

      // Définir le cookie HttpOnly avec le token
      setCookie(event, 'devunity_secure_session', token, cookieOptions);

      return {
        success: true,
        message: 'Session créée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      return {
        success: false,
        message: 'Erreur serveur'
      };
    }
  }

  // Gestion de la méthode DELETE pour supprimer une session
  if (event.method === 'DELETE') {
    try {
      // Supprimer le cookie de session
      deleteCookie(event, 'devunity_secure_session', cookieOptions);

      return {
        success: true,
        message: 'Session supprimée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
      return {
        success: false,
        message: 'Erreur serveur'
      };
    }
  }

  // Méthode non prise en charge
  return {
    success: false,
    message: 'Méthode non prise en charge'
  };
}); 