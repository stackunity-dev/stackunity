import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, readBody } from 'h3';
import { getUserId } from '../../utils/auth-utils';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

export default defineEventHandler(async (event) => {

  try {
    const body = await readBody(event);
    const token = body.token as string;
    const userId = getUserId(event);

    console.log('📝 Paramètres reçus:', { token, userId });

    if (!token || !userId) {
      console.error('❌ Paramètres manquants:', { token, userId });
      return {
        success: false,
        error: 'Paramètres manquants'
      };
    }

    const paypal = await getPayPalClient();

    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(token);
    const order = await paypal.execute(orderRequest);

    if (order.result.status !== 'COMPLETED') {
      console.error('❌ Commande non complétée:', order.result.status);
      return {
        success: false,
        error: 'La commande n\'est pas complétée'
      };
    }
    console.log('✅ Commande vérifiée');

    // Capturer le paiement
    console.log('🔄 Début de la capture du paiement...');
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(token);
    const capture = await paypal.execute(captureRequest);
    console.log('📊 Résultat de la capture:', capture.result);

    if (capture.result.status === 'COMPLETED') {
      console.log('✅ Capture réussie, mise à jour de la base de données...');

      // Mettre à jour le statut de l'utilisateur
      console.log('👤 Mise à jour du statut premium de l\'utilisateur...');
      await pool.query(
        'UPDATE users SET is_premium = 1, premium_since = NOW() WHERE id = ?',
        [userId]
      );
      console.log('✅ Statut utilisateur mis à jour');

      // Enregistrer la transaction
      console.log('💾 Enregistrement de la transaction...');
      await pool.query(
        'INSERT INTO transactions (user_id, order_id, amount, status, payment_method, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [
          userId,
          token,
          capture.result.purchase_units[0].amount.value,
          'COMPLETED',
          'CARD'
        ]
      );
      console.log('✅ Transaction enregistrée');

      console.log('🎉 Traitement terminé avec succès');
      return {
        success: true,
        message: 'Paiement traité avec succès'
      };
    } else {
      console.error('❌ Échec de la capture:', capture.result);
      return {
        success: false,
        error: 'Échec de la capture du paiement'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Une erreur est survenue lors de la vérification du paiement'
    };
  }
});
