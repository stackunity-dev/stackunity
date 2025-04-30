import { defineEventHandler, readBody } from 'h3';
import Stripe from 'stripe';
import { pool } from '../db';

const promoCodes = {
  'WELCOME20': { type: 'percentage', value: 20, description: '20% OFF now' },
  'SECRET50': { type: 'percentage', value: 50, description: '50% OFF now' },
};

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      currency = 'EUR',
      customer_name,
      country_code = 'FR',
      vat_number = '',
      is_business = false,
      promo_code = '',
      selected_plan = ''
    } = body;

    const userId = body.user_id;
    const email = body.email;

    if (!currency) {
      return {
        success: false,
        error: 'Missing parameters: currency required'
      };
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('Missing Stripe secret key configuration');
      return {
        success: false,
        error: 'Payment system is not properly configured'
      };
    }

    let stripe;
    try {
      stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-03-31.basil',
      });
    } catch (stripeInitError) {
      console.error('Failed to initialize Stripe:', stripeInitError);
      return {
        success: false,
        error: 'Payment system initialization failed'
      };
    }

    if (!selected_plan || (selected_plan !== 'premium' && selected_plan !== 'standard')) {
      console.log('Plan validation failed:', { received: selected_plan, allowed: ['premium', 'standard'] });
      return {
        success: false,
        error: 'Invalid plan selected'
      };
    }

    let baseAmount = 0;

    if (selected_plan === 'premium') {
      baseAmount = 24999; // 249.99€
    } else if (selected_plan === 'standard') {
      baseAmount = 14999; // 149.99€
    }

    let discountAmount = 0;
    let discountDescription = '';

    if (promo_code) {
      const upperCode = promo_code.toUpperCase();

      if (promoCodes[upperCode]) {
        const promoInfo = promoCodes[upperCode];

        if (promoInfo.type === 'percentage') {
          discountAmount = Math.round(baseAmount * (promoInfo.value / 100));
          discountDescription = `${promoInfo.value}% de réduction`;
        } else if (promoInfo.type === 'fixed') {
          discountAmount = promoInfo.value * 100;
          discountDescription = `${promoInfo.value}€ de réduction`;
        }

        discountAmount = Math.min(discountAmount, baseAmount - 1);
      }
    }

    const discountedBaseAmount = baseAmount - discountAmount;


    try {
      const customerData: any = {
        name: customer_name || 'StackUnity Client',
        address: {
          country: country_code,
        }
      };

      if (is_business && vat_number) {
        customerData.tax = {
          ip_address: event.node.req.headers['x-forwarded-for'] || event.node.req.socket.remoteAddress,
        };

        if (vat_number.substring(0, 2).toUpperCase() === country_code) {
          customerData.tax.tax_id = {
            type: 'eu_vat',
            value: vat_number
          };
        } else if (country_code.match(/^(AT|BE|BG|HR|CY|CZ|DK|EE|FI|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE)$/)) {
          customerData.tax.tax_id = {
            type: 'eu_vat',
            value: country_code + vat_number
          };
        }
      }

      const customer = await stripe.customers.create(customerData);

      if (userId) {
        try {
          await pool.execute(
            'INSERT INTO stripe_customers (user_id, customer_id) VALUES (?, ?)',
            [userId, customer.id]
          );
        } catch (dbError) {
          console.warn('Failed to save Stripe customer association:', dbError);
        }
      }

      let taxCalculation;
      try {
        taxCalculation = await stripe.tax.calculations.create({
          currency,
          line_items: [
            {
              amount: discountedBaseAmount,
              reference: 'premium_lifetime_access',
              tax_behavior: 'exclusive',
              tax_code: 'txcd_10103001',
            },
          ],
          customer_details: {
            address: {
              country: country_code,
            },
            address_source: 'billing',
            tax_id: is_business && vat_number ? {
              type: 'eu_vat',
              value: vat_number
            } : undefined,
            tax_exempt: is_business && vat_number && country_code !== 'FR' ? 'reverse_charge' : undefined
          },
        });
      } catch (taxError) {
        console.warn('Stripe Tax calculation failed, falling back to manual calculation:', taxError);

        let fallbackTaxRate = 0;

        if (is_business && vat_number && country_code !== 'FR' && country_code.match(/^(AT|BE|BG|HR|CY|CZ|DK|EE|FI|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE)$/)) {
          fallbackTaxRate = 0;
        } else if (country_code === 'FR') {
          fallbackTaxRate = 0.20;
        } else if (country_code === 'DE') {
          fallbackTaxRate = 0.19;
        } else if (country_code === 'ES') {
          fallbackTaxRate = 0.21;
        } else if (country_code === 'IT') {
          fallbackTaxRate = 0.22;
        } else if (country_code === 'BE') {
          fallbackTaxRate = 0.21;
        } else if (country_code === 'LU') {
          fallbackTaxRate = 0.17;
        } else if (country_code === 'NL') {
          fallbackTaxRate = 0.21;
        } else if (country_code === 'AT') {
          fallbackTaxRate = 0.20;
        } else if (country_code === 'PT') {
          fallbackTaxRate = 0.23;
        } else if (country_code === 'GR') {
          fallbackTaxRate = 0.24;
        } else if (country_code === 'FI') {
          fallbackTaxRate = 0.24;
        } else if (country_code === 'DK') {
          fallbackTaxRate = 0.25;
        } else if (country_code === 'SE') {
          fallbackTaxRate = 0.25;
        } else if (country_code === 'PL') {
          fallbackTaxRate = 0.23;
        } else if (country_code === 'CZ') {
          fallbackTaxRate = 0.21;
        } else if (country_code === 'HU') {
          fallbackTaxRate = 0.27;
        } else if (country_code === 'RO') {
          fallbackTaxRate = 0.19;
        } else if (country_code === 'BG') {
          fallbackTaxRate = 0.20;
        } else if (country_code === 'HR') {
          fallbackTaxRate = 0.25;
        } else if (country_code === 'SI') {
          fallbackTaxRate = 0.22;
        } else if (country_code === 'SK') {
          fallbackTaxRate = 0.20;
        } else if (country_code === 'EE') {
          fallbackTaxRate = 0.20;
        } else if (country_code === 'LT') {
          fallbackTaxRate = 0.21;
        } else if (country_code === 'LV') {
          fallbackTaxRate = 0.21;
        } else if (country_code === 'CY') {
          fallbackTaxRate = 0.19;
        } else if (country_code === 'MT') {
          fallbackTaxRate = 0.18;
        } else if (country_code === 'GB') {
          fallbackTaxRate = 0.20;
        } else if (country_code === 'CH') {
          fallbackTaxRate = 0.077;
        } else {
          fallbackTaxRate = 0;
        }

        const fallbackTaxAmount = Math.round(discountedBaseAmount * fallbackTaxRate);
        taxCalculation = {
          amount_total: discountedBaseAmount + fallbackTaxAmount,
          tax_amount_exclusive: fallbackTaxAmount,
          tax_breakdown: [{ tax_rate_percentage: fallbackTaxRate * 100 }]
        };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: taxCalculation ? taxCalculation.amount_total : discountedBaseAmount,
        currency,
        customer: customer.id,
        metadata: {
          customer_name,
          customer_email: email,
          customer_id: userId,
          vat_number,
          country_code,
          is_business: is_business.toString(),
          base_amount: baseAmount.toString(),
          discount_amount: discountAmount.toString(),
          discount_description: discountDescription,
          tax_amount: (taxCalculation ? taxCalculation.tax_amount_exclusive : 0).toString(),
          tax_rate: (taxCalculation ? (taxCalculation.tax_amount_exclusive / discountedBaseAmount * 100).toFixed(2) : '0').toString(),
          selected_plan,
          promo_code
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (userId) {
        await pool.execute(
          `UPDATE users SET 
           payment_status = 'pending'
           WHERE id = ?`,
          [userId]
        );
      }

      const taxPercentage = taxCalculation.tax_breakdown?.[0]?.tax_rate_percentage || 0;
      const isVatExempt = is_business && vat_number && country_code !== 'FR' && taxPercentage === 0;

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        taxDetails: {
          baseAmount: baseAmount / 100,
          discountAmount: discountAmount / 100,
          discountDescription: discountDescription,
          discountedBaseAmount: discountedBaseAmount / 100,
          taxAmount: taxCalculation ? taxCalculation.tax_amount_exclusive / 100 : 0,
          totalAmount: taxCalculation ? taxCalculation.amount_total / 100 : discountedBaseAmount / 100,
          taxPercentage: taxPercentage,
          isVatExempt: isVatExempt,
          vatNumber: vat_number
        }
      };
    } catch (stripeApiError: any) {
      console.error('Stripe API error:', stripeApiError?.message || stripeApiError);
      return {
        success: false,
        error: 'Payment processing error: ' + (stripeApiError?.message || 'Unknown Stripe error')
      };
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    };
  }
}); 