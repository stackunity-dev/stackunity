import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { getUserId } from '../../utils/auth-utils';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

const OrdersCreateRequest = checkoutNodeJssdk.orders.OrdersCreateRequest;
const OrdersCaptureRequest = checkoutNodeJssdk.orders.OrdersCaptureRequest;

export let orderTokensMap: Record<string, string> = {};

const formatAmount = (amount: number): string => amount.toFixed(2);

const formatExpiryDate = (expiry: string): string => {
  const [month, year] = expiry.split('/');
  const fullYear = `20${year}`;
  return `${fullYear}-${month.padStart(2, '0')}`;
};

const validateCardDetails = (cardDetails: any) => {
  console.log('🔍 Validation des détails de la carte...');
  if (!cardDetails.name || !cardDetails.number || !cardDetails.cvv || !cardDetails.expiry) {
    throw new Error('Informations de carte incomplètes');
  }
  const number = cardDetails.number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(number)) throw new Error('Numéro de carte invalide');
  if (!/^\d{3,4}$/.test(cardDetails.cvv)) throw new Error('CVV invalide');

  const [month, year] = cardDetails.expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (+month < 1 || +month > 12) throw new Error('Mois d\'expiration invalide');
  if (+year < currentYear || (+year === currentYear && +month < currentMonth)) {
    throw new Error('Carte expirée');
  }
};

async function retryCapture(orderId: string, retries = 3, delay = 3000, paypal: any): Promise<any> {
  const captureRequest = new OrdersCaptureRequest(orderId);
  captureRequest.requestBody({});
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📡 Tentative de capture n°${attempt} pour l'orderId ${orderId}`);
      const capture = await paypal.execute(captureRequest);
      console.log(`✅ Capture réussie`, JSON.stringify(capture.result, null, 2));
      return capture;
    } catch (error: any) {
      console.warn(`❌ Tentative ${attempt} échouée: ${error?.message || error}`);
      if (attempt < retries) {
        console.log(`⏳ Nouvelle tentative dans ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error(`🛑 Échec définitif après ${retries} tentatives.`, error?.stack || error);
        throw error;
      }
    }
  }
}

export default defineEventHandler(async (event) => {
  try {
    const userId = getUserId(event);
    if (!userId) {
      console.warn('🔒 Utilisateur non authentifié');
      return { success: false, error: 'Non autorisé' };
    }
    console.log(`🔐 Utilisateur ID: ${userId}`);

    const body = await readBody(event);
    console.log('📥 Corps reçu:', JSON.stringify(body, null, 2));

    const {
      cardDetails, billingAddress, amount, currency,
      description, username, billingCountry
    } = body;

    validateCardDetails(cardDetails);

    console.log(`🔎 Recherche utilisateur dans la base: ${username}`);
    const [userRows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
    if (!userRows || userRows.length === 0) {
      console.warn(`👤 Utilisateur "${username}" non trouvé`);
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    const paypal = await getPayPalClient();
    const requestId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const createRequest = new OrdersCreateRequest();
    createRequest.prefer("return=representation");
    createRequest.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'PayPal-Request-Id': requestId
    };
    createRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: formatAmount(amount),
        },
        description,
        custom_id: userId,
      }],
      application_context: {
        return_url: `https://stackunity.tech/payment/3ds-return`,
        cancel_url: `https://stackunity.tech/payment/cancel`
      }
    });

    const order = await paypal.execute(createRequest);
    const orderId = order.result.id;
    const approveLink = order.result.links.find(link => link.rel === 'approve');

    await pool.query('INSERT INTO paypal_tokens (token, order_id, user_id, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))', [token, orderId, userId]);

    return {
      success: true,
      orderId,
      token,
      redirectUrl: approveLink?.href || null,
    };
  } catch (error: any) {
    console.error('🔥 Erreur générale lors du traitement du paiement:');
    console.error(error?.stack || error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue lors du traitement du paiement'
    };
  }
});
