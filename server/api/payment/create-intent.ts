import Stripe from 'stripe';
import { readBody, defineEventHandler } from 'h3';

const TAX_RATES: { [key: string]: number } = {
  'FR': 0.20,
  'DE': 0.19,
  'IT': 0.22,
  'ES': 0.21,
  'GB': 0.20,
  'BE': 0.21,
  'NL': 0.21,
  'LU': 0.17,
  'AT': 0.20,
  'US': 0.0,
  'CA': 0.05,
  'CH': 0.077,
  'PT': 0.23,
  'DK': 0.25,
  'SE': 0.25,
  'NO': 0.25,
  'FI': 0.24,
};

function getTaxRate(countryCode: string): number {
  return TAX_RATES[countryCode] || 0.20;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { currency, customer_name, country_code = 'FR' } = body;

    if (!currency) {
      return {
        success: false,
        error: 'Missing parameters: currency required'
      };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-09-30.acacia',
    });

    const baseAmount = 30000;

    const taxRate = getTaxRate(country_code);
    const taxAmount = Math.round(baseAmount * taxRate);
    const totalAmount = baseAmount + taxAmount;

    console.log(`Tax calculation for ${country_code}:`, {
      baseAmount,
      taxRate,
      taxAmount,
      totalAmount,
      taxPercentage: Math.round(taxRate * 100)
    });

    const customer = await stripe.customers.create({
      name: customer_name || 'DevUnity Client',
      address: {
        country: country_code,
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
      customer: customer.id,
      metadata: {
        customer_name: customer_name || 'Unidentified client',
        country_code,
        base_amount: baseAmount.toString(),
        tax_amount: taxAmount.toString(),
        tax_rate: `${Math.round(taxRate * 100)}%`
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      taxDetails: {
        baseAmount: baseAmount / 100,
        taxAmount: taxAmount / 100,
        totalAmount: totalAmount / 100,
        taxPercentage: Math.round(taxRate * 100)
      }
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    };
  }
}); 