import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { getUserId } from '../../utils/auth-utils';
import { getPayPalClient } from '../../utils/paypal';
import { pool } from '../db';

const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

const formatExpiryDate = (expiry: string): string => {
  // Convertir MM/YY en YYYY-MM
  const [month, year] = expiry.split('/');
  const fullYear = `20${year}`; // Ajouter le préfixe "20" pour l'année
  return `${fullYear}-${month.padStart(2, '0')}`;
};

const validateCardDetails = (cardDetails: any) => {
  if (!cardDetails.name || !cardDetails.number || !cardDetails.cvv || !cardDetails.expiry) {
    throw new Error('Informations de carte incomplètes');
  }

  // Valider le numéro de carte (format Luhn)
  const number = cardDetails.number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(number)) {
    throw new Error('Numéro de carte invalide');
  }

  // Valider le CVV
  if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
    throw new Error('CVV invalide');
  }

  // Valider la date d'expiration
  const [month, year] = cardDetails.expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (parseInt(month) < 1 || parseInt(month) > 12) {
    throw new Error('Mois d\'expiration invalide');
  }

  if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
    throw new Error('Carte expirée');
  }
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
      cardDetails,
      billingAddress,
      amount,
      currency,
      description,
      username,
      billingCountry,
      isBusinessCustomer,
      vatNumber,
      promoCode
    } = body;

    // Valider les détails de la carte
    validateCardDetails(cardDetails);

    // Vérifier l'utilisateur
    const [userRows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
    if (!userRows || userRows.length === 0) {
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }

    const paypal = await getPayPalClient();
    console.log('✅ Client PayPal initialisé');

    // Générer un identifiant unique pour cette requête PayPal
    const requestId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Étape 1: Créer la commande
    const createRequest = new checkoutNodeJssdk.orders.OrdersCreateRequest();
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
      payment_source: {
        card: {
          number: cardDetails.number,
          expiry: formatExpiryDate(cardDetails.expiry),
          security_code: cardDetails.cvv,
          name: cardDetails.name,
          billing_address: {
            address_line_1: billingAddress.line1,
            admin_area_2: billingAddress.city,
            admin_area_1: billingAddress.state,
            postal_code: billingAddress.zip,
            country_code: billingCountry
          }
        }
      },
      application_context: {
        return_url: `http://localhost:3000/payment/3ds-return`,
        cancel_url: `http://localhost:3000/payment/cancel`
      }
    });


    const order = await paypal.execute(createRequest);
    const orderId = order.result.id;

    return {
      success: true,
      orderId
    };
  }
  catch (error: any) {
    console.error('Error processing card payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue lors du traitement du paiement'
    };
  }
}); 