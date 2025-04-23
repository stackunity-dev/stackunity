import { defineEventHandler, readRawBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import Stripe from 'stripe';
import { pool } from '../db';

interface CustomerRow extends RowDataPacket {
  user_id: number;
}

export default defineEventHandler(async (event) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!stripeSecretKey || !webhookSecret) {
      console.error('Stripe keys missing for webhook processing');
      return { success: false, error: 'Configuration error' };
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-03-31.basil',
    });

    const signature = event.node.req.headers['stripe-signature'] as string;
    const rawBody = await readRawBody(event);

    if (!signature || !rawBody) {
      console.error('Missing Stripe signature or request body');
      return { success: false, error: 'Invalid webhook data' };
    }

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return { success: false, error: 'Signature verification failed' };
    }

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object;
        const metadata = paymentIntent.metadata || {};

        const isPremium = metadata.selectedPlan === 'premium' ? 1 : 0;
        const isStandard = metadata.selectedPlan === 'standard' ? 1 : 0;

        let userId = metadata.userId;

        if (!userId && paymentIntent.customer) {
          const [customerRows] = await pool.execute<CustomerRow[]>(
            'SELECT user_id FROM stripe_customers WHERE customer_id = ?',
            [paymentIntent.customer]
          );

          if (customerRows && customerRows.length > 0) {
            userId = customerRows[0].user_id;
          }
        }

        if (!userId) {
          console.error('Unable to find user for payment', paymentIntent.id);
          return { success: false, error: 'User not found' };
        }

        await pool.execute(
          `UPDATE users SET 
            isPremium = ?,
            isStandard = ?,
            payment_status = 'paid',
            subscription_status = 'active'
          WHERE id = ?`,
          [isPremium, isStandard, userId]
        );

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object;
        const metadata = paymentIntent.metadata || {};
        const userId = metadata.userId;

        if (userId) {
          await pool.execute(
            `UPDATE users SET payment_status = 'none' WHERE id = ?`,
            [userId]
          );
        }
        break;
      }

      case 'charge.refunded': {
        const charge = stripeEvent.data.object;

        if (charge.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string);
          const metadata = paymentIntent.metadata || {};
          const userId = metadata.userId;

          if (userId) {
            await pool.execute(
              `UPDATE users SET 
                isPremium = 0,
                isStandard = 0,
                payment_status = 'none',
                subscription_status = 'expired'
              WHERE id = ?`,
              [userId]
            );
          }
        }
        break;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Webhook error:', error);
    return { success: false, error: 'Webhook processing error' };
  }
}); 