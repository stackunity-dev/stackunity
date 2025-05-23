interface TaxDetails {
  baseAmount: number;
  discountAmount: number;
  discountDescription: string;
  discountedBaseAmount: number;
  taxAmount: number;
  taxPercentage: number;
  totalAmount: number;
  isVatExempt: boolean;
  vatNumber: string;
}

const EU_VAT_RATES: { [key: string]: number } = {
  'AT': 20, // Autriche
  'BE': 21, // Belgique
  'BG': 20, // Bulgarie
  'HR': 25, // Croatie
  'CY': 19, // Chypre
  'CZ': 21, // République tchèque
  'DK': 25, // Danemark
  'EE': 20, // Estonie
  'FI': 24, // Finlande
  'FR': 20, // France
  'DE': 19, // Allemagne
  'GR': 24, // Grèce
  'HU': 27, // Hongrie
  'IE': 23, // Irlande
  'IT': 22, // Italie
  'LV': 21, // Lettonie
  'LT': 21, // Lituanie
  'LU': 17, // Luxembourg
  'MT': 18, // Malte
  'NL': 21, // Pays-Bas
  'PL': 23, // Pologne
  'PT': 23, // Portugal
  'RO': 19, // Roumanie
  'SK': 20, // Slovaquie
  'SI': 22, // Slovénie
  'ES': 21, // Espagne
  'SE': 25  // Suède
};

export async function calculateTax(
  baseAmount: number,
  billingCountry: string,
  isBusinessCustomer: boolean,
  vatNumber: string
): Promise<TaxDetails> {
  const isVatExempt = Boolean(isBusinessCustomer && vatNumber && billingCountry !== 'FR');
  const taxPercentage = isVatExempt ? 0 : EU_VAT_RATES[billingCountry] || 0;
  const taxAmount = isVatExempt ? 0 : (baseAmount * taxPercentage) / 100;
  const totalAmount = baseAmount + taxAmount;

  return {
    baseAmount,
    discountAmount: 0,
    discountDescription: '',
    discountedBaseAmount: baseAmount,
    taxAmount,
    taxPercentage,
    totalAmount,
    isVatExempt,
    vatNumber: isVatExempt ? vatNumber : ''
  };
} 