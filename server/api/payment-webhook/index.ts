import { defineEventHandler, getHeader, readRawBody } from 'h3';
import Stripe from 'stripe';
import { sendToMake } from '../payment/make-sender';
import { recordPayment } from '../payment/payment-recorder';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil',
});

export default defineEventHandler(async (event) => {
  try {
    const rawBody = await readRawBody(event);

    if (!rawBody) {
      throw new Error('Corps de la requête vide');
    }

    const signature = getHeader(event, 'stripe-signature');

    if (!signature) {
      throw new Error('Signature Stripe manquante dans les en-têtes');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Variable d\'environnement STRIPE_WEBHOOK_SECRET non définie');
    }

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata;

      await recordPayment({
        payment_id: paymentIntent.id,
        customer_id: paymentIntent.customer as string,
        customer_name: metadata.customer_name,
        customer_email: metadata.customer_email || '',
        amount: paymentIntent.amount / 100,
        original_amount: Number(metadata.base_amount) / 100,
        discount_amount: Number(metadata.discount_amount) / 100,
        discount_description: metadata.discount_description,
        tax_amount: Number(metadata.tax_amount) / 100,
        tax_rate: Number(metadata.tax_rate),
        currency: paymentIntent.currency.toUpperCase(),
        country_code: metadata.country_code,
        vat_number: metadata.vat_number,
        is_business: metadata.is_business === 'true',
        selected_plan: metadata.selected_plan,
        payment_date: new Date(),
        payment_status: 'completed'
      });

      try {
        await sendToMake();
      } catch (makeError) {
        console.error('Erreur lors de l\'envoi à Make mais le paiement a été enregistré:', makeError);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ received: true, processed: true }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true, processed: false }),
    };

  } catch (error) {
    console.error('Erreur dans le webhook:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          message: error instanceof Error ? error.message : 'Erreur inconnue',
        },
      }),
    };
  }
});
