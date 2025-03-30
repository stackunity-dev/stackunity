import { defineEventHandler, getHeader } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization');
  console.log('Authorization header dans loadData:', authHeader ? 'Présent' : 'Absent');

  console.log('event.context:', event.context);
  console.log('event.context.user:', event.context.user);

  const userId = event.context.user?.id;
  console.log('userId dans loadData:', userId);

  if (userId === undefined) {
    console.error('Erreur: userId est undefined dans loadData.ts');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        console.log('Tentative d\'extraction de l\'ID utilisateur depuis le token');

        return {
          success: false,
          error: 'Utilisateur non authentifié ou session expirée (token présent mais pas d\'ID dans le contexte)'
        };
      } catch (err) {
        console.error('Erreur lors de l\'extraction du token:', err);
      }
    }

    return {
      success: false,
      error: 'Utilisateur non authentifié ou session expirée'
    };
  }

  try {
    console.log('Exécution des requêtes SQL avec userId:', userId);

    const [userRows] = await pool.execute('SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?', [userId]);
    console.log('userRows:', userRows);

    const [studioComponentsRows] = await pool.execute('SELECT * FROM studio_components WHERE user_id = ?', [userId]);

    console.log('Données récupérées avec succès');

    return {
      success: true,
      data: {
        userData: userRows,
        studioComponents: studioComponentsRows
      }
    }
  }
  catch (err: any) {
    console.error("Erreur lors du chargement des données :", err.message, err.stack);
    return {
      success: false,
      error: err.message || "Erreur lors du chargement des données"
    };
  }
});