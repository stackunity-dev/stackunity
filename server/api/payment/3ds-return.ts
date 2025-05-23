import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, getQuery } from 'h3';
import { getPayPalClient } from '../../utils/paypal';
import { orderTokensMap } from './process-card';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) return { success: false, error: 'Token de commande manquant' };

  const orderId = orderTokensMap[token];

  if (!orderId) {
    return { success: false, error: 'Token invalide ou expiré' };
  }

  try {
    const paypal = await getPayPalClient();

    // Vérifie la commande avec l’orderId réel
    const orderRequest = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
    const order = await paypal.execute(orderRequest);

    if (order.result.status !== 'APPROVED') {
      return { success: false, error: `Commande non approuvée: ${order.result.status}` };
    }

    // Capture la commande avec l’orderId réel
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});
    const capture = await paypal.execute(captureRequest);

    console.log('Capture response:', capture);

    if (capture.result.status === 'COMPLETED') {
      return { success: true, message: 'Paiement capturé avec succès après 3DS' };
    } else {
      return { success: false, error: `Capture échouée : ${capture.result.status}` };
    }
  } catch (error: any) {
    console.error('Erreur lors du retour 3DS:', error);
    return { success: false, error: error.message || 'Erreur lors du retour 3DS' };
  }
});
