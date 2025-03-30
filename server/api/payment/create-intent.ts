import Stripe from 'stripe';
import { readBody, defineEventHandler } from 'h3';
// Table des taux de TVA par pays
const TAX_RATES: { [key: string]: number } = {
  'FR': 0.20, // France
  'DE': 0.19, // Germany
  'IT': 0.22, // Italy
  'ES': 0.21, // Spain
  'GB': 0.20, // United Kingdom
  'BE': 0.21, // Belgium
  'NL': 0.21, // Netherlands
  'LU': 0.17, // Luxembourg
  'AT': 0.20, // Austria
  'US': 0.0,  // United States (may vary by state)
  'CA': 0.05, // Canada (may vary by province)
  'CH': 0.077, // Switzerland
  'PT': 0.23, // Portugal
  'DK': 0.25, // Denmark
  'SE': 0.25, // Sweden
  'NO': 0.25, // Norway
  'FI': 0.24, // Finland
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