import { getDetailedPaymentRecords, getPaymentSummary } from './payment-recorder';

interface MakePayload {
  summary: {
    total_amount: number;
    total_tax: number;
    total_discount: number;
    unique_customers: number;
    total_transactions: number;
  };
  customer_details: {
    emails: string[];
  };
  transactions: any[];
}

export async function sendToMake() {
  try {
    const summary = await getPaymentSummary();
    const detailedRecords = await getDetailedPaymentRecords();

    const payload: MakePayload = {
      summary: {
        total_amount: Number(summary.total_amount) || 0,
        total_tax: Number(summary.total_tax) || 0,
        total_discount: Number(summary.total_discount) || 0,
        unique_customers: Number(summary.unique_customers) || 0,
        total_transactions: Number(summary.total_transactions) || 0
      },
      customer_details: {
        emails: summary.customer_emails ? summary.customer_emails.split(',') : []
      },
      transactions: detailedRecords.map((record) => ({
        payment_id: record.payment_id,
        customer_id: record.customer_id,
        customer_name: record.customer_name,
        customer_email: record.customer_email,
        amount: record.amount,
        original_amount: record.original_amount,
        discount_amount: record.discount_amount,
        discount_description: record.discount_description,
        tax_amount: record.tax_amount,
        tax_rate: record.tax_rate,
        currency: record.currency,
        country_code: record.country_code,
        vat_number: record.vat_number,
        is_business: record.is_business,
        selected_plan: record.selected_plan,
        payment_date: record.payment_date,
        payment_status: record.payment_status
      }))
    };

    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!makeWebhookUrl) {
      throw new Error('MAKE_WEBHOOK_URL non défini dans les variables d\'environnement');
    }

    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'envoi à make.com: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données à make.com:', error);
    throw error;
  }
} 