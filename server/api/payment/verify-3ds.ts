import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { getUserId } from "../../utils/auth-utils";
import { readBody, defineEventHandler } from "h3";
import { getPayPalClient } from "../../utils/paypal";
import { pool } from "../db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const orderId = body.orderId as string;
    const userId = getUserId(event);

    if (!orderId || !userId) {
      return { success: false, error: 'Paramètres manquants' };
    }

    const paypal = await getPayPalClient();
    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
    const order = await paypal.execute(orderRequest);
    console.log(order);

    if (order.result.status !== 'COMPLETED') {
      return { success: false, error: 'La commande n\'est pas complétée' };
    }

    // Mise à jour base + enregistrement transaction uniquement ici
    await pool.query(
      'UPDATE users SET is_premium = 1, premium_since = NOW() WHERE id = ?',
      [userId]
    );

    return { success: true, message: 'Paiement vérifié et traité avec succès' };

  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la vérification du paiement' };
  }
});
