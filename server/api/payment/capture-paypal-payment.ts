import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, readBody } from 'h3';
import { getUserId } from '../../utils/auth-utils';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const userId = getUserId(event);
    if (!userId) {
      return {
        success: false,
        error: 'Non autorisé'
      };
    }

    const body = await readBody(event);
    const { orderId } = body;

    if (!orderId) {
      return {
        success: false,
        error: 'ID de commande manquant'
      };
    }

    const paypal = await getPayPalClient();
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    const capture = await paypal.execute(request);

    if (capture.result.status !== 'COMPLETED') {
      throw new Error('Le paiement n\'a pas été complété');
    }

    const purchaseUnit = capture.result.purchase_units[0];
    const customId = purchaseUnit.custom_id;
    const invoiceId = purchaseUnit.invoice_id;

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [customId]);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    await pool.query('UPDATE users SET isPremium = true WHERE id = ?', [customId]);

    // Enregistrement du paiement
    await pool.query('INSERT INTO payments (user_id, amount, currency, status, payment_method, payment_id, invoice_id, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      userId,
      parseFloat(purchaseUnit.amount.value),
      purchaseUnit.amount.currency_code,
      'completed',
      'paypal',
      capture.result.id,
      invoiceId,
      JSON.stringify({
        captureId: capture.result.id,
        orderId: orderId,
        payerId: capture.result.payer.payer_id,
        paymentMethod: 'paypal',
        paymentId: capture.result.id,
        invoiceId: invoiceId,
        metadata: {
          captureId: capture.result.id,
          orderId: orderId,
          payerId: capture.result.payer.payer_id,
          payerEmail: capture.result.payer.email_address
        }
      })
    ]);

    /* Génération de la facture
    const invoice = await generateInvoice({
      userId: userId,
      paymentId: capture.result.id,
      amount: parseFloat(purchaseUnit.amount.value),
      currency: purchaseUnit.amount.currency_code,
      status: 'completed',
      paymentMethod: 'paypal',
      invoiceId: invoiceId
    });

    // Envoi de l'email de confirmation
    await sendEmail({
      to: user.email,
      subject: 'Confirmation de paiement',
      template: 'payment-confirmation',
      data: {
        username: user.username,
        paymentId: capture.result.id,
        invoiceId: invoice.id,
        amount: purchaseUnit.amount.value,
        currency: purchaseUnit.amount.currency_code
      }
    });*/

    return {
      success: true,
      message: 'Paiement traité avec succès'
    };
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue'
    };
  }
}); 