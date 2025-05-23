import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, getQuery } from 'h3';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);

  if (!token) return { success: false, error: 'Token de commande manquant' };

  try {
    const paypal = await getPayPalClient();

    // Vérifie d'abord le statut de la commande
    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(token);
    console.log('🔁 Order Request:', orderRequest);
    const order = await paypal.execute(orderRequest);
    console.log('🔁 Order:', order);
    if (order.result.status !== 'APPROVED') {
      return { success: false, error: `Commande non approuvée: ${order.result.status}` };
    }

    // Capture la commande
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});
    const capture = await paypal.execute(captureRequest);

    if (capture.result.status === 'COMPLETED') {
      const userId = order.result.purchase_units[0].custom_id;

      await pool.query('UPDATE users SET is_premium = 1, premium_since = NOW() WHERE id = ?', [userId]);

      return { success: true, message: 'Paiement capturé avec succès après 3DS' };
    } else {
      return { success: false, error: `Capture échouée : ${capture.result.status}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors du retour 3DS' };
  }
});
