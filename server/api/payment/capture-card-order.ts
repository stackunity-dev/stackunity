import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, getQuery } from 'h3';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const orderId = query.token as string;

  try {
    const paypal = await getPayPalClient();

    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});

    const capture = await paypal.execute(captureRequest);

    if (capture.result.status === 'COMPLETED') {
      const userId = capture.result.purchase_units[0].custom_id;
      await pool.query('UPDATE users SET isPremium = true WHERE id = ?', [userId]);

      return {
        success: true,
        message: 'Paiement capturé avec succès'
      };
    } else {
      return {
        success: false,
        error: `Statut inattendu: ${capture.result.status}`
      };
    }

  } catch (err: any) {
    console.error('❌ Erreur capture:', err);
    return {
      success: false,
      error: err.message || 'Erreur de capture'
    };
  }
});
