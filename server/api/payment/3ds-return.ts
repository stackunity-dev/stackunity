import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, getQuery } from 'h3';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';
import { getUserId } from '../../utils/auth-utils';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);
  const userId = getUserId(event);
  if (!token) return { success: false, error: 'Token de commande manquant' };

  try {
    const paypal = await getPayPalClient();
    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(token);
    const order = await paypal.execute(orderRequest);

    if (order.result.status !== 'APPROVED') {
      return { success: false, error: `Commande non approuvée: ${order.result.status}` };
    }

    // Capture uniquement si APPROVED
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});
    const capture = await paypal.execute(captureRequest);
    console.log('Capture response:', capture);


    if (capture.result.status === 'COMPLETED') {
      await pool.query(
        'UPDATE users SET is_premium = 1, premium_since = NOW() WHERE id = ?',
        [userId]
      );
      return { success: true, message: 'Paiement capturé avec succès après 3DS' };
    } else {
      return { success: false, error: `Capture échouée : ${capture.result.status}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors du retour 3DS' };
  }
});
