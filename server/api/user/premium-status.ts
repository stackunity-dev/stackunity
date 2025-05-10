import { defineEventHandler, readBody } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, selectedPlan } = body;

  if (!userId) {
    console.error('Erreur: userId manquant dans la requête premium-status');
    return {
      success: false,
      error: 'User not authenticated'
    };
  }

  if (!selectedPlan) {
    console.error('Erreur: selectedPlan manquant dans la requête premium-status');
    return {
      success: false,
      error: 'Selected plan is required'
    };
  }

  try {
    const isPremium = selectedPlan === 'premium' ? 1 : 0;
    const isStandard = selectedPlan === 'standard' ? 1 : 0;
    const subscription_status = 'active';
    const payment_status = 'paid';

    const [updateResult] = await pool.execute<ResultSetHeader>(
      `UPDATE users 
       SET isPremium = ?, 
           isStandard = ?, 
           subscription_status = ?, 
           payment_status = ? 
       WHERE id = ?`,
      [isPremium, isStandard, subscription_status, payment_status, userId]
    );

    if (updateResult.affectedRows > 0) {
      const [userRows] = await pool.execute<RowDataPacket[]>(
        `SELECT id, username, email, isPremium, isStandard, isAdmin, 
          subscription_status, payment_status, trial_start_date, trial_end_date 
         FROM users WHERE id = ?`,
        [userId]
      );

      if (userRows.length > 0) {
        const userIsPremium = userRows[0].isPremium === 1 || userRows[0].isPremium === true;
        const userIsStandard = userRows[0].isStandard === 1 || userRows[0].isStandard === true;
        const userIsAdmin = userRows[0].isAdmin === 1 || userRows[0].isAdmin === true;
        let daysLeft = 0;
        if (userRows[0].subscription_status === 'trial' && userRows[0].trial_end_date) {
          const now = new Date();
          const trialEndDate = new Date(userRows[0].trial_end_date);
          if (trialEndDate > now) {
            const diffTime = trialEndDate.getTime() - now.getTime();
            daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
        }

        return {
          success: true,
          isPremium: userIsPremium,
          isStandard: userIsStandard,
          subscription_status: userRows[0].subscription_status,
          payment_status: userRows[0].payment_status,
          trial_end_date: userRows[0].trial_end_date,
          daysLeft: daysLeft,
          user: {
            id: userRows[0].id,
            username: userRows[0].username,
            email: userRows[0].email,
            isPremium: userIsPremium,
            isStandard: userIsStandard,
            isAdmin: userIsAdmin,
            subscription_status: userRows[0].subscription_status,
            payment_status: userRows[0].payment_status,
            trial_end_date: userRows[0].trial_end_date,
            daysLeft: daysLeft
          }
        };
      } else {
        console.error('Utilisateur introuvable après mise à jour:', userId);
        return {
          success: false,
          error: 'User not found after update'
        };
      }
    } else {
      console.error('Aucune ligne affectée pour userId:', userId);
      return {
        success: false,
        error: 'Aucun utilisateur mis à jour'
      };
    }
  } catch (error) {
    console.error('Error updating premium status:', error);
    return {
      success: false,
      error: 'Error updating premium status'
    };
  }
});
