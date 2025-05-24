import { defineEventHandler, readBody } from 'h3';
import { calculateTax } from '../../utils/taxCalculator';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      baseAmount,
      billingCountry,
      isBusinessCustomer,
      vatNumber
    } = body;

    if (!baseAmount || !billingCountry) {
      return {
        success: false,
        error: 'Informations manquantes'
      };
    }

    const taxDetails = await calculateTax(
      baseAmount,
      billingCountry,
      isBusinessCustomer,
      vatNumber
    );

    const promoCode = [
      {
        code: 'STACKUNITY10',
        discount: 0.1
      },
      {
        code: 'STACKUNITY20',
        discount: 0.2
      },
    ]

    return {
      success: true,
      taxDetails,
      promoCode
    };
  } catch (error) {
    console.error('Error calculating tax:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue'
    };
  }
}); 