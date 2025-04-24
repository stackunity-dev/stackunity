import { pool } from '../db';

interface PaymentRecord {
  payment_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  original_amount?: number;
  discount_amount?: number;
  discount_description?: string;
  tax_amount?: number;
  tax_rate?: number;
  currency: string;
  country_code?: string;
  vat_number?: string;
  is_business: boolean;
  selected_plan?: string;
  payment_date: Date;
  payment_status: string;
}

export async function recordPayment(data: PaymentRecord) {
  const query = `
    INSERT INTO payment_records (
      payment_id,
      customer_id,
      customer_name,
      customer_email,
      amount,
      original_amount,
      discount_amount,
      discount_description,
      tax_amount,
      tax_rate,
      currency,
      country_code,
      vat_number,
      is_business,
      selected_plan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.payment_id,
    data.customer_id,
    data.customer_name,
    data.customer_email,
    data.amount,
    data.original_amount || null,
    data.discount_amount || null,
    data.discount_description || null,
    data.tax_amount || null,
    data.tax_rate || null,
    data.currency,
    data.country_code || null,
    data.vat_number || null,
    data.is_business,
    data.selected_plan || null
  ];

  try {
    const [result] = await pool.execute(query, values);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du paiement:', error);
    throw error;
  }
}

export async function getPaymentSummary() {
  const query = `
    SELECT 
      SUM(amount) as total_amount,
      SUM(tax_amount) as total_tax,
      SUM(discount_amount) as total_discount,
      COUNT(DISTINCT customer_id) as unique_customers,
      GROUP_CONCAT(DISTINCT customer_email) as customer_emails,
      COUNT(*) as total_transactions
    FROM payment_records
    WHERE payment_status = 'completed'
  `;

  try {
    const [rows] = await pool.execute(query);
    return rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération du résumé des paiements:', error);
    throw error;
  }
}

export async function getDetailedPaymentRecords(): Promise<PaymentRecord[]> {
  const query = `
    SELECT 
      pr.*,
      DATE_FORMAT(pr.payment_date, '%Y-%m-%d %H:%i:%s') as formatted_payment_date
    FROM payment_records pr
    WHERE payment_status = 'completed'
    ORDER BY payment_date DESC
  `;

  try {
    const [rows] = await pool.execute(query);
    return rows as PaymentRecord[];
  } catch (error) {
    console.error('Erreur lors de la récupération des enregistrements détaillés:', error);
    throw error;
  }
} 