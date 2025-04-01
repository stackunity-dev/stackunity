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

      console.log(`[${new Date().toISOString()}] Session GET - Token présent dans l'en-tête:`, !!token);

      // Utiliser le token du cookie comme fallback
      const sessionCookie = getCookie(event, 'devunity_secure_session');
      console.log(`[${new Date().toISOString()}] Session GET - Cookie présent:`, !!sessionCookie);

      const sessionToken = token || sessionCookie;

      if (!sessionToken) {
        console.log(`[${new Date().toISOString()}] Session GET - Aucun token trouvé`);
        return {
          success: false,
          message: 'Aucune session active'
        };
      }

      try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(sessionToken, JWT_SECRET) as JwtPayload;
        console.log(`[${new Date().toISOString()}] Session GET - Token décodé, contient userId:`, !!decoded.userId, 'contient id:', !!decoded.id);

        // Utiliser userId ou id selon ce qui est disponible
        const userId = decoded.userId || decoded.id;

        if (!userId) {
          console.log(`[${new Date().toISOString()}] Session GET - ID utilisateur manquant dans le token`);
          return {
            success: false,
            message: 'ID utilisateur manquant'
          };
        }

        // Vérifier si l'utilisateur existe toujours dans la base de données
        console.log(`[${new Date().toISOString()}] Session GET - Recherche de l'utilisateur avec ID:`, userId);
        const [rows] = await pool.execute(
          'SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?',
          [userId]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`[${new Date().toISOString()}] Session GET - Utilisateur non trouvé en base de données pour l'ID:`, userId);
          deleteCookie(event, 'devunity_secure_session', cookieOptions);
          return {
            success: false,
            message: 'Utilisateur non trouvé'
          };
        }

        const user = rows[0] as any;
        console.log(`[${new Date().toISOString()}] Session GET - Utilisateur trouvé:`, user.id);

        // Générer un nouveau token avec des informations à jour
        const newToken = jwt.sign(
          {
            userId: user.id,
            id: user.id,
            username: user.username,
            email: user.email,
            isPremium: user.isPremium === 1,
            isAdmin: user.isAdmin === 1
          },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRY }
        );

        console.log(`[${new Date().toISOString()}] Session GET - Nouveau token généré`);

        // Vérifier que le nouveau token est valide
        try {
          jwt.verify(newToken, JWT_SECRET);
        } catch (jwtError) {
          console.error(`[${new Date().toISOString()}] Session GET - Erreur lors de la vérification du nouveau token:`, jwtError);
          return {
            success: false,
            message: 'Erreur lors de la génération du token'
          };
        }

        // Mettre à jour le cookie avec le nouveau token
        setCookie(event, 'devunity_secure_session', newToken, cookieOptions);
        console.log(`[${new Date().toISOString()}] Session GET - Cookie mis à jour avec le nouveau token`);

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
        console.error(`[${new Date().toISOString()}] Session GET - Erreur de vérification du token:`, jwtError);
        deleteCookie(event, 'devunity_secure_session', cookieOptions);

        return {
          success: false,
          message: 'Session invalide'
        };
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Session GET - Erreur lors de la récupération de la session:`, error);
      return {
        success: false,
        message: 'Erreur serveur'
      };
    }
  }

  // Gestion de la méthode POST pour créer une session
  if (event.method === 'POST') {
    try {
      console.log(`[${new Date().toISOString()}] Session POST - Traitement d'une demande de création de session`);

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
              console.log(`[${new Date().toISOString()}] Session POST - Token de l'en-tête valide`);

              // Définir le cookie HttpOnly avec le token
              setCookie(event, 'devunity_secure_session', headerToken, cookieOptions);
              console.log(`[${new Date().toISOString()}] Session POST - Cookie défini avec le token de l'en-tête`);

              return {
                success: true,
                message: 'Session créée avec succès'
              };
            } catch (jwtError) {
              console.error(`[${new Date().toISOString()}] Session POST - Token de l'en-tête invalide:`, jwtError);
              return {
                success: false,
                message: 'Token invalide'
              };
            }
          }
        }

        console.log(`[${new Date().toISOString()}] Session POST - Token manquant dans la requête`);
        return {
          success: false,
          message: 'Token manquant'
        };
      }

      // Vérifier que le token est valide
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        console.log(`[${new Date().toISOString()}] Session POST - Token du corps décodé, contient userId:`, !!decoded.userId, 'contient id:', !!decoded.id);

        // Vérifier la présence d'un ID utilisateur
        const userId = decoded.userId || decoded.id;
        if (!userId) {
          console.log(`[${new Date().toISOString()}] Session POST - ID utilisateur manquant dans le token`);
          return {
            success: false,
            message: 'Token invalide - ID utilisateur manquant'
          };
        }
      } catch (jwtError) {
        console.error(`[${new Date().toISOString()}] Session POST - Erreur de vérification du token:`, jwtError);
        return {
          success: false,
          message: 'Token invalide'
        };
      }

      // Définir le cookie HttpOnly avec le token
      setCookie(event, 'devunity_secure_session', token, cookieOptions);
      console.log(`[${new Date().toISOString()}] Session POST - Cookie défini avec le token du corps`);

      return {
        success: true,
        message: 'Session créée avec succès'
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Session POST - Erreur lors de la création de la session:`, error);
      return {
        success: false,
        message: 'Erreur serveur'
      };
    }
  }

  // Gestion de la méthode DELETE pour supprimer une session
  if (event.method === 'DELETE') {
    try {
      console.log(`[${new Date().toISOString()}] Session DELETE - Suppression de session`);

      // Supprimer le cookie de session
      deleteCookie(event, 'devunity_secure_session', cookieOptions);
      console.log(`[${new Date().toISOString()}] Session DELETE - Cookie supprimé`);

      return {
        success: true,
        message: 'Session supprimée avec succès'
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Session DELETE - Erreur lors de la suppression de la session:`, error);
      return {
        success: false,
        message: 'Erreur serveur'
      };
    }
  }

  // Méthode non prise en charge
  console.log(`[${new Date().toISOString()}] Session - Méthode non prise en charge: ${event.method}`);
  return {
    success: false,
    message: 'Méthode non prise en charge'
  };
}); 