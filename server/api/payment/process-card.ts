import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { getUserId } from '../../utils/auth-utils';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

const OrdersCreateRequest = checkoutNodeJssdk.orders.OrdersCreateRequest;

export let orderTokensMap: Record<string, string> = {};

const formatAmount = (amount: number): string => amount.toFixed(2);

export default defineEventHandler(async (event) => {
  try {
    const userId = getUserId(event);
    if (!userId) {
      return { success: false, error: 'Non autorisé' };
    }

    const body = await readBody(event);

    const {
      amount, currency,
      description, username
    } = body;

    const [userRows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
    if (!userRows || userRows.length === 0) {
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

    await pool.query(
      'INSERT INTO paypal_tokens (token, order_id, user_id, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))',
      [orderId, orderId, userId]
    );

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
