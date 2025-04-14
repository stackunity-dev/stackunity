import { defineEventHandler, readBody } from 'h3';

const promoCodes = {
  'WELCOME10': { type: 'percentage', value: 10, description: '10% de réduction sur votre achat' },
  'WELCOME50': { type: 'percentage', value: 50, description: '50% de réduction sur votre achat' },
};

const usedCodes = new Set<string>();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { code } = body;

    if (!code) {
      return {
        success: false,
        error: 'Code promo manquant'
      };
    }

    const upperCode = code.toUpperCase();

    if (!promoCodes[upperCode]) {
      return {
        success: false,
        error: 'Code promo invalide'
      };
    }

    if (usedCodes.has(upperCode)) {
      return {
        success: false,
        error: 'Ce code a déjà été utilisé'
      };
    }

    usedCodes.add(upperCode);

    return {
      success: true,
      promoCode: {
        code: upperCode,
        ...promoCodes[upperCode]
      }
    };
  } catch (error) {
    console.error('Erreur lors de la validation du code promo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la validation du code promo'
    };
  }
}); 