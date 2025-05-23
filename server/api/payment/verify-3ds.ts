import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, readBody } from "h3";
import { getUserId } from "../../utils/auth-utils";
import { getPayPalClient } from "../../utils/paypal";
import { pool } from "../db";

async function waitForCompleted(paypal, orderId, retries = 10, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
    const order = await paypal.execute(orderRequest);
    console.log(`Tentative ${i + 1}: statut commande = ${order.result.status}`);
    if (order.result.status === 'COMPLETED') {
      return order;
    }
    await new Promise(res => setTimeout(res, delayMs));
  }
  throw new Error('La commande n\'est pas complétée après plusieurs tentatives');
}



export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const orderId = body.orderId as string;
    const userId = getUserId(event);

    if (!orderId || !userId) {
      return { success: false, error: 'Paramètres manquants' };
    }

    const paypal = await getPayPalClient();
    const order = await waitForCompleted(paypal, orderId);
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
