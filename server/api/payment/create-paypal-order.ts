import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, readBody } from 'h3';
import { getUserId } from '../../utils/auth-utils';
import { getPayPalClient } from '../../utils/paypal';
import { calculateTax } from '../../utils/taxCalculator';
import { pool } from '../db';

const BASE_URL = process.env.NUXT_PUBLIC_APP_URL || 'https://stackunity.tech';

const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

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
    const {
      username,
      billingCountry,
      isBusinessCustomer,
      vatNumber,
      selectedPlan
    } = body;

    if (!username || !billingCountry) {
      return {
        success: false,
        error: 'Informations manquantes'
      };
    }

    const user = await pool.query('SELECT * FROM users WHERE username = ? ', [username]);

    if (!user) {
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }

    let discountAmount = 0;
    let discountDescription = '';

    const baseAmount = 249.99;
    const discountedBaseAmount = baseAmount - discountAmount;

    const taxDetails = await calculateTax(
      discountedBaseAmount,
      billingCountry,
      isBusinessCustomer,
      vatNumber
    );

    const paypal = await getPayPalClient();
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: formatAmount(taxDetails.totalAmount),
          breakdown: {
            item_total: {
              currency_code: 'EUR',
              value: formatAmount(discountedBaseAmount)
            },
            tax_total: {
              currency_code: 'EUR',
              value: formatAmount(taxDetails.taxAmount)
            },
            discount: {
              currency_code: 'EUR',
              value: formatAmount(discountAmount)
            }
          }
        },
        description: `StackUnity Premium - ${selectedPlan}`,
        custom_id: userId,
        invoice_id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        soft_descriptor: 'StackUnity Premium',
        items: [{
          name: 'StackUnity Premium',
          description: `Plan ${selectedPlan}`,
          quantity: '1',
          unit_amount: {
            currency_code: 'EUR',
            value: formatAmount(baseAmount)
          },
          tax: {
            currency_code: 'EUR',
            value: formatAmount(taxDetails.taxAmount)
          }
        }]
      }],
      application_context: {
        brand_name: 'StackUnity',
        locale: 'fr-FR',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: `${BASE_URL}/payment/3ds-return?userId=${userId}`,
        cancel_url: `${BASE_URL}/payment/cancel`
      }
    });

    const order = await paypal.execute(request);

    return {
      success: true,
      orderId: order.result.id,
      taxDetails
    };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue'
    };
  }
}); 