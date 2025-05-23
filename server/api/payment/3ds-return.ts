import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, getQuery } from 'h3';
import { getPayPalClient } from '../../utils/paypal';
import { orderTokensMap } from './process-card';
import retryCapture from './process-card';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) return { success: false, error: 'Token de commande manquant' };

  const orderId = orderTokensMap[token];
  console.log('orderId', orderId);

  if (!orderId) {
    return { success: false, error: 'Token invalide ou expiré' };
  }

  try {
    const paypal = await getPayPalClient();

    // Vérifie la commande avec l’orderId réel
    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
    const order = await paypal.execute(orderRequest);
    console.log('order', order);

    if (order.result.status !== 'APPROVED') {
      return { success: false, error: `Commande non approuvée: ${order.result.status}` };
    }

    // Capture la commande avec l’orderId réel
    const capture = await retryCapture(paypal);

    console.log('Capture response:', capture);

    if (capture.success) {
      return { success: true, message: 'Paiement capturé avec succès après 3DS' };
    } else {
      return { success: false, error: `Capture échouée : ${capture.error}` };
    }
  } catch (error: any) {
    console.error('Erreur lors du retour 3DS:', error);
    return { success: false, error: error.message || 'Erreur lors du retour 3DS' };
  }
});
