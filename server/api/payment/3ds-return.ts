import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, getQuery } from 'h3';
import { RowDataPacket } from 'mysql2';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';
import { getUserId } from '../../utils/auth-utils';

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return { success: false, error: 'Utilisateur non authentifié' };
  }

  const { token: orderIdFromUrl } = getQuery(event);
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM paypal_tokens WHERE token = ? AND expires_at > NOW()', [orderIdFromUrl]);

  if (rows.length === 0) return { success: false, error: 'Token invalide ou expiré' };
  const orderId = rows[0].order_id;

  if (!orderId) {
    return { success: false, error: 'Token invalide ou expiré' };
  }

  try {
    const paypal = await getPayPalClient();

    // Vérifie la commande avec l'orderId réel
    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
    const order = await paypal.execute(orderRequest);

    if (order.result.status !== 'APPROVED') {
      return { success: false, error: `Commande non approuvée: ${order.result.status}` };
    }

    // Capture la commande avec l'orderId réel
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});
    const capture = await paypal.execute(captureRequest);


    if (capture.result.status === 'COMPLETED') {
      const captureDetails = capture.result.purchase_units?.[0]?.payments?.captures?.[0];
      if (!captureDetails) {
        return { success: false, error: 'Détails de capture non trouvés' };
      }

      const [userRows] = await pool.execute<RowDataPacket[]>(
        'SELECT username, email FROM users WHERE id = ?',
        [userId]
      );
      const username = userRows.length > 0 ? userRows[0].username : 'StackUnity client';
      const userEmail = userRows.length > 0 ? userRows[0].email : '';
      const planName = 'StackUnity subscription (lifetime)'; // Remplacer par ta logique

      await pool.query(
        `INSERT INTO payments 
          (customer_name, customer_email, paypal_order_id, user_id, amount, currency, status, plan_name, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          username,
          userEmail,
          orderId,
          userId,
          parseFloat(captureDetails.amount.value),
          captureDetails.amount.currency_code,
          capture.result.status,
          planName
        ]
      );

      return { success: true, message: 'Paiement capturé avec succès après 3DS' };
    }
    else {
      return { success: false, error: `Capture échouée : ${capture.result.status}` };
    }
  } catch (error: any) {
    console.error('Erreur lors du retour 3DS:', error);
    return { success: false, error: error.message || 'Erreur lors du retour 3DS' };
  }
});
