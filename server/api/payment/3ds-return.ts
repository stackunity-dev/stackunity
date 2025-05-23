import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, getQuery } from 'h3';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);

  if (!token) {
    return { success: false, error: 'Token de commande manquant' };
  }

  try {
    const paypal = await getPayPalClient();
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(token as string);
    captureRequest.requestBody({});

    const capture = await paypal.execute(captureRequest);

    if (capture.result.status === 'COMPLETED') {
      const userId = capture.result.purchase_units[0].custom_id;

      await pool.query('UPDATE users SET isPremium = 1 WHERE id = ?', [userId]);

      return { success: true, message: 'Paiement capturé avec succès après 3DS' };
    }

    return { success: false, error: `Statut inattendu: ${capture.result.status}` };
  } catch (error: any) {
    console.error('❌ Erreur retour 3DS:', error);
    return { success: false, error: error.message || 'Erreur lors du retour 3DS' };
  }
});
